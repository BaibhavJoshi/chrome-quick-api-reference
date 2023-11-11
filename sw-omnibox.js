// Save default API suggestions

chrome.runtime.onInstalled.addListener(({reason}) => {
    if(reason === 'install'){
        chrome.storage.local.set({
            apiSuggestions : ['tabs', 'storage', 'scripting']
        });
    }
});


/*

    > We defo need to make sure that the relevant event listeners (the omnibox stuff here) are at the top level of the script.

    > They need to be statically registered in the global scope of the service worker.

    > They should NOT be nested in async functions, so that Chrome can ensure that all event handlers are restored in case of a service worker reboot.

*/  


const URL_CHROME_EXTENSIONS_DOC = "https://developer.chrome.com/docs/extensions/reference/";

const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Display the suggestions after user starts typing

chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
    
    await chrome.omnibox.setDefaultSuggestion({

        description : "Enter a Chrome API or choose from past searches"

    });

    const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");

    const suggestions = apiSuggestions.map((api) => {

        return {content : api, description : `Open chrome.${api} API`};

    });

    suggest(suggestions);
});


// Open the reference page of the user-selected API

chrome.omnibox.onInputEntered.addListener((input) => {

    chrome.tabs.create({url : URL_CHROME_EXTENSIONS_DOC + input});

    // Save the latest keyword

    updateHistory(input);

});


// The updateHistory() function below takes the omnibox input and saves it to storage.local

async function updateHistory(input) {

    const { apiSuggestions } = await chrome.storage.local.get("apiSuggestions");

    // The unshift() method of Array instances adds the specified elements to the beginning of an array, and returns the new length of the array.

    apiSuggestions.unshift(input);

    apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);

    return chrome.storage.local.set({apiSuggestions});

}

