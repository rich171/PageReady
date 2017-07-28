# PageReady
A short chrome extension to determine when all AJAX calls are complete on a host page.

## Approach
When injecting code via an extension, there are two approaches one can take to determine if the host page has fully loaded or if there are remaining AJAX calls: 1) Monitor the DOM (counting nodes, approximating dimensions, searching for loading keywords or gifs), and 2) Monitor the network. This extension does the latter by listening for outbound XHR requests and their inbound responses. Whenever Outbound > Inbound + Errors, there are pending AJAX calls and the page is not ready. When Outbound = Inbound + Errors, the page is potentially ready; under this condition, a timer is initiated. If another request occurs in the interim, the timer is reset. Otherwise, if the timer completes without further requests, the page is considered loaded.

## Advantages and Disadvantages
The advantage of this method over DOM monitoring is that this approach can be used to handle an unknown number of AJAX calls for any website. In other words, it's UI agnostic. However, the clear downside is that there's a time margin following the sufficient state for completion. Assuming that host page is unknown to the extension, this is true for both DOM and Network monitoring. 

## Ways to improve
There are a few ways to improve upon this method. First, not all XHR responses carry HTML and so wouldn't alter the DOM. These can be excluded from the monitoring. Second, if there were previous and recent visits to the page, the extension could compare the number of detected AJAX calls to the expected amount. Third, this approach could be coupled with DOM monitoring to match probable areas to be altered (i.e. at a loading gif) with inbound response HTML.
