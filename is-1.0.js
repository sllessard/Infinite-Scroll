"use strict";

import { config }  from './config';
import scrollAjax from './load';
import {resizeHandler, disableInfiniteEvents } from './events';
import scrollPosition from './scrollPosition';


export default function infScrollInit() {
	disableInfiniteEvents();
	infContainer();
}

function infScroll() {
	if ($(config.pagination).length > 0) {
		if (scrollPosition(100)) {
			scrollAjax(config);
		} else {
			$(document).on('scroll', resizeHandler);
			$(window).on('resize', resizeHandler);
		}
	}
}

export { infScroll };