/* 
 * @Author: login
 * @Date:   2014-10-07 08:59:54
 * @Last Modified by:   login
 * @Last Modified time: 2014-10-08 11:06:46
 */

// coolGallery may be freely distributed under the MIT license.

(function() {
    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Create a safe reference to the coolGallery object for use below.
    var coolGallery = function(obj) {
        if (obj instanceof coolGallery) return obj;
        if (!(this instanceof coolGallery)) return new coolGallery(obj);
    };

    // Export the coolGallery object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `coolGallery` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = coolGallery;
        }
        exports.coolGallery = coolGallery;
    } else {
        root.coolGallery = coolGallery;
    }
    coolGallery = function(options) {
        var self = this;
        self.options = options;
        // Array of JS DOM gallery elements
        self.galleryItems = null;
        // If any multimedia item it will be hold here for reference
        self.lastMultimediElemet = null;
        // Check if Browser support CSS animations
        self.isAnimationSupported = self.isCSSAnimationSupported();
        // Track number of gallery loops 
        self.animationsLoopCounter = 0;
        // Processed items counter in one gallery loop
        self.currentItem;

        // Gallery id is mandatory
        if(!self.options.galleryID){
            // CALLBACK
            if (self.options.onError && typeof(self.options.onError) === "function") {
                self.options.onError();
            }
            console.log("GalleryID isnt valid integer number");
            console.log(self.options.galleryID);
            return;
        }
        // Construct variable of all gallery items
        if (self.options.selector) {
            // Get all DOM items in NodeList dataType and convert it to array
            self.galleryItems = self.turnObjToArray(document.querySelectorAll(self.options.selector));
            // self.logger("Total items detected: " + self.galleryItems.length, 1);

            // If no Items in Array there must be selector error lets exit
            if (self.galleryItems && self.galleryItems.length < 1) {
                // CALLBACK
                if (self.options.onError && typeof(self.options.onError) === "function") {
                    self.options.onError();
                }
                return;
            }

        } else {
            return function() {
                self.logger("selector option must be specified.. aborting..", 0);
            }
        }

        if (self.options.reverse === true) {
            console.log("Reversing array!");
            self.galleryItems.reverse();
        }
        // If different start is needed reorganize our array
        if (self.options.startAt && self.options.startAt <= self.galleryItems.length) {
            // Add recursiveness
            // self.moveObjectAtIndex(self.galleryItems, parseInt(self.options.startAt), 0);
            self.logger("requested change to gallery index positions to: " + self.options.startAt, 1);
        }

        if (self.options.slideshow === true) {
            self.mainGalleryLoop();
        }

    };

    /* animateAPI function()  
     * Can be called for manual gallery interaction
     * Boolean input: {startAnimation, pauseAnimation, stopAnimation}
     *
     */
    coolGallery.prototype.animateAPI = function(object) {
        var self = this;
        if (object.startAnimation && object.startAnimation === true) {
            self.mainGalleryLoop();
        }
        if (object.pauseAnimation && object.pauseAnimation === true) {
            console.log("Function not implemented!");
        }
        if (object.stopAnimation && object.stopAnimation === true) {
            console.log("Function not implemented!");
        }
    };
    coolGallery.prototype.mainGalleryLoop = function() {
        var self = this;
        self.currentItem = 0;
        var slides = [];

        if(self.animationsLoopCounter === 0 && self.options.setupGalleryControls === true){
            self.setupGalleryControls();
        }

        // If animations are not supported lets exit
        if (self.isAnimationSupported.supported && self.isAnimationSupported.supported === false) {
            // CALLBACK
            if (self.options.onError && typeof(self.options.onError) === "function") {
                self.options.onError();
            }
            self.logger("Animations are not supported in this browser.. aborting..", 0);
            return;
        }
        // CALLBACK
        if (self.options.start && typeof(self.options.start) === "function") {
            self.options.start();
        }

        for (var i = 0; i < self.galleryItems.length; ++i) {
            var item = {};
            // Calling galleryItems.item(i) isn't necessary in JavaScript
            item.element = self.galleryItems[i];
            // ID of current item used as reference
            item.id = i;

            item.animationInSpeed = item.element.getAttribute("data-animationInSpeed") || self.options.animationInSpeed;
            item.animationOutSpeed = item.element.getAttribute("data-animationOutSpeed") || self.options.animationOutSpeed;

            if (i === 0) {
                item.timer = self.options.initDelay;
            } else {
                item.timer = parseInt(slides[slides.length - 1].timer) + parseInt(slides[slides.length - 1].animationInSpeed);
            }
            // self.logger("Image item.timer set to: " + item.timer, 1);

            slides.push(item);
            // If items aren't hided lets hide them!
            self.addCssClass(item.element, 'cool-gallery-item');
            self.itemAnimateSetTimeOut(item);
        }
    };

    coolGallery.prototype.itemAnimateSetTimeOut = function(item) {
        var self = this;
        setTimeout(function() {
            self.animateCurrentSlide(item);
        }, item.timer);
    }

    coolGallery.prototype.animateCurrentSlide = function(item) {
        var self = this;

        // Check if there are any active multimedia elements
        if (self.lastMultimediElemet !== null) {
            if (self.lastMultimediElemet.stop && typeof self.lastMultimediElemet.play === 'function') {
                self.lastMultimediElemet.pause();
            }
            self.lastMultimediElemet.style.display = 'none';
        }


        var animationIn = item.element.getAttribute("data-animationIn") || self.options.animationIn;
        var animationOut = item.element.getAttribute("data-animationOut") || self.options.animationOut;

        if (self.getAnimationName(item.element) !== animationIn) {
            self.setAnimationName(item.element, animationIn);
            var animDuration;
            if (self.options.overlap === true) {
                animDuration = item.animationInSpeed - (item.animationOutSpeed - (item.animationOutSpeed / 2));
            } else {
                animDuration = item.animationInSpeed - item.animationOutSpeed;
            }
            // Check for multimedia??
            if (item.element.play && typeof item.element.play === 'function') {
                self.lastMultimediElemet = item.element;
                self.lastMultimediElemet.style.display = 'block';
                self.lastMultimediElemet.play();
                return;
            }
            self.setAnimationDuration(item.element, animDuration + "ms");
        }
        // self.addCssClass(item.element, animation);
        self.addCssClass(item.element, 'animated');
        // Activate gallery control item
        self.highlightControlItem(item);

        // Display - show slide at the beginning of animation
        item.element.style.display = 'block';

        // CALLBACK
        if (self.options.before && typeof(self.options.before) === "function") {
            self.options.before(item);
        }
        self.trackSlideAnimation(item.element, function() {
            // Remove animation from element
            self.setAnimationName(item.element, '');
            self.setAnimationDuration(item.element, '');

            // Remove animation from element
            self.setAnimationName(item.element, animationOut);
            self.setAnimationDuration(item.element, item.animationOutSpeed + 'ms');


            self.trackSlideAnimation(item.element, function() {

                // Remove animation from element
                self.setAnimationName(item.element, '');
                self.setAnimationDuration(item.element, '');
                self.removeCssClasss(item.element, 'animated');
                // hide slide after animation ended
                item.element.style.display = 'none';

                // CALLBACK
                if (self.options.after && typeof(self.options.after) === "function") {
                    self.options.after(item);
                }

                // Current animation item counter
                self.currentItem++;

                // Check if item is last item in gallery
                if (self.currentItem % self.galleryItems.length === 0) {
                    // Track Gallery loops
                    self.animationsLoopCounter++;
                    // CALLBACK
                    if (self.options.end && typeof(self.options.end) === "function") {
                        self.options.end(self.animationsLoopCounter);
                    }                    
                    if (self.animationsLoopCounter < self.options.animationLoop) {
                        self.mainGalleryLoop();
                    }
                }

            });
        });
    };

    coolGallery.prototype.trackSlideAnimation = function(element, callback) {
        // Add a specific  event listeners functions

        element.addEventListener('webkitAnimationEnd', animationEndHandler, false);
        element.addEventListener('mozAnimationEnd', animationEndHandler, false);
        element.addEventListener('MSAnimationEnd', animationEndHandler, false);
        element.addEventListener('oAnimationEnd', animationEndHandler, false);
        element.addEventListener('animationend', animationEndHandler, false);

        function animationEndHandler() {
            // Remove the same specific event listeners functions
            this.removeEventListener('webkitAnimationEnd', animationEndHandler, false);
            this.removeEventListener('mozAnimationEnd', animationEndHandler, false);
            this.removeEventListener('MSAnimationEnd', animationEndHandler, false);
            this.removeEventListener('oAnimationEnd', animationEndHandler, false);
            this.removeEventListener('animationend', animationEndHandler, false);

            // CALLBACK after item animation ended
            if (callback && typeof(callback) === "function") {
                callback();
            }
        }
    };

    coolGallery.prototype.getAnimationName = function(element) {
        var animationName = element.style.webkitAnimationName ||
            element.style.mozAnimationName ||
            element.style.oAnimationName ||
            element.style.animationName;
        return animationName;

    };
    coolGallery.prototype.setAnimationName = function(element, animationName) {
        element.style.webkitAnimationName = animationName;
        element.style.mozAnimationName = animationName;
        element.style.oAnimationName = animationName;
        element.style.animationName = animationName;

    };
    coolGallery.prototype.setAnimationDuration = function(element, animationDuration) {
        element.style.webkitAnimationDuration = animationDuration;
        element.style.mozAnimationDuration = animationDuration;
        element.style.oAnimationDuration = animationDuration;
        element.style.animationDuration = animationDuration;

    };

    /* Our simple gallery logger
     * 0 - error
     * 1 - log
     */
    coolGallery.prototype.logger = function(data, type) {
        if (type == 0) {
            alert(data);
            return;
        } else if (type == 1) {
            console.log(data);
        }
    };
    /* Move an array element from one array position to another
     * Example code: [1, 2, 3].move(0, 1) gives [2, 1, 3].
     */
    coolGallery.prototype.move = function(inputArray, old_index, new_index) {
        if (new_index >= inputArray.length) {
            var k = new_index - inputArray.length;
            while ((k--) + 1) {
                inputArray.push(undefined);
            }
        }
        inputArray.splice(new_index, 0, inputArray.splice(old_index, 1)[0]);
        return inputArray; // for testing purposes
    };
    /* Converts Object To Array used to convert NodeList to array
     * returns array
     */
    coolGallery.prototype.turnObjToArray = function(obj) {
        return [].map.call(obj, function(element) {
            return element;
        })
    };
    /* Recessively changed index of array item
     * FIX
     */
    coolGallery.prototype.moveObjectAtIndex = function(array, sourceIndex, destIndex) {
            var placeholder = {};
            // remove the object from its initial position and
            // plant the placeholder object in its place to
            // keep the array length constant
            var objectToMove = array.splice(sourceIndex, 1, placeholder)[0];
            // place the object in the desired position
            array.splice(destIndex, 0, objectToMove);
            // take out the temporary object
            array.splice(array.indexOf(placeholder), 1);

            console.log(array);
        }
        /* Adds CSS class to element
         *
         */
    coolGallery.prototype.addCssClass = function(element, className) {
        var oldClass = element.className || element.getAttribute("class");
        // this.logger("Adding class: old class:" + oldClass, 1);
        // test for existance
        if (oldClass.indexOf(className) !== -1) {
            // this.logger("class already added:" + className, 1);
            return;
        } else {
            //add a space if the element already has class
            if (oldClass != '') {
                className = ' ' + className;
            }
            element.className = oldClass + className;
        }

    };
    /* Removes CSS class from element
     *
     */
    coolGallery.prototype.removeCssClasss = function(element, className) {
        var cn = element.className;
        var rxp = new RegExp("\\s?\\b" + className + "\\b", "g");
        cn = cn.replace(rxp, '');
        element.className = cn;
    }

    /* Check if CSS3 animation is supported 
     * returns object
     *
     */
    coolGallery.prototype.isCSSAnimationSupported = function() {
        /*
            webkitAnimationName => Safari/Chrome
            MozAnimationName => Mozilla Firefox
            OAnimationName => Opera
            animationName => compliant browsers (inc. IE10)
         */
        var supported = false;
        var prefixes = ['webkit', 'Moz', 'O', ''];
        var limit = prefixes.length;
        var doc = document.documentElement.style;
        var prefix, start, end;

        while (limit--) {
            // If the compliant browser check (in this case an empty string value) then we need to check against different string (animationName and not prefix + AnimationName)
            if (!prefixes[limit]) {
                // If not undefined then we've found a successful match
                if (doc['animationName'] !== undefined) {
                    prefix = prefixes[limit];
                    start = 'animationstart';
                    end = 'animationend';
                    supported = true;
                    break;
                }
            }
            // Other brower prefixes to be checked
            else {
                // If not undefined then we've found a successful match
                if (doc[prefixes[limit] + 'AnimationName'] !== undefined) {
                    prefix = prefixes[limit];

                    switch (limit) {
                        case 0:
                            //  webkitAnimationStart && webkitAnimationEnd
                            start = prefix.toLowerCase() + 'AnimationStart';
                            end = prefix.toLowerCase() + 'AnimationEnd';
                            supported = true;
                            break;

                        case 1:
                            // animationstart && animationend
                            start = 'animationstart';
                            end = 'animationend';
                            supported = true;
                            break;

                        case 2:
                            // oanimationstart && oanimationend
                            start = prefix.toLowerCase() + 'animationstart';
                            end = prefix.toLowerCase() + 'animationend';
                            supported = true;
                            break;
                    }

                    break;
                }
            }
        }
        return {
            supported: supported,
            prefix: prefix,
            start: start,
            end: end
        };
    };


    /* Setup gallery controls
     *
     */
    coolGallery.prototype.setupGalleryControls = function() {
        var self = this;
        // Reset variable that we dont enter this function anymore!
        self.options.galleryControls = false;
        var ul = null;

        for (var i = 0; i < self.galleryItems.length; ++i) {
            var element = self.galleryItems[i];
            // Create our ul container append it and add CSS class to it
            if(ul === null){
                ul = document.createElement('ul');
                ul.className = "gallery-controls";
                ul.setAttribute('data-id', self.options.galleryID);

                var parent = element.parentNode || element.parentElement;
                parent.appendChild(ul);
            }

            // Construct our element
            var elementLi = document.createElement('li');
            var elementImg = document.createElement('img');
            elementImg.className = "gallery-controls-item animated flipInX";
            elementImg.setAttribute('src', element.getAttribute("src"));
            elementImg.setAttribute('data-id', i);

            // 1. Add IMG to LI
            elementLi.appendChild(elementImg);
            // 2. Add LI to main UL
            ul.appendChild(elementLi);
        }

    };
    /* Highlights current active item in control navigation
     *
     */
    coolGallery.prototype.highlightControlItem = function(item){
        var self = this;
        // Are controls enabled?
        if(self.options.setupGalleryControls === true){
            // What animation should we use?
            var galleryControlAnimation = self.options.galleryControlAnimation || 'flipInY';

            var controlElSelector = ".gallery-controls-item[data-id='" + item.id + "']";
            var controlEl = document.querySelector(controlElSelector);
            self.removeCssClasss(controlEl, 'flipInX');
            self.addCssClass(controlEl, galleryControlAnimation);
            
            if(item.id > 0){
                var prevControlElSelector = ".gallery-controls-item[data-id='" + (item.id - 1) + "']"; 
                var prevControlEl = document.querySelector(prevControlElSelector);
                self.removeCssClasss(prevControlEl, galleryControlAnimation);
            }
        }
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('coolGallery', [], function() {
            return coolGallery;
        });
    }
}.call(this));
