class FormHandler {
    constructor() {
        this.setupFormValidation();
        this.setupDynamicInputs();
    }

    setupFormValidation() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(form)) {
                    this.handleFormSubmit(form);
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            const value = input.value.trim();
            const validationType = input.dataset.validate;

            if (validationType) {
                const validationResult = this.validateInput(value, validationType);
                this.showValidationFeedback(input, validationResult);
                if (!validationResult.isValid) isValid = false;
            }
        });

        return isValid;
    }

    validateInput(value, type) {
        const validations = {
            email: {
                isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            },
            password: {
                isValid: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
                message: 'Password must be at least 8 characters with letters and numbers'
            },
            required: {
                isValid: value.length > 0,
                message: 'This field is required'
            }
        };

        return validations[type] || { isValid: true, message: '' };
    }

    showValidationFeedback(input, validation) {
        const feedback = input.nextElementSibling?.classList.contains('validation-feedback')
            ? input.nextElementSibling
            : document.createElement('div');

        feedback.className = `validation-feedback text-sm mt-1 ${
            validation.isValid ? 'text-green-500' : 'text-red-500'
        }`;
        feedback.textContent = validation.isValid ? '✓' : validation.message;

        if (!input.nextElementSibling?.classList.contains('validation-feedback')) {
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            this.showFormFeedback(form, {
                type: 'success',
                message: 'Form submitted successfully!'
            });

            form.reset();
        } catch (error) {
            this.showFormFeedback(form, {
                type: 'error',
                message: 'An error occurred. Please try again.'
            });
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    }

    showFormFeedback(form, feedback) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `mt-4 p-3 rounded ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`;
        feedbackElement.textContent = feedback.message;

        form.appendChild(feedbackElement);
        setTimeout(() => feedbackElement.remove(), 5000);
    }
} 