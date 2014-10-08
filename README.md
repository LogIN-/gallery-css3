## Introduction
`gallery-css3` is a simple light-wave JavaScript gallery slide show plug-in.

## Get started
You can just visit this page: [gallery-css3](http://ivantomic.com/projects/gallery-css3/)
or you can clone this repo.


## Usage

You can install `gallery-css3` through bower:

```bash
bower install gallery-css3
```

Alternatively, download the package and reference the JavaScript and CSS files manually:

```html
<script src="lib/lib/gallery-css3.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="lib/gallery-css3.css">
<link rel="stylesheet" type="text/css" href="lib/gallery-css3-animations.css">
```
## Options
```javascript
var options = {
    // Main API
    // Id Of referenced gallery ("data-id: slider01")
    galleryID: "slider01",
    // String: DOM selector of gallery items (".cool-gallery > img" or ".cool-gallery > img, li")
    selector: ".cool-gallery[data-id='slider01'] > img", 
    // String: Animation for all items for "in", default if not specified in data attribute
    animationIn: "fade",
    // String: Animation for all items for "out" effect, default if not specified in data attribute
    animationOut: "bounceOutLeft",
    // Boolean: Reverse the slide order
    reverse: false,           
    // Integer: Should the animation loop? How Many Times? 0-...n
    animationLoop: 100,        
    // Boolean: Animate slider automatically         
    slideshow: true,
    // Boolean: Should gallery have user control previews??
    setupGalleryControls: true,                
    // String: animation name of gallery control fadeIn
    galleryControlAnimation: 'rollIn',
    // Boolean: Overlap animation In and Out time (position of gallery images must be set to "absolute") 
    overlap: true,  
    // Integer: Set the speed of the slideshow cycling, in milliseconds     
    animationInSpeed: 7000,                  
    // Integer: Set the speed of the slideshow cycling, in milliseconds     
    animationOutSpeed: 100,       
    // Integer: Set an initialization delay, in milliseconds 
    initDelay: 0,     
    // Boolean: Randomize slide order        
    randomize: false,
    // Callback API
    // Callback: function(slider) - Fires when the slider loads the first slide
    start: function(){
        console.log("%cGallery slider started", "color:white; background-color:black");
    },
    // Callback: function(slider) - Fires with each slider animation       
    before: function(item){
        console.log("%cPreparing for item:%c %o%c animation", "color:green; background-color:yellow", "font-style: italic", item.id, "font-style: normal");
    }, 
    // Callback: function(slider) - Fires after each slider animation completes          
    after: function(item){
        console.log("%cItem:%c %o%c animation ended", "color:black; background-color:green", "font-style: italic", item.id, "font-style: normal");
    },    
    // Callback: function(slider) - Fires when the slider reaches the last slide      
    end: function(id){
        console.log("%cGallery loop:%c %o%c ended", "color:white; background-color:black", "font-style: italic", id, "font-style: normal");
    },
    // Callback: function() - Fires when animations arent supported in browser
    onError: function (){

    }          
};

new coolGallery(options);
```

## Support and Bugs
If you are having trouble, have found a bug, or want to contribute don't be shy.
[Open a ticket](https://github.com/LogIN-/ospnc/issues) on GitHub.

## License
`gallery-css3` source-code uses the The MIT License (MIT), see our `LICENSE` file.
```
The MIT License (MIT)
Copyright (c) LogIN- 2014
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```