# Infinite-Scroll
Utilize site pagination to add new elements on page
See it in action: http://www.desaturate.net/design

# Configuration
In config.js,

Required:

    pagination: ' ', //Pagination anchor ID
    container: ' ', //Container ID where items will be appended
    items: ' ', //Class for elements that will be appended
    
Optional:

    scrollThreshold: 0 //Numerical value referencing pixel threshold for appending items before end of page.
