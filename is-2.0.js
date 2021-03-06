"use strict";
  
class InfiniteScroll {
  constructor(userOptions = {}) {
    Object.assign(this, {
      scrollThreshold: 10,
      currentPag: '',
      nextPag: '',
      containerTop: 0,
      containerHeight: 0
    }, userOptions);
    this.infScrollInit();
  }

  infScrollInit = () => {
    if ($(this.pagination).length > 0) {
      this.containerTop = $(this.container).position().top;
      this.infScroll();
    }
    if (this.hasOwnProperty('siteAjaxId')) {
      this.domWatcher();
    }
  }

  // Verify page has pagination anchor then preload content to fill window. 
  // After preload set scroll and resize listeners. 
  infScroll = () => {
    this.containerHeight = this.containerTop + $(this.container).outerHeight(true);
    if (this.scrollPosition()) {
      this.scrollAjaxCall();
    } else {
      $(document).on('scroll', this.eventHandler);
      $(window).on('resize', this.eventHandler);
    }
  }

  // Check if the scroll position has passed the content height with threshold if provided.
  scrollPosition = () => {
    let scrollOffset = ($(window).scrollTop() + $(window).height()) + this.scrollThreshold;
    return this.containerHeight <= scrollOffset;
  }

  // Check scroll position after scroll or resize.
  eventHandler = () => {
    if (this.scrollPosition()) {
      this.disableInfiniteEvents();
      this.scrollAjaxCall(); 
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
        let newItems = $(data).find(this.itemsClass);
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
      observer.disconnect();
      this.nextPag= '';
      this.infScrollInit();
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
