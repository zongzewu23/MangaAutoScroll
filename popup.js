console.log("content.js is running...");
document.getElementById('start').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            console.error("No active tabs found.");
            return;
        }
        chrome.tabs.sendMessage(tabs[0].id, { action: "start" });
    });
});



document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stop" });
    });
});

document.getElementById('speedControl').addEventListener('input', (event) => {
    const speed = parseInt(event.target.value, 10);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setSpeed", speed: speed });
    });
});



function startScrolling() {
    if (!window.isScrolling) {
        window.isScrolling = true;
        window.scrollSpeed = window.scrollSpeed || 2;
        window.scrollInterval = setInterval(() => {
            window.scrollBy(0, window.scrollSpeed);
        }, 16);
    }
}

function stopScrolling() {
    window.isScrolling = false;
    clearInterval(window.scrollInterval);
}

function updateScrollSpeed(speed) {
    window.scrollSpeed = speed;
}
