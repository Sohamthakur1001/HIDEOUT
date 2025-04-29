/*-----------------------------------*\
  #MAIN JAVASCRIPT
\*-----------------------------------*/

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function() {
    // Selectors
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const contactForm = document.getElementById('feedbackForm');

    // Initialize the website
    initWebsite();

    // Initialize all website functionality
    function initWebsite() {
        setupNavigation();
        setupScrollEvents();
        setupMenuTabs();
        setupFormValidation();
        setupThemeSwitch();
        setupChefsSpecial();
        setupBurgerCustomization();
    }
    
    // Theme switching functionality
    function setupThemeSwitch() {
        const themeToggle = document.getElementById('checkbox');
        
        // Check for saved user preference, if any
        if(localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }
        
        // Listen for toggle changes
        themeToggle.addEventListener('change', function() {
            if(this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Navigation setup
    function setupNavigation() {
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
            });
        });
    }

    // Scroll events setup
    function setupScrollEvents() {
        // Header scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                scrollToTopBtn.classList.add('active');
            } else {
                header.classList.remove('scrolled');
                scrollToTopBtn.classList.remove('active');
            }
            
            // Update active nav link based on scroll position
            updateActiveNavOnScroll();
        });

        // Scroll to top button
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Update active navigation link based on scroll position
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section');
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Menu tabs setup
    function setupMenuTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get category from data attribute
                const category = this.getAttribute('data-category');
                
                // Hide all tab panes
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Show selected tab pane
                document.getElementById(category).classList.add('active');
            });
        });
    }

    // Form validation setup
    function setupFormValidation() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form inputs
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const subject = document.getElementById('subject');
                const message = document.getElementById('message');
                
                // Validate inputs
                let isValid = true;
                
                if (name.value.trim() === '') {
                    showError(name, 'Please enter your name');
                    isValid = false;
                } else {
                    removeError(name);
                }
                
                if (email.value.trim() === '') {
                    showError(email, 'Please enter your email');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Please enter a valid email');
                    isValid = false;
                } else {
                    removeError(email);
                }
                
                if (subject.value.trim() === '') {
                    showError(subject, 'Please enter a subject');
                    isValid = false;
                } else {
                    removeError(subject);
                }
                
                if (message.value.trim() === '') {
                    showError(message, 'Please enter your message');
                    isValid = false;
                } else {
                    removeError(message);
                }
                
                // If form is valid, show success message
                if (isValid) {
                    // Here you would normally send the form data to a server
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Your message has been sent successfully!';
                    
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                    
                    // Reset form after success message
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.innerHTML = '';
                        contactForm.appendChild(document.querySelector('.contact-form').innerHTML);
                        setupFormValidation();
                    }, 3000);
                }
            });
        }
    }

    // Show error message for form input
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message') || document.createElement('div');
        
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorMessage);
        }
        
        input.classList.add('error');
    }

    // Remove error message for form input
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            formGroup.removeChild(errorMessage);
        }
        
        input.classList.remove('error');
    }

    // Validate email format
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Chef's Special section functionality
    function setupChefsSpecial() {
        const specialItems = document.querySelectorAll('.special-item');
        const specialDots = document.querySelectorAll('.special-dot');
        const prevBtn = document.querySelector('.special-prev');
        const nextBtn = document.querySelector('.special-next');
        let currentIndex = 0;
        let autoSlideInterval;

        // Show the first special item by default
        specialItems[0].classList.add('active');
        specialDots[0].classList.add('active');

        // Start auto-sliding
        startAutoSlide();

        // Previous button click
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                resetAutoSlide();
                showPrevSpecial();
            });
        }

        // Next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                resetAutoSlide();
                showNextSpecial();
            });
        }

        // Dot navigation
        specialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                resetAutoSlide();
                showSpecial(index);
            });
        });

        // Show next special item
        function showNextSpecial() {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= specialItems.length) {
                nextIndex = 0;
            }
            showSpecial(nextIndex);
        }

        // Show previous special item
        function showPrevSpecial() {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = specialItems.length - 1;
            }
            showSpecial(prevIndex);
        }

        // Show specific special item
        function showSpecial(index) {
            specialItems.forEach(item => item.classList.remove('active'));
            specialDots.forEach(dot => dot.classList.remove('active'));
            
            specialItems[index].classList.add('active');
            specialDots[index].classList.add('active');
            
            currentIndex = index;
        }

        // Start automatic sliding
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                showNextSpecial();
            }, 5000); // Change slide every 5 seconds
        }

        // Reset auto-sliding after manual interaction
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }

    // Burger customization functionality
    function setupBurgerCustomization() {
        const ingredients = document.querySelectorAll('.ingredient');
        const constructionArea = document.getElementById('burgerConstruction');
        const resetButton = document.getElementById('resetBurger');
        const orderButton = document.getElementById('orderCustomBurger');
        const priceDisplay = document.getElementById('burgerPrice');
        
        const ingredientPrices = {
            'bun-top': 15,
            'lettuce': 10,
            'tomato': 10,
            'cheese': 20,
            'patty': 50,
            'onion': 10,
            'pickle': 15,
            'sauce': 10,
            'bun-bottom': 15
        };
        
        let totalPrice = 120; // Base price
        let addedIngredients = [];
        
        // Set initial price
        updatePrice();
        
        // Initialize drag events for ingredients
        ingredients.forEach(ingredient => {
            ingredient.addEventListener('dragstart', dragStart);
            ingredient.addEventListener('dragend', dragEnd);
        });
        
        // Initialize drop area
        if (constructionArea) {
            constructionArea.addEventListener('dragover', dragOver);
            constructionArea.addEventListener('dragenter', dragEnter);
            constructionArea.addEventListener('dragleave', dragLeave);
            constructionArea.addEventListener('drop', drop);
        }
        
        // Reset burger button
        if (resetButton) {
            resetButton.addEventListener('click', resetBurger);
        }
        
        // Order custom burger button
        if (orderButton) {
            orderButton.addEventListener('click', orderBurger);
        }
        
        // Drag start event
        function dragStart(e) {
            const ingredientType = this.getAttribute('data-ingredient');
            e.dataTransfer.setData('text/plain', ingredientType);
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
        }
        
        // Drag end event
        function dragEnd() {
            this.classList.remove('dragging');
        }
        
        // Drag over event
        function dragOver(e) {
            e.preventDefault();
        }
        
        // Drag enter event
        function dragEnter(e) {
            e.preventDefault();
            this.classList.add('drop-highlight');
        }
        
        // Drag leave event
        function dragLeave() {
            this.classList.remove('drop-highlight');
        }
        
        // Drop event
        function drop(e) {
            e.preventDefault();
            this.classList.remove('drop-highlight');
            
            // Remove placeholder if it exists
            const placeholder = this.querySelector('.burger-placeholder');
            if (placeholder) {
                this.removeChild(placeholder);
            }
            
            // Get the dropped ingredient type
            const ingredientType = e.dataTransfer.getData('text/plain');
            
            // Find the ingredient element
            const ingredientElement = document.querySelector(`.ingredient[data-ingredient="${ingredientType}"]`);
            
            if (ingredientElement) {
                // Create a new burger ingredient element
                const burgerIngredient = document.createElement('div');
                burgerIngredient.className = 'burger-ingredient';
                burgerIngredient.setAttribute('data-ingredient', ingredientType);
                
                const img = document.createElement('img');
                img.src = ingredientElement.querySelector('img').src;
                img.alt = ingredientElement.querySelector('span').textContent;
                
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-ingredient';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', function() {
                    removeIngredient(burgerIngredient, ingredientType);
                });
                
                burgerIngredient.appendChild(img);
                burgerIngredient.appendChild(removeBtn);
                
                // Add to the construction area
                constructionArea.appendChild(burgerIngredient);
                
                // Update ingredients list and price
                addedIngredients.push(ingredientType);
                totalPrice += ingredientPrices[ingredientType] || 0;
                updatePrice();
            }
        }
        
        // Remove ingredient from burger
        function removeIngredient(element, ingredientType) {
            element.remove();
            
            // Update ingredients list and price
            const index = addedIngredients.indexOf(ingredientType);
            if (index !== -1) {
                addedIngredients.splice(index, 1);
                totalPrice -= ingredientPrices[ingredientType] || 0;
                updatePrice();
            }
            
            // Add placeholder if no ingredients
            if (addedIngredients.length === 0) {
                addPlaceholder();
            }
        }
        
        // Update price display
        function updatePrice() {
            if (priceDisplay) {
                priceDisplay.textContent = `₹ ${totalPrice}`;
            }
        }
        
        // Reset burger
        function resetBurger() {
            if (constructionArea) {
                // Clear construction area
                constructionArea.innerHTML = '';
                
                // Reset price and ingredients
                addedIngredients = [];
                totalPrice = 120; // Base price
                updatePrice();
                
                // Add placeholder
                addPlaceholder();
            }
        }
        
        // Add placeholder to construction area
        function addPlaceholder() {
            const placeholder = document.createElement('div');
            placeholder.className = 'burger-placeholder';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-arrow-left';
            
            const text = document.createElement('p');
            text.textContent = 'Drag ingredients here';
            
            placeholder.appendChild(icon);
            placeholder.appendChild(text);
            
            constructionArea.appendChild(placeholder);
        }
        
        // Order burger
        function orderBurger() {
            if (addedIngredients.length > 0) {
                alert(`Your custom burger has been ordered for ₹ ${totalPrice}! It will be ready in 15 minutes.`);
                resetBurger();
            } else {
                alert('Please add some ingredients to your burger first!');
            }
        }
    }

    // Reveal animation for sections on scroll
    const revealElements = document.querySelectorAll('.section-title, .about-content, .menu-tabs, .gallery-grid, .contact-wrapper, .special-showcase, .customizer-container');
    
    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on page load
});
