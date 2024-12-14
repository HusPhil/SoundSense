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

// Sound Feedback functionality
const soundFeedback = {
    enabled: true,
    clickSound: new Audio('assets/click.mp3'),
    hoverSound: new Audio('assets/hover.mp3'),
    toggleSound: new Audio('assets/toggle.mp3'),
    errorSound: new Audio('assets/error.mp3')
};

// Set all feedback sounds volume to 0.3
Object.values(soundFeedback).forEach(sound => {
    if (sound instanceof Audio) {
        sound.volume = 0.3;
    }
});

// Sound feedback toggle functionality
const soundFeedbackToggle = document.querySelector('.toggle-item input[type="checkbox"]');
soundFeedbackToggle.addEventListener('change', (e) => {
    soundFeedback.enabled = e.target.checked;
    if (soundFeedback.enabled) {
        soundFeedback.toggleSound.play();
    }
});

// Function to play feedback sound
function playFeedback(soundType) {
    if (soundFeedback.enabled && soundFeedback[soundType]) {
        soundFeedback[soundType].currentTime = 0;
        soundFeedback[soundType].play();
    }
}

// Add sound feedback to interactive elements
document.querySelectorAll('button, .nav-item, input[type="checkbox"], .action-btn').forEach(element => {
    // Click sound
    element.addEventListener('click', () => {
        playFeedback('clickSound');
    });

    // Hover sound
    element.addEventListener('mouseenter', () => {
        playFeedback('hoverSound');
    });
});

// Add sound feedback to form inputs
document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
    input.addEventListener('focus', () => {
        playFeedback('clickSound');
    });

    // Error sound for invalid input
    input.addEventListener('invalid', () => {
        playFeedback('errorSound');
    });
});

// Add sound feedback to progress bar
progressBar.addEventListener('mousedown', () => {
    playFeedback('clickSound');
});

// Handle sound feedback toggle
const soundFeedbackToggleInput = document.querySelector('.sound-feedback input');
soundFeedbackToggleInput?.addEventListener('change', (e) => {
    console.log('Sound feedback:', e.target.checked);
});

// Handle like button
const likeButton = document.querySelector('.like-btn');
likeButton?.addEventListener('click', () => {
    const icon = likeButton.querySelector('i');
    icon.classList.toggle('fas');
    icon.classList.toggle('far');
    playFeedback('toggleSound');
});

// Handle search functionality
const searchInput = document.querySelector('.search-bar input');
const searchMic = document.querySelector('.search-bar .fa-microphone');

searchInput?.addEventListener('input', (e) => {
    console.log('Searching:', e.target.value);
});

searchMic?.addEventListener('click', () => {
    console.log('Voice search activated');
    playFeedback('toggleSound');
});

// Voice Feedback functionality
const voiceFeedback = {
    enabled: true,
    speaking: false,
    synth: window.speechSynthesis,
    voice: null
};

// Initialize voice
function initVoice() {
    // Wait for voices to be loaded
    speechSynthesis.addEventListener('voiceschanged', () => {
        const voices = speechSynthesis.getVoices();
        // Try to find an English voice
        voiceFeedback.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    });
}

initVoice();

// Function to speak text
function speak(text, priority = false) {
    if (!voiceFeedback.enabled || (!priority && voiceFeedback.speaking)) return;

    // Cancel any ongoing speech if this is a priority message
    if (priority) {
        voiceFeedback.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceFeedback.voice;
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
        voiceFeedback.speaking = true;
    };

    utterance.onend = () => {
        voiceFeedback.speaking = false;
    };

    voiceFeedback.synth.speak(utterance);
}

// Link voice feedback to sound feedback toggle
soundFeedbackToggle.addEventListener('change', (e) => {
    voiceFeedback.enabled = e.target.checked;
    if (e.target.checked) {
        speak("Sound and voice feedback enabled");
    }
});

// Add voice feedback to interactive elements
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const text = item.querySelector('span')?.textContent || '';
        speak(text);
    });
});

// Add voice feedback to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        const text = button.getAttribute('aria-label') || button.textContent || 'Button';
        speak(text);
    });
});

// Enhanced play button feedback
const playBtn = document.querySelector('.play-btn');
playBtn.addEventListener('click', () => {
    speak(playBtn.querySelector('i').classList.contains('fa-pause') ? "Pausing music" : "Playing music", true);
});

// Progress bar feedback
progressBar.addEventListener('mousedown', () => {
    speak("Adjusting music position");
});

// Like button enhanced feedback
likeButton.addEventListener('click', () => {
    const isLiked = likeButton.querySelector('i').classList.contains('fas');
    speak(isLiked ? "Added to favorites" : "Removed from favorites");
});

// Form input feedback
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        const label = input.previousElementSibling?.textContent || input.placeholder || input.type;
        speak(`Enter ${label}`);
    });

    input.addEventListener('invalid', () => {
        speak("Invalid input. Please check your entry.", true);
    });
});

// Search feedback
searchInput.addEventListener('focus', () => {
    speak("Search for music");
});

searchMic.addEventListener('click', () => {
    speak("Voice search activated", true);
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

// Comments navigation feedback
prevBtn.addEventListener('mouseenter', () => {
    speak("Previous comment");
});

nextBtn.addEventListener('mouseenter', () => {
    speak("Next comment");
});

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

// Audio player functionality
const audio = new Audio('assets/sound.mp3');

let isPlaying = false;

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.querySelector('i').classList.remove('fa-pause');
        playBtn.querySelector('i').classList.add('fa-play');
    } else {
        audio.play();
        playBtn.querySelector('i').classList.remove('fa-play');
        playBtn.querySelector('i').classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
});

// Update progress bar with audio progress
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    progressBar.style.setProperty('--value', `${progress}%`);
});

// Allow seeking when clicking progress bar
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    const time = (percentage / 100) * audio.duration;
    audio.currentTime = time;
});

// Reset play button when audio ends
audio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.querySelector('i').classList.remove('fa-pause');
    playBtn.querySelector('i').classList.add('fa-play');
    progressBar.value = 0;
    progressBar.style.setProperty('--value', '0%');
});

// Volume feedback
progressBar.addEventListener('change', () => {
    const value = progressBar.value;
    speak(`Progress ${Math.round(value)}%`);
});
