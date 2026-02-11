// Floating hearts functionality
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    const textHeartsContainer = document.getElementById('textHeartsContainer');
    
    // Create background floating hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['💕', '💖', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 15 + 's';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heartsContainer.appendChild(heart);
        }, i * 200);
    }
    
    // Create text-specific floating hearts for landing page
    if (textHeartsContainer) {
        createTextHearts(textHeartsContainer);
    }
    
    // Create hearts for letter layer when it becomes active
    setTimeout(() => {
        const letterHeartsContainer = document.getElementById('letterHeartsContainer');
        if (letterHeartsContainer) {
            createTextHearts(letterHeartsContainer);
        }
    }, 2000);
}

function createTextHearts(container) {
    // Create text-specific floating hearts
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const textHeart = document.createElement('div');
            textHeart.className = 'text-heart';
            textHeart.innerHTML = ['💕', '💖', '💗'][Math.floor(Math.random() * 3)];
            textHeart.style.left = (Math.random() * 80 + 10) + '%';
            textHeart.style.top = (Math.random() * 60 + 10) + '%';
            textHeart.style.animationDelay = Math.random() * 8 + 's';
            textHeart.style.fontSize = (Math.random() * 8 + 12) + 'px';
            container.appendChild(textHeart);
        }, i * 300);
    }
    
    // Create heart balloons
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'heart-balloon';
            balloon.innerHTML = ['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)];
            balloon.style.left = (Math.random() * 70 + 15) + '%';
            balloon.style.top = (Math.random() * 50 + 20) + '%';
            balloon.style.animationDelay = Math.random() * 12 + 's';
            balloon.style.fontSize = (Math.random() * 15 + 35) + 'px';
            container.appendChild(balloon);
        }, i * 400);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== PAGE LOADED ===');
    createFloatingHearts();
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        attachEnvelopeListeners();
        attachContinueButtonListeners();
    }, 100);
});

// Attach event listeners to all continue buttons
function attachContinueButtonListeners() {
    console.log('=== ATTACHING CONTINUE BUTTON LISTENERS ===');
    
    // Wait a moment to ensure all buttons are in the DOM
    setTimeout(() => {
        // Layer 1 button (Letter -> Final)
        const layer1 = document.getElementById('layer1');
        if (layer1) {
            const layer1Buttons = layer1.querySelectorAll('.continue-btn');
            layer1Buttons.forEach(button => {
                // Remove any existing onclick
                button.removeAttribute('onclick');
                
                // Add new click handler
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Layer 1 button clicked - showing thank you message');
                    showThankYouMessage();
                }, true);
            });
            console.log('Layer 1 button listener attached');
        }
        
        console.log('=== ALL CONTINUE BUTTON LISTENERS ATTACHED ===');
    }, 500);
}

function attachEnvelopeListeners() {
    const envelope = document.getElementById('envelope');
    
    if (!envelope) {
        console.error('Envelope element not found!');
        return;
    }
    
    console.log('Attaching hold listeners to envelope...');
    
    let isHolding = false;
    
    // Double-click as a backup/test method
    envelope.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Double-click detected - opening envelope immediately');
        openEnvelope();
    });
    
    // Mouse events for desktop
    envelope.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mouse down - starting hold');
        isHolding = true;
        startHold();
    });

    envelope.addEventListener('mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mouse up - ending hold');
        isHolding = false;
        endHold();
    });

    envelope.addEventListener('mouseleave', (e) => {
        if (isHolding) {
            console.log('Mouse leave - canceling hold');
            isHolding = false;
            endHold();
        }
    });

    // Touch events for mobile
    envelope.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Touch start - starting hold');
        isHolding = true;
        startHold();
    }, { passive: false });

    envelope.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Touch end - ending hold');
        isHolding = false;
        endHold();
    }, { passive: false });

    envelope.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Touch cancel - canceling hold');
        isHolding = false;
        endHold();
    }, { passive: false });
    
    console.log('Envelope listeners attached successfully');
    console.log('TIP: You can also double-click the envelope to open it immediately for testing');
}

// Envelope interaction
let holdTimer = null;
let holdProgress = 0;

function startHold() {
    console.log('=== STARTING HOLD ===');
    holdProgress = 0;
    
    // Clear any existing timer
    if (holdTimer) {
        clearInterval(holdTimer);
        holdTimer = null;
    }
    
    const holdInstruction = document.getElementById('holdInstruction');
    const envelope = document.getElementById('envelope');
    
    // Add visual feedback
    if (envelope) {
        envelope.style.transform = 'scale(1.05)';
    }
    
    holdTimer = setInterval(() => {
        holdProgress += 100/30; // 3 seconds = 30 intervals of 100ms
        console.log('Hold progress:', Math.round(holdProgress) + '%');
        updateProgressRing(holdProgress);
        
        if (holdProgress >= 100) {
            console.log('=== HOLD COMPLETE! OPENING ENVELOPE ===');
            clearInterval(holdTimer);
            holdTimer = null;
            openEnvelope();
        }
    }, 100);
}

function endHold() {
    console.log('=== ENDING HOLD === Progress was:', Math.round(holdProgress) + '%');
    
    if (holdTimer) {
        clearInterval(holdTimer);
        holdTimer = null;
    }
    
    holdProgress = 0;
    
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.style.transform = 'scale(1)';
    }
    
    // Reset instruction text
    const holdInstruction = document.getElementById('holdInstruction');
    if (holdInstruction) {
        holdInstruction.textContent = 'Click and hold for 3 seconds...';
        holdInstruction.style.color = '';
    }
}

