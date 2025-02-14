class BlockchainHandler {
    constructor() {
        this.initializeWeb3();
        this.initializeContracts();
        this.setupEventListeners();
    }

    async initializeWeb3() {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                console.error('User denied account access');
            }
        } else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider);
        } else {
            console.log('No Web3 provider detected');
        }
    }

    initializeContracts() {
        this.contracts = {
            voting: new this.web3.eth.Contract(VOTING_ABI, VOTING_ADDRESS),
            finance: new this.web3.eth.Contract(FINANCE_ABI, FINANCE_ADDRESS)
        };
    }

    setupEventListeners() {
        // Listen for blockchain events
        this.contracts.voting.events.VoteCast()
            .on('data', event => this.handleVoteEvent(event))
            .on('error', error => console.error('Vote event error:', error));

        this.contracts.finance.events.TransactionExecuted()
            .on('data', event => this.handleTransactionEvent(event))
            .on('error', error => console.error('Transaction event error:', error));
    }

    async castVote(proposalId, vote) {
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contracts.voting.methods.castVote(proposalId, vote)
                .send({ from: accounts[0] });
            return true;
        } catch (error) {
            console.error('Error casting vote:', error);
            return false;
        }
    }

    async executeTransaction(transaction) {
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contracts.finance.methods.executeTransaction(transaction)
                .send({ from: accounts[0] });
            return true;
        } catch (error) {
            console.error('Error executing transaction:', error);
            return false;
        }
    }

    handleVoteEvent(event) {
        // Update UI with vote event
        const notification = new NotificationSystem();
        notification.addNotification({
            type: 'success',
            title: 'Vote Cast',
            message: `Vote successfully recorded on blockchain`
        });
    }

    handleTransactionEvent(event) {
        // Update UI with transaction event
        this.updateTransactionHistory(event);
    }

    updateTransactionHistory(event) {
        const historyContainer = document.querySelector('.transaction-history');
        if (historyContainer) {
            const transactionElement = this.createTransactionElement(event);
            historyContainer.insertBefore(transactionElement, historyContainer.firstChild);
        }
    }

    createTransactionElement(event) {
        const element = document.createElement('div');
        element.className = 'transaction-item p-4 border-b';
        element.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">${event.returnValues.type}</h4>
                    <p class="text-sm text-gray-600">${event.transactionHash}</p>
                </div>
                <span class="text-green-500">Confirmed</span>
            </div>
        `;
        return element;
    }
} 