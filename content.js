let scrollSpeed = 2;
let isScrolling = false;
let interval;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
        startScrolling();
    } else if (message.action === "stop") {
        stopScrolling();
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

