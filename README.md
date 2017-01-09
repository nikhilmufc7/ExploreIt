"Explore It" is a word-search web app that goes beyond the dictionary definition of a word. A one-click search on "Lookitup" displays the following information on the same page:

(1) Relevant dictionary entries with audio links for pronunciation and usage examples, when available, from the Longman's Dictionary API;

(2) The introduction section of the Wiki page for the searchterm, along with a relevant image when provided by the Wiki page;

(3) And YouTube clips that will play on the app page via pop-up player, filtered to bring up informative clips, when available, by specifying the searchterm to be embedded within the phrase "What is searchterm."

The advantage of this app over a regular search engine is that all information is actually drawn out of these different sources and displayed on the app page itself, saving the user from having to search a term on an engine, scroll to and click on the dictionary, Wikipedia or YouTube page, wait for the new page to load, and find relevant information on the new page. "Lookitup" organizes the data on a single page and makes pronunciation data, images, and YouTube clips accessible and playable on the app itself.

Technology

"Lookitup" uses AJAX calls to request and load data asynchronously from public APIs in response to user click events detected by event-handlers. Using jQuery DOM taversal and manipulation, the data is displayed in an organized layout that has been made responsive and mobile-first by CSS media-queries, allowing the page to be usable and equally optimized on devices with small and large screens alike.


Cheers!
