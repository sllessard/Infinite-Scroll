/*
	Process and disable events for infinite scroll
*/

"use strict";

import { config }  from './config';
import scrollAjax from './load';
import timeoutReset from './reset';
import scrollPosition from './scrollPosition';

function resizeHandler() {
	disableInfiniteEvents();
	if (scrollPosition(config.scrollThreshold)) {
		scrollAjax(config); //Append new items if 
	} else {
			timeoutReset(); //Reinitialize event listeners
	}
}

function disableInfiniteEvents() {
	$(document).off('scroll', resizeHandler);
	$(window).off('resize', resizeHandler);
}

export { container, resizeHandler, disableInfiniteEvents };