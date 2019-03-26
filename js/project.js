var slideshow;

$(function() {
  slideshow = initSlider();
});

// Create and return the slideshow object (slideshow.component.js)
function initSlider() {
  return new Slideshow({
    $slides: $('.slides'),
    $counterCurrent: $('.slides-current-num'),
    $counterTotal: $('.slides-total-num'),
  });
}

// Animation for Next/Prev Prompt
function initNextProjectPrompt() {
  $('.next-work').hover(function() {
    $('.next-prompt-background-overlay').fadeOut(300);
  }, function() {
    $('.next-prompt-background-overlay').fadeIn(150);
  });

  $('.prev-work').hover(function() {
    $('.prev-prompt-background-overlay').fadeOut(300);
  }, function() {
    $('.prev-prompt-background-overlay').fadeIn(150);
  });
}

// Handle Slideout Sidebar Animation
function initSidebarSlideoutHover() {
  var docHeight = $(document).height();
  var winHeight = $(window).height();
  var scrollTop = $(window).scrollTop();
  var promptHeight = (0.2175 * winHeight);
  var $logo = $('.navbar-logo');
  var logoColor = bootstrap.activeProject.logoColor;

  var lastSlideId = bootstrap.activeProject.slides[bootstrap.activeProject.slides.length - 1].id;
  var lastSlideDistance = $('.slide-content#' + lastSlideId).offset().top;

  $('.sidebar-shadow').mouseover(function() {
    if (logoColor === 'white') {
      $logo.removeClass('white');
      $('body').addClass('show-sidebar');
    } else {
      $('body').addClass('show-sidebar');
    }
  });

  $('.scrolling-sidebar').hover(function() {
    $('body').addClass('show-sidebar');
  }, function() {
    $('body').removeClass('show-sidebar');

    if (logoColor === 'white' && !$('.header-nav').hasClass('active')) {
      $logo.addClass('white');
    }

    // Sets localStorage to false so it doesn't open on its own
    setMenuClosed();
  });
}

// Enforces logo coloring based on project
function enforceLogoColor() {
  if (bootstrap.activeProject) {
    var logoColor = bootstrap.activeProject.logoColor;
    if (logoColor === 'white') {
      $('.navbar-logo').addClass('white');

      // Mobile Menu Color Change
      $('.navbar-mobile-menu').addClass('white');
    }
  }
}

// Filter toggling listeners
function initModeToggleListeners() {
  function scrollModeListener() {
    // Unbind leftover listeners from before in case they weren't used
    $(document).off('scroll.enterScrollMode');
    $('.masthead.eye').off('mouseover.enterScrollMode');

    // Re-bind one-off listeners
    // $('.masthead.eye').one('mouseover.enterScrollMode', enterScrollMode);
    $(document).one('scroll.enterScrollMode', enterScrollMode);

    function enterScrollMode() {
      $('body').removeClass('slideshow-mode');

      // Scroll to the current slide
      var $current = $('.slide.current');
      $(document).scrollTop($current.position().top);
      _.defer(slideshowModeListener);
    }
  }

  function slideshowModeListener() {
    // Keep track of which slide the user scrolls to, that will be our current
    $(document).on('scroll.calculateCurrentSlide', function() {
      var winHeight = window.innerHeight;
      var scrollTop = window.scrollY - winHeight;
      var slideIndex = Math.ceil(scrollTop / winHeight) + 1;
      slideshow.setCurrentIndex(slideIndex).recalculateGallery();
    });

    $(document).on('keydown', function(e) {
      // User clicked or pressed left or right key
      if (e.type === 'click' || (e.type === 'keydown' && (e.which === 37 || e.which === 39))) {
        e.stopPropagation();
        e.preventDefault();

        // Cancel this listener
        $('.slides').off('keydown click');
        $(this).trigger('enterSlidesMode');

        // if ($('.slide.current .slide-html-container').offset().top < 30) {
        //   $('.slide.current .slide-html-container').css('padding-top', '2rem');
        // }

        // Automates padding
        // dynamicPaddingOnSlideshowMode();
      }
    });

    // Remove the scroll class when user switches back to slideshow mode
    $(document).one('enterSlidesMode', function() {
      // Scroll to the current slide
      var $current = $('.slide.current');
      $(document).off('scroll.calculateCurrentSlide');

      $('body').animate({
        scrollTop: $current.position().top,
      }, {
        duration: 100,
        complete: function() {
          $(document).scrollTop(1);
          $('body').addClass('slideshow-mode');
          window.setTimeout(scrollModeListener, 250);
        },
      });
    });
  }

  // Based on what class the body currently has, start the listener to toggle it
  if ($('body').hasClass('slideshow-mode')) {
    scrollModeListener();
  } else {
    slideshowModeListener();
  }
}

