let scrollSpeed = 2;
let isScrolling = false;
let interval;
let isListening = false; // Whether to listen to keyboard events
let savedPosition = null; // Save the marked position
let keyPressCount = 0; // Record the number of key presses
let lastToastTime = 0; // Record the last toast display time

function showToast(message) {
    let toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "10px"; // Display at the top right corner
    toast.style.right = "10px";
    toast.style.background = "rgba(0,0,0,0.85)";
    toast.style.color = "white";
    toast.style.padding = "10px 15px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.fontSize = "14px";
    toast.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.3)";

    let iconURL = chrome.runtime.getURL("icons/WuIcon.png"); 

    let icon = document.createElement("img");
    icon.src = iconURL;
    icon.style.width = "18px";
    icon.style.height = "18px";
    icon.style.marginRight = "8px";
    
    let text = document.createElement("span");
    text.innerText = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
        startScrolling();
        enableKeyListener();
    } else if (message.action === "stop") {
        stopScrolling();
        disableKeyListener();
    } else if (message.action === "setSpeed") {
        scrollSpeed = message.speed;
    }
});

function startScrolling() {
    if (!isScrolling) {
        isScrolling = true;
        interval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
        }, 16);
    }
}

function stopScrolling() {
    isScrolling = false;
    clearInterval(interval);
}

// Enable keyboard event listener
function enableKeyListener() {
    if (!isListening) {
        isListening = true;
        document.addEventListener('keydown', keyControl);
    }
}

// Disable keyboard event listener
function disableKeyListener() {
    if (isListening) {
        isListening = false;
        document.removeEventListener('keydown', keyControl);
    }
}

// Handle keyboard input
function keyControl(event) {
    let currentTime = Date.now(); 

    if (event.key === ' ') { // Space key to pause/resume scrolling
        event.preventDefault();
        if (isScrolling) {
            scrollSpeed = 2;
            stopScrolling();
            showToast("Stopped Scrolling");
        } else {
            startScrolling();
            showToast("Resumed Scrolling");
        }
    } else if (event.key === 'ArrowDown') { // ↓ Increase speed
        if (!isScrolling) startScrolling(); // Restart scrolling if paused
        scrollSpeed += 2;
        keyPressCount++;

        if (keyPressCount >= 10 || (currentTime - lastToastTime > 5000)) {
            showToast(`Speeding Up >>> (${scrollSpeed}px/s)`);
            keyPressCount = 0;
            lastToastTime = currentTime;
        }
    } else if (event.key === 'ArrowUp') { // ↑ Decrease speed
        if (!isScrolling) startScrolling(); // Restart scrolling if paused
        scrollSpeed = scrollSpeed - 2; // Prevent speed from going to 0
        keyPressCount++;

        if (keyPressCount >= 10 || (currentTime - lastToastTime > 5000)) {
            showToast(`Speeding Down <<< (${scrollSpeed}px/s)`);
            keyPressCount = 0;
            lastToastTime = currentTime;
        }
    } else if (event.ctrlKey && event.key.toLowerCase() === 'm') { // Ctrl + M to mark reading position
        let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            savedPosition = window.scrollY;
            stopScrolling();
            let percent = ((savedPosition / scrollHeight) * 100).toFixed(1);
            showToast(`Marked this position at: ${percent}%`);
        } else {
            showToast("Cannot mark position (Page too short)");
        }
    } else if (event.ctrlKey && event.key.toLowerCase() === 'b') { // Ctrl + B to return to the marked position
        if (savedPosition !== null) {
            stopScrolling();
            scrollSpeed = 2;
            window.scrollTo({ top: savedPosition, behavior: "smooth" });
            showToast("Returned to the marked position");
        } else {
            showToast("No reading position marked!");
        }
    }
}
