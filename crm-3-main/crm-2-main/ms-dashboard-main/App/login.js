document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomePanel = document.getElementById('welcomePanel');
    const formPanel = document.getElementById('formPanel');
    const switchBtn = document.getElementById('switchBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');

    let isLoginMode = true;

    // Form switching functionality with sliding animation
    function switchToRegister() {
        isLoginMode = false;
        
        // Update welcome panel content
        welcomeMessage.textContent = 'Already have an account?';
        switchBtn.textContent = 'Login';
        
        // Slide panels
        welcomePanel.classList.add('slide-right');
        formPanel.classList.add('slide-left');
        
        // Switch forms after animation
        setTimeout(() => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }, 300);
    }

    function switchToLogin() {
        isLoginMode = true;
        
        // Update welcome panel content
        welcomeMessage.textContent = 'Don\'t have an account?';
        switchBtn.textContent = 'Register';
        
        // Slide panels back
        welcomePanel.classList.remove('slide-right');
        formPanel.classList.remove('slide-left');
        
        // Switch forms after animation
        setTimeout(() => {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }, 300);
    }

    // Event listener for switch button
    switchBtn.addEventListener('click', function() {
        if (isLoginMode) {
            switchToRegister();
        } else {
            switchToLogin();
        }
    });

    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(element, message) {
        const formGroup = element.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }

    function clearError(element) {
        const formGroup = element.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function setLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Login form submission
    loginFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const submitBtn = this.querySelector('.submit-btn');
        
        // Clear previous errors
        clearError(document.getElementById('loginUsername'));
        clearError(document.getElementById('loginPassword'));
        
        // Validation
        let hasError = false;
        
        if (!username) {
            showError(document.getElementById('loginUsername'), 'Username is required');
            hasError = true;
        }
        
        if (!password) {
            showError(document.getElementById('loginPassword'), 'Password is required');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Set loading state
        setLoading(submitBtn, true);
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: username.includes('@') ? username : username + '@example.com', // Only add @example.com if not already an email
                    password: password,
                    userType: 'regular'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store user data in session storage
                const userData = {
                    email: username.includes('@') ? username : username + '@example.com',
                    username: username,
                    userType: 'regular'
                };
                sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
                
                // Show success message
                showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'Index.html';
                }, 1000);
            } else {
                showMessage(data.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            setLoading(submitBtn, false);
        }
    });

    // Signup form submission
    signupFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const submitBtn = this.querySelector('.submit-btn');
        
        // Clear previous errors
        clearError(document.getElementById('signupName'));
        clearError(document.getElementById('signupEmail'));
        clearError(document.getElementById('signupPassword'));
        clearError(document.getElementById('signupConfirmPassword'));
        
        // Validation
        let hasError = false;
        
        if (!username) {
            showError(document.getElementById('signupName'), 'Full name is required');
            hasError = true;
        }
        
        if (!email) {
            showError(document.getElementById('signupEmail'), 'Email is required');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError(document.getElementById('signupEmail'), 'Please enter a valid email');
            hasError = true;
        }
        
        if (!password) {
            showError(document.getElementById('signupPassword'), 'Password is required');
            hasError = true;
        } else if (!validatePassword(password)) {
            showError(document.getElementById('signupPassword'), 'Password must be at least 6 characters');
            hasError = true;
        }
        
        if (!confirmPassword) {
            showError(document.getElementById('signupConfirmPassword'), 'Please confirm your password');
            hasError = true;
        } else if (password !== confirmPassword) {
            showError(document.getElementById('signupConfirmPassword'), 'Passwords do not match');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Set loading state
        setLoading(submitBtn, true);
        
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    userType: 'regular'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Account created successfully! Please sign in.', 'success');
                
                // Clear form
                signupFormElement.reset();
                
                // Switch to login form
                setTimeout(() => {
                    switchToLogin();
                }, 1500);
            } else {
                showMessage(data.message || 'Signup failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            setLoading(submitBtn, false);
        }
    });

    // Real-time validation
    document.getElementById('signupEmail').addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError(this, 'Please enter a valid email');
        } else {
            clearError(this);
        }
    });

    document.getElementById('signupPassword').addEventListener('blur', function() {
        const password = this.value;
        if (password && !validatePassword(password)) {
            showError(this, 'Password must be at least 6 characters');
        } else {
            clearError(this);
        }
    });

    document.getElementById('signupConfirmPassword').addEventListener('blur', function() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = this.value;
        if (confirmPassword && password !== confirmPassword) {
            showError(this, 'Passwords do not match');
        } else {
            clearError(this);
        }
    });

    // Clear errors on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    // Message display function
    function showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                messageDiv.style.backgroundColor = '#28a745';
                break;
            case 'error':
                messageDiv.style.backgroundColor = '#dc3545';
                break;
            default:
                messageDiv.style.backgroundColor = '#17a2b8';
        }
        
        // Add to page
        document.body.appendChild(messageDiv);
        
        // Animate in
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }

    // Check if user is already logged in
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        window.location.href = 'Index.html';
    }

    // Focus on first input when form is shown
    document.getElementById('loginUsername').focus();
});