function updateProgressRing(percent) {
    const holdInstruction = document.getElementById('holdInstruction');
    
    // Update instruction text with progress
    if (holdInstruction) {
        if (percent < 33) {
            holdInstruction.textContent = 'Keep holding... ' + Math.round(percent) + '%';
            holdInstruction.style.color = '#ff6b9d';
        } else if (percent < 66) {
            holdInstruction.textContent = 'Almost there... ' + Math.round(percent) + '%';
            holdInstruction.style.color = '#d4396c';
        } else if (percent < 100) {
            holdInstruction.textContent = 'Just a little more... ' + Math.round(percent) + '%';
            holdInstruction.style.color = '#c66cfd';
        }
    }
    
    console.log('Visual progress update:', Math.round(percent) + '%');
}

function openEnvelope() {
    console.log('=== OPENING ENVELOPE FUNCTION CALLED ===');
    
    // Hide landing page
    const landingPage = document.getElementById('landingPage');
    console.log('Landing page element:', landingPage);
    
    if (landingPage) {
        console.log('Removing active class from landing page...');
        landingPage.classList.remove('active');
        landingPage.style.display = 'none';
        console.log('Landing page hidden');
    } else {
        console.error('Landing page element not found!');
    }
    
    // Show layer 1
    const layer1 = document.getElementById('layer1');
    console.log('Layer 1 element:', layer1);
    
    if (layer1) {
        console.log('Adding active class to layer 1...');
        layer1.classList.add('active');
        layer1.style.display = 'flex';
        console.log('Layer 1 shown');
    } else {
        console.error('Layer 1 element not found!');
    }
    
    // Add opening animation to envelope
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.classList.add('opening');
        console.log('Envelope opening animation added');
    }
    
    // Update progress
    updateProgress(1);
    
    console.log('=== ENVELOPE OPENED SUCCESSFULLY ===');
}

// Show thank you message when continue button is clicked
function showThankYouMessage() {
    console.log('=== SHOWING THANK YOU MESSAGE ===');
    
    // Hide layer 1
    const layer1 = document.getElementById('layer1');
    if (layer1) {
        layer1.classList.remove('active');
        layer1.style.display = 'none';
    }
    
    // Create and show thank you overlay
    const body = document.body;
    const thankYouDiv = document.createElement('div');
    thankYouDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #fff5f8 0%, #ffe9f0 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 1s ease;
    `;
    
    thankYouDiv.innerHTML = `
        <div style="text-align: center; max-width: 600px; padding: 40px;">
            <div style="font-size: 6rem; margin-bottom: 30px; animation: heartPulse 1.5s ease-in-out infinite;">
                💕
            </div>
            <h1 style="font-family: 'Great Vibes', cursive; font-size: 3.5rem; color: #d4396c; margin-bottom: 20px; animation: slideUp 0.8s ease;">
                Thank You, Adi
            </h1>
            <p style="font-family: 'Great Vibes', cursive; font-size: 2rem; color: #8b4f6f; line-height: 1.8; animation: slideUp 0.8s ease 0.2s backwards;">
                For being the light in my life
            </p>
            <p style="font-family: 'Great Vibes', cursive; font-size: 1.8rem; color: #a86d89; margin-top: 20px; animation: slideUp 0.8s ease 0.4s backwards;">
                You mean everything to me ❤️
            </p>
        </div>
        
        <style>
            @keyframes heartPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
    `;
    
    body.appendChild(thankYouDiv);
    updateProgress(2);
    
    console.log('Thank you message displayed');
}

// Navigation functions
function goBack() {
    console.log('=== GO BACK CLICKED ===');
    
    const activePage = document.querySelector('.active');
    console.log('Current active page:', activePage);
    
    if (!activePage) {
        console.error('No active page found!');
        return;
    }
    
    // Get the previous sibling element
    let previousPage = activePage.previousElementSibling;
    
    // Skip non-section elements
    while (previousPage && previousPage.tagName !== 'SECTION') {
        previousPage = previousPage.previousElementSibling;
    }
    
    console.log('Previous page:', previousPage);
    
    if (previousPage) {
        console.log('Going back to previous page...');
        activePage.classList.remove('active');
        activePage.style.display = 'none';
        
        previousPage.classList.add('active');
        previousPage.style.display = 'flex';
        
        // Update progress based on which layer we're on
        const layerId = previousPage.id;
        if (layerId === 'landingPage') {
            updateProgress(0);
        } else if (layerId === 'layer1') {
            updateProgress(1);
        }
        
        console.log('Successfully went back');
    } else {
        console.log('Already at the first page');
    }
}

function updateProgress(layerNumber) {
    console.log('Updating progress to layer:', layerNumber);
    
    const progressText = document.getElementById('progressText');
    const progressHearts = document.querySelectorAll('.progress-heart');
    
    if (progressText) {
        progressText.textContent = `Journey: ${layerNumber} / 2`;
    }
    
    // Update filled hearts
    progressHearts.forEach((heart, index) => {
        if (index < layerNumber) {
            heart.classList.add('filled');
        } else {
            heart.classList.remove('filled');
        }
    });
}