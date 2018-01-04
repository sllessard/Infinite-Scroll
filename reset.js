/*
	Set timeout before reinitializing events, 
	applied to reduce frequency of events firing.
*/
"use strict";

import { infScroll } from './is-1.0';

export default function timeoutReset() {
	setTimeout(function(){
		infScroll();
	}, 250);
}