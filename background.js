//the following method assumes merlin is evaluating calls on the active tab

//init variables
var staged = 0;
var executed = 0;
var errors = 0;
var activeTabId = 0;
var timer;

//this function is called when the page is ready
function pageReady(resp) {
    console.log('Page state: ' + resp);
};

//this provides the Tab ID to limit the number of tabs the extension has to monitor
chrome.tabs.onActivated.addListener(function (tab) {
    activeTabId = tab.tabId;
    staged = executed = errors = 0;
    requestListeners(activeTabId, pageReady);
});

/*pairs outbound xhr calls with inbound xhr calls. Only when those numbers are equal, it pauses
to determine if there are any more outbound calls. If not, pageReady is called*/
function requestListeners(tabId, pageReady) {

    var verifyLastExchange = function(){
        timer = setTimeout(function () {
            pageReady('Ready');
            return staged == (executed + errors);
        }, 3000);
    }

    var incrementStagedRequests = function () {
        clearTimeout(timer);
        staged++;
        console.log('staged ---' + staged + ':' + executed + ':' + errors);
    };

    var incrementExecutedRequests = function () {
        executed++;
        if(staged == (executed + errors)){
            verifyLastExchange();
        }
        console.log('executed ---' + staged + ':' + executed + ':' + errors);
    };

    var incrementErrors = function () {
        errors++;
        if(staged == (executed + errors)){
            verifyLastExchange();
        }
        console.log('error ---' + staged + ':' + executed + ':' + errors);
    };


    chrome.webRequest.onSendHeaders.addListener(
        incrementStagedRequests,
        {
            urls: ["<all_urls>"],
            types: ['xmlhttprequest'],
            tabId: tabId
        }
    );

    chrome.webRequest.onCompleted.addListener(
        incrementExecutedRequests,
        {
            urls: ["<all_urls>"],
            types: ['xmlhttprequest'],
            tabId: tabId
        }
    );

    chrome.webRequest.onErrorOccurred.addListener(
        incrementErrors,
        {
            urls: ["<all_urls>"],
            types: ['xmlhttprequest'],
            tabId: tabId
        }
    );
}