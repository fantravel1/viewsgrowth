/* ===========================
   ViewsGrowth Main JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initToolsFilter();
    initProgressTracker();
    initNewsletterForm();
    initBackToTop();
});

/* ===========================
   Mobile Hamburger Menu
   =========================== */
function initMobileMenu() {
    const nav = document.querySelector('nav[role="navigation"]');
    if (!nav) return;

    const container = nav.querySelector('.container');
    if (!container) return;

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    // Create logo/brand link
    const brand = document.createElement('a');
    brand.href = 'index.html';
    brand.className = 'nav-brand';
    brand.textContent = 'ViewsGrowth';

    // Wrap existing links
    const navLinks = document.createElement('div');
    navLinks.className = 'nav-links';

    // Move existing links to nav-links container
    while (container.firstChild) {
        navLinks.appendChild(container.firstChild);
    }

    // Add new structure
    container.appendChild(brand);
    container.appendChild(hamburger);
    container.appendChild(navLinks);

    // Toggle menu on click
    hamburger.addEventListener('click', function() {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ===========================
   Tools Page Filtering
   =========================== */
function initToolsFilter() {
    const filterContainer = document.querySelector('.filter-buttons');
    if (!filterContainer) return;

    const filterButtons = filterContainer.querySelectorAll('[data-filter]');
    const toolSections = document.querySelectorAll('[data-category]');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter sections
            toolSections.forEach(section => {
                if (filter === 'all' || section.getAttribute('data-category') === filter) {
                    section.style.display = '';
                    section.classList.add('fade-in');
                } else {
                    section.style.display = 'none';
                    section.classList.remove('fade-in');
                }
            });
        });
    });
}

/* ===========================
   Progress Tracking
   =========================== */
function initProgressTracker() {
    const progressBar = document.querySelector('.progress-tracker');
    if (!progressBar) return;

    // Define the learning path pages in order
    const learningPath = [
        'getting-started.html',
        'tools.html',
        'algorithm.html',
        'production.html',
        'analytics.html',
        'monetization.html',
        'ai-tools.html',
        'case-studies.html',
        'resources.html'
    ];

    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Load progress from localStorage
    let progress = JSON.parse(localStorage.getItem('viewsgrowth-progress') || '{}');

    // Mark current page as visited
    if (learningPath.includes(currentPage)) {
        progress[currentPage] = true;
        localStorage.setItem('viewsgrowth-progress', JSON.stringify(progress));
    }

    // Calculate progress percentage
    const visitedCount = learningPath.filter(page => progress[page]).length;
    const percentage = Math.round((visitedCount / learningPath.length) * 100);

    // Update progress bar
    const fill = progressBar.querySelector('.progress-fill');
    const text = progressBar.querySelector('.progress-text');

    if (fill) fill.style.width = percentage + '%';
    if (text) text.textContent = `${visitedCount}/${learningPath.length} sections completed (${percentage}%)`;

    // Mark completed items in the nav
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (progress[href]) {
            link.classList.add('completed');
        }
    });
}

/* ===========================
   Newsletter Form
   =========================== */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const message = form.querySelector('.form-message');

        if (!emailInput || !emailInput.value) return;

        // Validate email
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            if (message) {
                message.textContent = 'Please enter a valid email address.';
                message.className = 'form-message error';
            }
            return;
        }

        // Simulate form submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        // In production, this would send to a real endpoint
        setTimeout(function() {
            // Store subscription locally (for demo)
            localStorage.setItem('viewsgrowth-subscribed', 'true');
            localStorage.setItem('viewsgrowth-email', email);

            // Show success message
            if (message) {
                message.textContent = 'Thanks for subscribing! Check your inbox for the welcome guide.';
                message.className = 'form-message success';
            }

            emailInput.value = '';
            submitBtn.textContent = 'Subscribed!';
            submitBtn.disabled = true;

            // Hide form after success
            setTimeout(function() {
                const container = form.closest('.newsletter-section');
                if (container) {
                    container.innerHTML = '<div class="newsletter-success"><h3>You\'re all set!</h3><p>Check your inbox for the complete YouTube Growth Blueprint.</p></div>';
                }
            }, 2000);
        }, 1000);
    });

    // Check if already subscribed
    if (localStorage.getItem('viewsgrowth-subscribed') === 'true') {
        const container = form.closest('.newsletter-section');
        if (container) {
            container.innerHTML = '<div class="newsletter-success"><h3>Welcome back!</h3><p>You\'re already subscribed to ViewsGrowth updates.</p></div>';
        }
    }
}

/* ===========================
   Back to Top Enhancement
   =========================== */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    // Show/hide based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial check
}

/* ===========================
   Utility Functions
   =========================== */

// Reset progress (for testing)
function resetProgress() {
    localStorage.removeItem('viewsgrowth-progress');
    localStorage.removeItem('viewsgrowth-subscribed');
    localStorage.removeItem('viewsgrowth-email');
    location.reload();
}
