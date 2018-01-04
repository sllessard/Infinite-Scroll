/*
	Append new infinite scroll items to container
*/

"use strict";

import infReset from './reset';

let currentPag = '';
let nextPag = '';

export default function scrollAjax(config) {
	$.ajax({
		type: 'GET',
		url: $(config.pagination).attr('href'),
		success: function(data){
			let newItems = $(data).find(config.items);
			nextPag = $(data).find(config.pagination).attr('href');

			$(config.container).append(newItems);
			if (currentPag !== nextPag) {
				$(config.pagination).attr('href', $(data).find(config.pagination).attr('href'));

				if (nextPag === undefined) { //Check if additional items exist to load on new event
					return;
				} else {	
					currentPag = nextPag;
					infReset(); //Reset events if additional items exist
				}
			}
		}
	});
}