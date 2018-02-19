# Infinite-Scroll
Utilize site pagination to add new elements on page.

See it in action: http://www.desaturate.net/design

# Setup
Add is-2.0.min.js and initalize
```
<script src='is-2.0.min.js'></script>
```

# Initalization and Configuration
Create new instance with the necessary configurations,


Required:

    let scrollLoad = new InfiniteScroll {
      pagination: ' ', //Pagination anchor ID
      container: ' ', //Container ID where items will be appended
      itemsClass: ' ' //Class for elements that will be appended
    }
    
Optional:

    siteAjaxId: '', //REQUIRED when Ajax is used sitewide to reload pages in navigation. Add ID to site Ajax container.
    scrollThreshold: 0 //Numerical value referencing pixel threshold for appending items before end of page.