// Adapts the top content with some dynamic padding
// function dynamicPaddingOnSlideshowMode() {
//   var projectSlides = bootstrap.activeProject.slides;
//   var slideIdArr = [];
//   _.each(projectSlides, function(slide) {
//     slideIdArr.push(slide.id);
//     console.log(slideIdArr);
//   });

//   _.each(slideIdArr, function(slideId) {
//     if ($('.slide.current slide-html-container').length > 0) {
//       var slideContent = $('.slide.current .slide-html-container');

//       // console.log(slideContent);
//       console.log('distance: ' + ($('.slide.next .slide-html-container')
//                                    .offset().top - $(window).height()));

//       // var distance = $(window).height() - slideContent.offset().top;
//       if ($('.slide.next .slide-html-container').offset().top - $(window).height() > 30) {
//         if ($('body').hasClass('slideshow-mode')) {
//           slideContent.css('padding-top', '2rem');
//           console.log('padded');
//         }
//       }
//     }
//   });
// }

// Handles the padding of slides on scroll mode
// Heavy use of jQuery and classes, be careful with changes here
function slidesPaddingOnScrollMode() {
  for (i = 0; i < bootstrap.activeProject.slides.length; i++) {
    // Gets current and next slides and alignments
    var currentSlide = bootstrap.activeProject.slides[i];
    var nextSlide = bootstrap.activeProject.slides[i + 1] || {};
    var prevSlide = bootstrap.activeProject.slides[i - 1] || {};
    var currentSlideAlign = currentSlide.imgLocation;
    var nextSlideAlign = nextSlide.imgLocation;
    var prevSlideAlign = prevSlide.imgLocation;

    // If slide has background image
    if (currentSlide.bgImage === true) {
      // if there is another image overlayed on top
      if ($('.slide-content#' + currentSlide.id).find('.slide-image').length >= 1) {
        // Adds full-height of bgimage slide template
        $('.slide-content#' + currentSlide.id).parent().removeClass('bg-image');

        // If current slide is aligned bottom or top
        if (currentSlideAlign === 'bottom') {
          $('.slide-content#' + currentSlide.id).find('.slide-image').addClass('slide-image-top-padding');

          // Remove padding
          $('.slide-content#' + currentSlide.id).parent().css('padding', '0');
        } else if (currentSlideAlign === 'top') {
          $('.slide-content#' + currentSlide.id).find('.slide-image').addClass('slide-image-bottom-padding');

          // Remove padding
          $('.slide-content#' + currentSlide.id).parent().css('padding', '0');
        } else {
          // Else, add the bg-image (100% height) CSS class
          $('.slide-content#' + currentSlide.id).parent().addClass('bg-image');
        }
      } else {
        // Adds class for height 100%
        $('.slide-content#' + currentSlide.id).parent().addClass('bg-image');
      }
    } else {
      // If currentslide is center aligned
      if (currentSlideAlign === 'center' || currentSlideAlign === 'side-image-right' || currentSlideAlign === 'side-image-left' || currentSlideAlign === 'image-first') {
        // if nextslide alignment is center/sides/image-first
        if ((nextSlideAlign === 'center' || nextSlideAlign === 'image-first' || nextSlideAlign === 'side-image-right' || nextSlideAlign === 'side-image-left') && (nextSlide.bgImage !== true)) {
          // Changes bottom padding to half of original current slide
          $('.slide-content#' + currentSlide.id).parent().addClass('half-bottom-padding');

          // Changes top padding to half of original next slide
          $('.slide-content#' + nextSlide.id).parent().addClass('half-top-padding');

          // if nextslide is aligned top
        } else if (nextSlideAlign === 'top') {
          // leaves currentSlide bottom padding normal
          // changes top padding of next slide to 0
          $('.slide-content#' + nextSlide.id).parent().addClass('top');

          // if nextslide is aligned bottom
        } else if (nextSlideAlign === 'bottom') {
          // changes top padding of nextslide to 0
          $('.slide-content#' + nextSlide.id).parent().addClass('bottom');

          // Half bottom padding from current slide
          $('.slide-content#' + currentSlide.id).parent().addClass('half-bottom-padding');
        }

        // If currentslide is top aligned
      } else if (currentSlideAlign === 'top') {
        // If prev slide is bottom or full height
        if ((prevSlideAlign === 'bottom' || prevSlideAlign === 'full-height') && (nextSlideAlign === 'center' || nextSlideAlign === 'image-first' || nextSlideAlign === 'side-image-left' || nextSlideAlign === 'side-image-right') && (nextSlide.bgImage !== true)) {
          // Add top class to current slide
          $('.slide-content#' + currentSlide.id).parent().addClass('top');

          // Add half bottom padding to current slide
          $('.slide-content#' + currentSlide.id).parent().addClass('half-bottom-padding');

          // Add half bottom padding to current slide
          $('.slide-content#' + nextSlide.id).parent().addClass('half-top-padding');
        } else if (prevSlideAlign === 'bottom' || prevSlideAlign === 'full-height') {
          // Adds top class to currentslide
          $('.slide-content#' + currentSlide.id).parent().addClass('top');
        }
        // If currentslide is top aligned
      } else if (currentSlideAlign === 'bottom') {
        if ((prevSlideAlign === 'center' || prevSlideAlign === 'image-first' || prevSlideAlign === 'side-image-left' || prevSlideAlign === 'side-image-right') && (prevSlide.bgImage !== true)) {
          // Changes bottom padding to 0
          $('.slide-content#' + currentSlide.id).parent().addClass('bottom');

          // Changes top padding to half
          $('.slide-content#' + currentSlide.id).parent().addClass('half-top-padding');
        } else {
          // Changes bottom padding to 0
          $('.slide-content#' + currentSlide.id).parent().addClass('bottom');
        }
      }

      // If slide isn't aligned bottom or has bgImage
      if ((currentSlideAlign !== 'bottom' && currentSlideAlign !== 'top') && (currentSlide.bgImage !== true)) {
        // If slide is last on set of slides
        if (currentSlide.id === _.last(bootstrap.activeProject.slides).id) {
          // apply half bottom padding class to last slide
          $('.slide-content#' + currentSlide.id).parent().addClass('half-bottom-padding');
        }
      }
    }
  }
}

