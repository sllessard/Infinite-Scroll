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
		this.pageWatcher();
		this.infScroll();
	}

	infScroll = () => {
		if ($(this.pagination).length > 0) {
			if (this.scrollPosition()) {
				this.scrollAjax();
			} else {
				$(document).on('scroll', this.eventHandler);
				$(window).on('resize', this.eventHandler);
			}
		}
	}

	eventHandler = () => {
		this.disableInfiniteEvents();
		if (this.scrollPosition()) {
			this.scrollAjax(); //Append new items if scroll position > container
		} else {
				this.timeoutReset(); //Reinitialize event listeners
			}
		}

		disableInfiniteEvents = () => {
			$(document).off('scroll', this.eventHandler);
			$(window).off('resize', this.eventHandler);
		}

		scrollAjax = () => {
			$.ajax({
				type: 'GET',
				url: $(this.pagination).attr('href'),
				success: (data) => {
					let newItems = $(data).find(this.items);
					this.nextPag = $(data).find(this.pagination).attr('href');

					$(this.container).append(newItems);
					if (this.currentPag !== this.nextPag) {
						$(this.pagination).attr('href', this.nextPag);

					if (this.nextPag === undefined) { //Check if additional items exist to load on new event
						/*$(document).on('ajaxStart', this.pageWatcher);*/
						return;
					} else {	
						this.currentPag = this.nextPag;
						this.timeoutReset(); //Reset events if additional items exist
					}
				}
			}
		});
		}

		timeoutReset = () => {
			setTimeout(() => {
				this.infScroll();
			}, 250);
		}

		pageWatcher = () => {
			let observer = new MutationObserver(()=>{
				this.disableInfiniteEvents();
				this.nextPag= '',
				/*$(document).off('ajaxStart', this.pageWatcher);*/
				this.infScroll();
			});
			
			// Notify me of everything!
			let observerConfig = {
				attributes: false, 
				childList: true, 
				characterData: false 
			};
			
			// Node, config
			// In this case we'll listen to all changes to body and child nodes
			let targetNode = document.getElementById('ajaxContent');
			observer.observe(targetNode, observerConfig);

		}

		scrollPosition = () => {
			try {
				const containerTop = $(this.container).position().top;
				return ( () => {
					let containerHeight = containerTop + $(this.container).outerHeight(true);
					let scrollOffset = ($(window).scrollTop() + $(window).height()) + this.scrollThreshold;
					return containerHeight <= scrollOffset;
				})();

			}

			catch(e){
				return  false;
			}
		}
	}

	export { InfiniteScroll };