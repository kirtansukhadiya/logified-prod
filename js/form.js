// Contact Form Handling for LOGIFIED SOLUTIONS
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    console.log('Form found:', form);
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');

        // Validate form first
        if (!validateForm(form)) {
            return;
        }

        // Get form elements
        const formContent = form.querySelector('.form-content');
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const messageDiv = document.getElementById('formMessage');

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            // Send to the unified server (same domain)
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Hide form content with fade (keeping your animation)
                formContent.style.opacity = '0';
                formContent.style.transition = 'opacity 0.3s ease';

                // After fade out, show success message (your existing animation)
                setTimeout(() => {
                    formContent.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="font-size: 4rem; color: #10b981; margin-bottom: 1rem;">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h2 style="color: #10b981; margin-bottom: 1rem;">Thank You!</h2>
                            <p style="color: var(--secondary-color); margin-bottom: 2rem;">
                                ${result.message}
                            </p>
                            <button onclick="window.location.reload()" class="submit-btn" style="max-width: 200px; margin: 0 auto;">
                                Send Another Message
                            </button>
                        </div>
                    `;
                    formContent.style.opacity = '1';
                }, 300);

                console.log('✅ Email sent successfully!');
            } else {
                // Show error message
                showErrorMessage(result.message);
                resetButton();
            }

        } catch (error) {
            console.error('❌ Form submission error:', error);
            showErrorMessage('Network error. Please check your connection and try again, or contact us directly at kirtanskh@gmail.com.');
            resetButton();
        }

        function resetButton() {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }

        function showErrorMessage(message) {
            // Hide form content with fade
            formContent.style.opacity = '0';
            formContent.style.transition = 'opacity 0.3s ease';

            // Show error message with similar styling to success
            setTimeout(() => {
                formContent.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <div style="font-size: 4rem; color: #dc3545; margin-bottom: 1rem;">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 style="color: var(--text-color); margin-bottom: 1rem;">Oops!</h2>
                        <p style="color: var(--secondary-color); margin-bottom: 2rem;">
                            ${message}
                        </p>
                        <button onclick="window.location.reload()" class="submit-btn" style="max-width: 200px; margin: 0 auto; background-color: #dc3545;">
                            Try Again
                        </button>
                    </div>
                `;
                formContent.style.opacity = '1';
            }, 300);
        }
    });
});

// Enhanced form validation
function validateForm(form) {
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    
    if (!name || !email || !message) {
        showValidationError('Please fill in all required fields (Name, Email, and Message).');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showValidationError('Please enter a valid email address.');
        return false;
    }

    // Name validation (at least 2 characters)
    if (name.length < 2) {
        showValidationError('Please enter a valid name (at least 2 characters).');
        return false;
    }

    // Message validation (at least 10 characters)
    if (message.length < 10) {
        showValidationError('Please enter a more detailed message (at least 10 characters).');
        return false;
    }
    
    return true;
}

// Show validation errors with better UX
function showValidationError(message) {
    // Create or update error message element
    let errorDiv = document.getElementById('validationError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'validationError';
        errorDiv.style.cssText = `
            margin-top: 15px;
            padding: 12px;
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
            animation: shake 0.5s ease-in-out;
        `;
        
        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
        
        const form = document.getElementById('contactForm');
        form.appendChild(errorDiv);
    }
    
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }, 5000);
    
    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
