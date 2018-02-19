"use strict";

class InfiniteScroll {
  constructor(userOptions = {}) {
	  Object.assign(this, {
			scrollThreshold: 10,
			currentPag: '',
			nextPag: ''
		}, userOptions);
		this.infScrollInit();
	}

	infScrollInit = () => {
		this.infScroll('init');
		if (this.hasOwnProperty('siteAjaxId')) {
			this.domWatcher();
		}
	}

// Verify page has pagination anchor then preload content to fill window. 
// After preload set scroll and resize listeners. 
infScroll = () => {
	if ($(this.pagination).length > 0) {
		if (this.checkScrollPosition()) {
			this.scrollAjaxCall();
		} else {
			$(document).on('scroll', this.eventHandler);
			$(window).on('resize', this.eventHandler);
		}
	}
}

// Check if the scroll position has passed the content height with threshold if provided.
checkScrollPosition = () => {
	const containerTop = $(this.container).position().top;
	let containerHeight = containerTop + $(this.container).outerHeight(true);
	let scrollOffset = ($(window).scrollTop() + $(window).height()) + this.scrollThreshold;
	return containerHeight <= scrollOffset;
}

// Check scroll position after scroll or resize.
eventHandler = () => {
	this.disableInfiniteEvents();
	if (this.checkScrollPosition()) {
		this.scrollAjaxCall(); 
	} else {
		this.timeoutReset(); 
	}
}

// Remove event listeners to prevent duplicate content
disableInfiniteEvents = () => {
	$(document).off('scroll', this.eventHandler);
	$(window).off('resize', this.eventHandler);
}

// After eventHandler or scrollAjaxCall run infScroll
// infScroll called to check if scroll position after initial event call has exceeded content height
timeoutReset = () => {
	setTimeout(() => {
		this.infScroll();
	}, 250);
}

// Load new content with Ajax call.
// Only call timeoutReset if updated pagination will have new content by comparing URLs
scrollAjaxCall = () => {
	$.ajax({
		type: 'GET',
		url: $(this.pagination).attr('href'),
		success: (data) => {
			let newItems = $(data).find(this.items);
			this.nextPag = $(data).find(this.pagination).attr('href');
			$(this.container).append(newItems);
			if (this.currentPag !== this.nextPag) {
				$(this.pagination).attr('href', this.nextPag);
				if (this.nextPag === undefined) { 
					return;
				} else {	
					this.currentPag = this.nextPag;
					this.timeoutReset();
				}
			}
		}
	});
}

// Watch for mutations to changes in DOM to detect Ajax navigation changes
// If a page change occurs, reset nextPag and disable events.
// infScroll checks if new page has pagination for Infinite Scroll
domWatcher = () => {
	let observer = new MutationObserver(()=>{
		this.disableInfiniteEvents();
		this.nextPag= '',
		this.infScroll();
	});

	let observerConfig = {
		attributes: false, 
		childList: true, 
		characterData: false 
	};

	let targetNode = document.getElementById(this.siteAjaxId);
	observer.observe(targetNode, observerConfig);
}
}

export { InfiniteScroll };