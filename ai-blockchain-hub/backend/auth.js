class AuthHandler {
    constructor(type) {
        this.type = type; // 'login' or 'register'
        this.form = document.getElementById(`${type}-form`);
        this.setupFormValidation();
    }

    setupFormValidation() {
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.handleSubmit();
            }
        });

        // Real-time password validation for register
        if (this.type === 'register') {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            confirmPassword?.addEventListener('input', () => {
                this.validatePasswordMatch(password?.value, confirmPassword.value);
            });
        }
    }

    validateForm() {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;

        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        if (!this.validatePassword(password)) {
            this.showError('Password must be at least 8 characters long and contain letters and numbers');
            return false;
        }

        if (this.type === 'register') {
            const name = document.getElementById('name')?.value;
            const confirmPassword = document.getElementById('confirm-password')?.value;
            const terms = document.getElementById('terms')?.checked;

            if (!name?.trim()) {
                this.showError('Please enter your name');
                return false;
            }

            if (password !== confirmPassword) {
                this.showError('Passwords do not match');
                return false;
            }

            if (!terms) {
                this.showError('Please accept the terms and conditions');
                return false;
            }
        }

        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePassword(password) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    }

    validatePasswordMatch(password, confirmPassword) {
        const confirmInput = document.getElementById('confirm-password');
        if (password !== confirmPassword) {
            confirmInput?.classList.add('border-red-500');
            confirmInput?.classList.remove('border-green-500');
        } else {
            confirmInput?.classList.remove('border-red-500');
            confirmInput?.classList.add('border-green-500');
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await this.sendRequest(data);
            if (response.success) {
                // Store token and redirect
                localStorage.setItem('token', response.token);
                window.location.href = 'DashBoard.html';
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            this.showError('An error occurred. Please try again.');
        }
    }

    async sendRequest(data) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demonstration purposes
        return {
            success: true,
            token: 'dummy_token',
            user: {
                name: data.name,
                email: data.email
            }
        };
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
        errorDiv.role = 'alert';
        errorDiv.innerHTML = message;

        this.form?.insertBefore(errorDiv, this.form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
} 