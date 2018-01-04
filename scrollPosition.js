/*
	Determine scroll position in relation to element
*/

"use strict";

import { config }  from './config';

const containerTop = $(config.container).position().top;

export default function scrollPosition(threshold) {
	let containerHeight = containerTop + $(config.container).outerHeight(true);
	let scrollOffset = ($(window).scrollTop() + $(window).height()) + threshold

	return containerHeight <= scrollOffset;
}