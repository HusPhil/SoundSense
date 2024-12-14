// Progress bar functionality
const progressBar = document.querySelector('.progress');

function updateProgressBar(e) {
    const rect = progressBar.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const width = rect.width;
    const percentage = Math.min(Math.max((x / width) * 100, 0), 100);
    
    progressBar.value = percentage;
    progressBar.style.setProperty('--value', `${percentage}%`);
}

// Mouse events
progressBar.addEventListener('mousedown', (e) => {
    updateProgressBar(e);
    document.addEventListener('mousemove', updateProgressBar);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', updateProgressBar);
    }, { once: true });
});

// Touch events
progressBar.addEventListener('touchstart', (e) => {
    e.preventDefault();
    updateProgressBar(e);
    document.addEventListener('touchmove', updateProgressBar, { passive: false });
    document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', updateProgressBar);
    }, { once: true });
});

// Set initial progress value
progressBar.style.setProperty('--value', '50%');

// Handle sound feedback toggle
const soundFeedbackToggle = document.querySelector('.sound-feedback input');
soundFeedbackToggle?.addEventListener('change', (e) => {
    console.log('Sound feedback:', e.target.checked);
});

// Handle like button
const likeButton = document.querySelector('.like-btn');
likeButton?.addEventListener('click', () => {
    const icon = likeButton.querySelector('i');
    icon.classList.toggle('fas');
    icon.classList.toggle('far');
});

// Handle search functionality
const searchInput = document.querySelector('.search-bar input');
const searchMic = document.querySelector('.search-bar .fa-microphone');

searchInput?.addEventListener('input', (e) => {
    console.log('Searching:', e.target.value);
});

searchMic?.addEventListener('click', () => {
    console.log('Voice search activated');
});

// Slideshow functionality
const slides = document.querySelectorAll('.comment');
const prevBtn = document.querySelector('.slide-btn.prev');
const nextBtn = document.querySelector('.slide-btn.next');
const dotsContainer = document.querySelector('.slide-dots');

let currentSlide = 0;
const slideCount = slides.length;

// Initialize first slide
slides[0].classList.add('active');

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    // Update current slide
    currentSlide = index;
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    updateDots();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slideCount);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-advance slides every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause auto-advance on hover
const container = document.getElementById('comments_container');
container.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

container.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});