// Runs at the beginning of every single project page load. Load order is important
function initSingleProject() {
  // Handles Slides padding on scroll mode
  slidesPaddingOnScrollMode();

  // Enforces hide of sidebar if user is on slide and not on sidebar on reload
  hideSidebarHoverSlide();

  // Enforce the project logo color
  enforceLogoColor();

  // Find Out if sidebar menu should be opened or not
  shouldMenuBeOpened();

  // Initialize the scroll listener once the body has scrolled to where it wants to be
  _.defer(initModeToggleListeners);

  // Changes color settings of single project page on load
  initNavbarColorOnLoad();

  // Loads single project page content aligment dom changes
  contentAlignmentDOM();

  // Updates Project Links on Load
  updateProjectLinksOnLoad();

  // Initializes Filter Toggle
  initFilterToggleListener();

  // Clears All Work Filtering
  _.defer(checkAllWorkFilterOnLoad);

  // Initializes Filtering System
  initFilterListeners();

  // LocalStorage Set on Click
  browsingMenuOpen();

  // If user scrolls, toggle show-sidebar class
  // initNavToggleListeners();

  // Filters sidebar work on load
  _.defer(filterWorkFromCheckboxes);

  // Initialize Sidebar Hover Slideout
  if (isMobile.phone || isMobile.tablet) {
    // Initializes Mobile Menu on Single Page
    initSinglePageNavbar();

    // Initializes Admin Navbar Dropdown
    initAdminMenuDropdown();
  } else {
    // Initializes the slideout hover effect on sidebar
    initSidebarSlideoutHover();
  }

  // Initializes and handles Sidebar List Filtering
  handleSidebarListFilter();

  // Initialize Next Project Prompt Hovered State
  initNextProjectPrompt();

  // Initializes dynamic change of next-prev projects
  handleFilteringNextPrevProjects();

  // Initializes the color change on navbar
  initNavbarBgColor();
}
