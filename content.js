chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "extract") {
        const selectedText = window.getSelection().toString();
        sendResponse({
            text: selectedText
        });
    }
});