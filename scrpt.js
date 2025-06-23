document.addEventListener('DOMContentLoaded', function() {
                // DOM elements
                const passwordField = document.getElementById('password');
                const copyBtn = document.getElementById('copy-btn');
                const lengthInput = document.getElementById('length');
                const decreaseLengthBtn = document.getElementById('decrease-length');
                const increaseLengthBtn = document.getElementById('increase-length');
                const uppercaseCheckbox = document.getElementById('uppercase');
                const lowercaseCheckbox = document.getElementById('lowercase');
                const numbersCheckbox = document.getElementById('numbers');
                const symbolsCheckbox = document.getElementById('symbols');
                const weakBtn = document.getElementById('weak-btn');
                const mediumBtn = document.getElementById('medium-btn');
                const strongBtn = document.getElementById('strong-btn');
                const generateBtn = document.getElementById('generate-btn');
                const notification = document.getElementById('notification');

                // Character sets
                const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
                const numberChars = '0123456789';
                const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

                // Initialize with a generated password
                generatePassword();

                // Event listeners
                copyBtn.addEventListener('click', copyPassword);
                decreaseLengthBtn.addEventListener('click', () => adjustLength(-1));
                increaseLengthBtn.addEventListener('click', () => adjustLength(1));
                lengthInput.addEventListener('change', validateLength);
                generateBtn.addEventListener('click', generatePassword);

                // Strength buttons
                weakBtn.addEventListener('click', () => setStrength('weak'));
                mediumBtn.addEventListener('click', () => setStrength('medium'));
                strongBtn.addEventListener('click', () => setStrength('strong'));

                // Adjust password length
                function adjustLength(change) {
                    let newLength = parseInt(lengthInput.value) + change;
                    if (newLength >= parseInt(lengthInput.min) && newLength <= parseInt(lengthInput.max)) {
                        lengthInput.value = newLength;
                        generatePassword();
                    }
                }

                // Validate length input
                function validateLength() {
                    let value = parseInt(lengthInput.value);
                    if (isNaN(value) || value < parseInt(lengthInput.min)) {
                        lengthInput.value = lengthInput.min;
                    } else if (value > parseInt(lengthInput.max)) {
                        lengthInput.value = lengthInput.max;
                    }
                    generatePassword();
                }

                // Set strength level
                function setStrength(strength) {
                    // Update active button
                    weakBtn.classList.remove('active');
                    mediumBtn.classList.remove('active');
                    strongBtn.classList.remove('active');

                    if (strength === 'weak') {
                        weakBtn.classList.add('active');
                        lengthInput.value = 8;
                        uppercaseCheckbox.checked = true;
                        lowercaseCheckbox.checked = true;
                        numbersCheckbox.checked = false;
                        symbolsCheckbox.checked = false;
                    } else if (strength === 'medium') {
                        mediumBtn.classList.add('active');
                        lengthInput.value = 12;
                        uppercaseCheckbox.checked = true;
                        lowercaseCheckbox.checked = true;
                        numbersCheckbox.checked = true;
                        symbolsCheckbox.checked = false;
                    } else if (strength === 'strong') {
                        strongBtn.classList.add('active');
                        lengthInput.value = 16;
                        uppercaseCheckbox.checked = true;
                        lowercaseCheckbox.checked = true;
                        numbersCheckbox.checked = true;
                        symbolsCheckbox.checked = true;
                    }

                    generatePassword();
                }

                // Generate password with cryptographically secure random
                function generatePassword() {
                    let chars = '';
                    let password = '';

                    // Build character set based on selected options
                    if (uppercaseCheckbox.checked) chars += uppercaseChars;
                    if (lowercaseCheckbox.checked) chars += lowercaseChars;
                    if (numbersCheckbox.checked) chars += numberChars;
                    if (symbolsCheckbox.checked) chars += symbolChars;

                    // If no character types selected, use all
                    if (chars === '') {
                        chars = uppercaseChars + lowercaseChars + numberChars + symbolChars;
                        uppercaseCheckbox.checked = true;
                        lowercaseCheckbox.checked = true;
                        numbersCheckbox.checked = true;
                        symbolsCheckbox.checked = true;
                    }

                    // Generate password using cryptographically secure random
                    const array = new Uint8Array(lengthInput.value);
                    if (window.crypto && window.crypto.getRandomValues) {
                        window.crypto.getRandomValues(array);
                        for (let i = 0; i < lengthInput.value; i++) {
                            password += chars[array[i] % chars.length];
                        }
                    } else {
                        // Fallback to Math.random if crypto API not available
                        for (let i = 0; i < lengthInput.value; i++) {
                            const randomIndex = Math.floor(Math.random() * chars.length);
                            password += chars[randomIndex];
                        }
                    }

                    passwordField.value = password;
                }

                // Copy password to clipboard using modern Clipboard API
                async function copyPassword() {
                    try {
                        if (navigator.clipboard && window.isSecureContext) {
                            // Use modern Clipboard API
                            await navigator.clipboard.writeText(passwordField.value);
                        } else {
                            // Fallback for older browsers
                            passwordField.select();
                            document.execCommand('copy');
                        }

                        // Show notification
                        notification.style.display = 'block';
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 2000);
                    } catch (error) {
                        console.error('Failed to copy password:', error);
                        // Fallback method
                        passwordField.select();
                        document.execCommand('copy');
                        notification.style.display = 'block';
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 2000);
                    }
                }
            });
