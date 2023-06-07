document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("runCodeButton");

    button.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const maxCount = document.getElementById("maxCount").value;

        chrome.tabs.query({ active: true, currentWindow: true })
            .then(([tab]) => {
                const maxCount = document.getElementById("maxCount").value;
                const currentUrl = tab.url;
                chrome.tabs.sendMessage(tab.id, { currentUrl, maxCount });
            })
            .catch(error => {
                console.error("Error querying active tab:", error);
            });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [maxCount],
            function: setContentScript
        });
    });

});

function setContentScript( maxCount ) {
    chrome.runtime.sendMessage({ maxCount });
}



