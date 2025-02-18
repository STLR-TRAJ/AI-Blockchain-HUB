// SSO Configuration and Implementation
class SSOService {
    constructor() {
        this.providers = {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                redirectUri: 'https://your-domain.com/auth/google/callback'
            },
            github: {
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                redirectUri: 'https://your-domain.com/auth/github/callback'
            },
            microsoft: {
                clientId: process.env.MICROSOFT_CLIENT_ID,
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
                redirectUri: 'https://your-domain.com/auth/microsoft/callback'
            }
        };
        this.securityUtils = new SecurityUtils();
    }

    async initializeSSO(provider) {
        try {
            const state = this.securityUtils.generateSecureToken();
            sessionStorage.setItem('sso_state', state);

            const authUrl = this.buildAuthUrl(provider, state);
            return authUrl;
        } catch (error) {
            console.error('SSO Initialization Error:', error);
            throw new Error('Failed to initialize SSO');
        }
    }

    buildAuthUrl(provider, state) {
        const config = this.providers[provider];
        if (!config) throw new Error('Invalid SSO provider');

        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            response_type: 'code',
            scope: this.getScope(provider),
            state: state
        });

        return `${this.getAuthEndpoint(provider)}?${params.toString()}`;
    }

    getScope(provider) {
        switch(provider) {
            case 'google':
                return 'openid email profile';
            case 'github':
                return 'user:email read:user';
            case 'microsoft':
                return 'openid email profile';
            default:
                return '';
        }
    }

    getAuthEndpoint(provider) {
        switch(provider) {
            case 'google':
                return 'https://accounts.google.com/o/oauth2/v2/auth';
            case 'github':
                return 'https://github.com/login/oauth/authorize';
            case 'microsoft':
                return 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
            default:
                throw new Error('Invalid provider');
        }
    }

    async handleCallback(provider, code, state) {
        try {
            // Verify state to prevent CSRF
            const savedState = sessionStorage.getItem('sso_state');
            if (state !== savedState) {
                throw new Error('Invalid state parameter');
            }

            const tokenResponse = await this.exchangeCodeForToken(provider, code);
            const userInfo = await this.getUserInfo(provider, tokenResponse.access_token);

            // Create or update user in your system
            return await this.handleUserAuthentication(userInfo, provider);
        } catch (error) {
            console.error('SSO Callback Error:', error);
            throw new Error('SSO authentication failed');
        } finally {
            sessionStorage.removeItem('sso_state');
        }
    }

    async exchangeCodeForToken(provider, code) {
        const config = this.providers[provider];
        const tokenEndpoint = this.getTokenEndpoint(provider);

        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code: code,
                redirect_uri: config.redirectUri,
                grant_type: 'authorization_code'
            })
        });

        if (!response.ok) {
            throw new Error('Token exchange failed');
        }

        return await response.json();
    }

    async getUserInfo(provider, accessToken) {
        const userInfoEndpoint = this.getUserInfoEndpoint(provider);
        
        const response = await fetch(userInfoEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        return await response.json();
    }
} 