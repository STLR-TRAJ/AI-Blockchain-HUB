class FAQHandler {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const faqItems = document.querySelectorAll('.faq-item button');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                const content = item.nextElementSibling;
                const icon = item.querySelector('i');

                // Toggle content
                content.classList.toggle('hidden');
                
                // Toggle icon
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
        });
    }
} 