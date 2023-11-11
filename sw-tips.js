// Fetch tip & save in storage

const updateTip = async() => {

    const response = await fetch("https://extension-tips.glitch.me/tips.json");
    
    const tips = await response.json();

    const randomIndex = Math.floor(Math.random() * tips.length);

    return chrome.storage.local.set({tip : tips[randomIndex]});

}

const ALARM_NAME = "tip";

// First, we check if the alarm exists, to avoid resetting the timer.

async function createAlarm() {

    const alarm = await chrome.alarms.get(ALARM_NAME);

    if(typeof alarm === "undefined") {

        // The alarm does not exist

        chrome.alarms.create(ALARM_NAME, {

            delayInMinutes : 1,
            periodInMinutes : 1440

        });

        updateTip();
    }
}

createAlarm();


// Respond to the content script's message requesting a daily tip

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    if(message.greeting === "tip") {
        chrome.storage.local.get("tip").then(sendResponse);
        return true;
    }
});




// Update tip once a day

chrome.alarms.onAlarm.addListener(updateTip);