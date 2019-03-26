/*
Slideshow Component
-----------------

An extensible class for adding slideshow functionality to a group of elements. Supports next/prev buttons,
autoplay and counter elements for showing the current and total number of slides.

@ $slides (jQuery el) - The element containing the slides (jQuery object)
@ $nextButton (jQuery el) - The forward button
@ $prevButton (jQuery el) - The previous button
@ $counterCurrent (jQuery el) - The element to display the current slide
@ $counterTotal (jQuery el) - The element to display the total number of slides
@ autoPlay (int|bool) - Speed to autoplay the slides in ms, or false turns off autoplay
@ firstSlide (int) - Which slide to start on (defaults to 0)
@ loopForwards (bool) - Whether we should restart the slideshow when we go past the last slide
@ loopBackwards (bool) - Whether we should go the end of the slideshow when we go past the first slide
*/

function Slideshow(data) {

  /*
    Set properties from the data object
  */

  this.$slides = data.$slides
  this.$nextButton = typeof(data.$nextButton) != "undefined" ? data.$nextButton : [];
  this.$prevButton = typeof(data.$prevButton) != "undefined" ? data.$prevButton : [];
  this.$counterCurrent = typeof(data.$counterCurrent) != "undefined" ? data.$counterCurrent : false;
  this.$counterTotal = typeof(data.$counterTotal) != "undefined" ? data.$counterTotal : false;
  this.autoPlay = data.autoPlay ? data.autoPlay : false;
  this.firstSlide = typeof(data.firstSlide) === "number" ? data.firstSlide : 0;
  this.loopForwards = data.loopForwards ? true : false;
  this.loopBackwards = data.loopBackwards ? true : false;

  this.$items = this.$slides.find("> *");
  this.currIndex = this.firstSlide;
  this.maxIndex = this.$items.length;

  /*
   Set up bindings
  */

  _this = this;

  if(this.$nextButton.length){
    this.$nextButton.on("click.advance", $.proxy(this.advance, this));
  }
  if(this.$prevButton.length){
    this.$prevButton.on("click.recede", $.proxy(this.recede, this));
  }
  if(this.$counterCurrent.length){
    // Update the counter when the slideshow is updated
    this.$slides.on("recalc:slideshow", $.proxy(this.setCounterCurrent, this));
  }

  if(this.$counterTotal.length){
    this.setCounterTotal();
  }

  $(document).keydown(function(e) {

    switch(e.which) {

        case 39: // right

          e.preventDefault();
          _this.advance();
        break;
        case 37: // left
          
          e.preventDefault();
          _this.recede();
        break;

        default: 

          return; // exit this handler for other keys
    }
  });
  
  _.defer(function(){
    // Start the gallery
    _this.$slides.trigger("initialize:slideshow");
    _this.recalculateGallery(true);
  });

  return this;
};

/*
  Autoplay slideshow
*/


Slideshow.prototype.initAutoPlay = function(ms) {
  
  var _this = this;
  if (this.timerID) {
    clearTimeout(this.timerID);
  }
  return this.timerID = setTimeout((function() {
    return _this.advance();
  }), ms);
  // return this;
};

/*
Movement Functions
*/

/*
  Set current index field to the next slide position
*/

Slideshow.prototype.advance = function() {
  
  this.currIndex++;
  if (this.currIndex + 1 > this.maxIndex) {
    this.handleMaxLimit();
  }
  else {
    this.recalculateGallery();
  }
  return this;
};

/*
  Set current index field to the previous slide position
*/

Slideshow.prototype.recede = function() {

  this.currIndex--;
  if (this.currIndex < 0) {
    this.handleMinLimit();
  } 
  else {
    this.recalculateGallery();
  }
  return this;
};

/*
  Set current index field to the arguments position
*/

Slideshow.prototype.gotoIndex = function(index) {
  
  this.currIndex = index;
  this.recalculateGallery();
  return this;
};

Slideshow.prototype.goToStart = function() {
  this.gotoIndex(0);
  return this;
};

Slideshow.prototype.goToEnd = function() {
  this.gotoIndex(this.maxIndex);
  return this;
};

/*
  When the final slide is reached, trigger the maxLimit event and go back to the beginning if this.loopForwards == true
*/

Slideshow.prototype.handleMaxLimit = function() {

  this.$slides.trigger("maxLimit:slideshow");
  if(this.loopForwards){
    return this.goToStart();
  }
  else{
    this.currIndex = this.maxIndex - 1;
  }
  return this;
};

/*
  When the first slide is reached, trigger the minLimit event and go to the end if this.loopBackwards == true
*/

Slideshow.prototype.handleMinLimit = function() {

  this.$slides.trigger("minLimit:slideshow");
  if(this.loopBackwards){
    return this.goToEnd();
  }
  else{
    this.currIndex = 0;
  }
  return this;
};

/*
  Apply classes based upon current position field
  Note: Doesn't cause a reflow - all the slides are out of the document flow.
*/
Slideshow.prototype.recalculateGallery = function(init) {

  var _this = this;
  $.each(this.$items, function(i, el){

    if (i < _this.currIndex) {
      $(el).addClass('passed').removeClass("next current upcoming");
    }
    if (i === _this.currIndex) {
      $(el).addClass('current').removeClass("next passed upcoming").trigger('isCurrent');
    }
    if (i > _this.currIndex) {
      $(el).addClass('upcoming').removeClass("next passed current");
      if(i === _this.currIndex + 1) {

        $(el).addClass('next');
      }
    }
  });

  /*
    Reset the autoplay
  */

  if(typeof(this.autoPlay) === "number"){
    
    this.initAutoPlay(this.autoPlay);
  }

  /*
    Fire events
  */

  this.$slides.trigger("recalc:slideshow", this);
  return this;
};

Slideshow.prototype.getCurrentItem = function() {

  this.$items[this.currIndex];
  return this;
};

Slideshow.prototype.getCurrentIndex = function() {

  this.currIndex;
  return this;
};

Slideshow.prototype.setCurrentIndex = function(newIndex) {

  this.currIndex = newIndex;
  return this;
};

Slideshow.prototype.setCounterTotal = function() {

  this.$counterTotal.text(this.maxIndex);
  return this;
};

Slideshow.prototype.setCounterCurrent = function() {

  this.$counterCurrent.text(this.currIndex + 1);
  return this;
};
