/**
 * Scroll Functions
 */

// Navbar Elevation on Scroll
function initNavbarElevation() { // eslint-disable-line
  // On scroll
  $(document).scroll(function() {
    // Variables
    var topOfPage = $(this).scrollTop();
    var headerDivSize = $('.full-header')[0].offsetHeight - 64;

    // If user has scrolled past waypoint
    if (topOfPage > headerDivSize) {
      $('.header-nav').addClass('elevated');
      $('.navbar-logo-container').addClass('active');
    } else {
      $('.header-nav').removeClass('elevated');
      $('.navbar-logo-container').removeClass('active');
    }
  });
}
/*
 * End Scroll Functions
 **/

/**
 * Navbar Functions
 */

// Show sandwich menu if single page work/job
function initSinglePageNavbar() {
  if (isMobile.phone) {
    displayMobileMenu();
    hideInactiveMenuItems();
    initDropdownMenuOnMobileSingle();
  }
}

// If device is less than 600px wide
function isDeviceMobile() {
  if (screen.width < 600) {
    return true;
  }

  return false;
}

// Displays the sandwich menu button
function displayMobileMenu() {
  // Variables/Objects
  var $body = $('body');
  var $mobileMenu = $('.dropdown-mobile-menu');

  // If not in a single job or single project page
  if ($body.hasClass('single-work') || $body.hasClass('single-job')) {
    $mobileMenu.removeClass('not-displayed');
  } else {
    $mobileMenu.addClass('not-displayed');
  }
}

// Hides inactive menu items
function hideInactiveMenuItems() {
  var $staticMenuItems = $('.header-nav-item.static');

  // breadcrumbs will increase the children length to 1
  var $activeWork = $('.work-link a').children().length;
  var $activeJob = $('.jobs-link a').children().length;

  // if work has breadcrumb then it means it's active
  // if job has breadcrumb then it means it's active
  if ($activeWork > 0) {
    $staticMenuItems.addClass('not-displayed');
    $('.jobs-link').addClass('not-displayed');
    $('.navbar-logo-container').addClass('mobile-only-active');
  } else if ($activeJob > 0) {
    $staticMenuItems.addClass('not-displayed');
    $('.work-link').addClass('not-displayed');
    $('.navbar-logo-container').addClass('mobile-only-active');
  }
}

// Initializes dropdown functionality on single page on mobile
function initDropdownMenuOnMobileSingle() {
  $('.dropdown-mobile-menu').on('click', function() {
    $('.navbar-mobile-menu').toggleClass('open');
    $('.single-dropdown-nav-container').toggleClass('open');
  });
}

// Initializes the dropdown functionality of the admin navbar item
function initAdminMenuDropdown() {
  $('.admin-dropdown-toggle').on('click', function(e) {
    e.preventDefault();
    $('.admin-navbar-dropdown').toggleClass('open');
  });
}

// Navbar changes in single project page based on color choices
function initNavbarBgColor() {
  // On scroll
  $(window).scroll(function() {
    // Variables/Objects
    var topOfPage = $(this).scrollTop();
    var color = bootstrap.activeProject.color; // eslint-disable-line
    var logoColor = bootstrap.activeProject.logoColor; // eslint-disable-line
    var breakPoint = 80;
    if (topOfPage >= breakPoint) {
      $('.header-nav').addClass('active');
      $('.header-nav-item').css('color', '#222');
      $('.navbar-logo').removeClass('white');
      $('.navbar-mobile-menu').removeClass('white');
    } else {
      $('.header-nav').removeClass('active');
      $('.header-nav-item').css('color', color);
      if (logoColor === 'white') {
        $('.navbar-logo').addClass('white');
        $('.navbar-mobile-menu').addClass('white');
      } else {
        $('.navbar-logo').removeClass('white');
        $('.navbar-mobile-menu').removeClass('white');
      }
    }
  });
}

// Loads the changes to the navbar coloring on single project page
function initNavbarColorOnLoad() {
  var newColor;
  var color = bootstrap.activeProject.color;

  if (bootstrap.activeProject.slides[0]) {
    var firstSlideColor = bootstrap.activeProject.slides[0].bgColor;
    if (firstSlideColor === '#000' || firstSlideColor === '#000000') {
      newColor = '#222';
    } else {
      newColor = getColorLuminance(firstSlideColor, -0.35);
    }
  } else {
    newColor = '#222';
  }

  $('.header-nav-item').css('color', color);
  $('.current-project').css('color', newColor);
}

/*
 * End Navbar Function
 **/

/**
 * Misc Functions
 */

// If user is using Internet Explorer (or Edge)
function isInternetExplorer() {
  // UserAgent & Variables
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    // return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    return true;
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    // var rv = ua.indexOf('rv:');
    // return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    return true;
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // IE 12 (aka Edge) => return version number
    // return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    return true;
  }

  // Any other browser
  return false;
}

// Given a hex value, return a new hex value
// a negative lum value generates a darker color
// a positive lum value generates a lighter color
// -1 <= lum >= 1
function getColorLuminance(hex, lum) {
  if (!hex) return null;

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, ''); // eslint-disable-line
  if (hex.length < 6) {
     // eslint-disable-next-line
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  lum = lum || 0;  // eslint-disable-line

  // convert to decimal and change luminosity
  var rgb = '#';
  var c;
  var i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }

  return rgb;
}

// Navbar Logo redirect on Click
function homepageOnClick() {
  $('.navbar-logo-container').on('click', function() {
    window.location.href = '/';
  });
}

// Handles content alignment on load of single project page
function contentAlignmentDOM() {
  _.each(bootstrap.activeProject.slides, function(slide) {
    if (slide.imgLocation === 'top') {
      $('.slide-content#' + slide.id).find('.vc-content').css('vertical-align', 'top');
    } else if (slide.imgLocation === 'bottom') {
      $('.slide-content#' + slide.id).find('.vc-content').css('vertical-align', 'bottom');
    } else if (slide.imgLocation === 'full-height') {
      $('.slide-content#' + slide.id).parent()
        .addClass('full-height');
      $('.slide-content#' + slide.id).parent()
        .css('height', 'auto')
        .css('padding-top', '0')
        .css('padding-bottom', '0');
      $('.slide-content#' + slide.id).find('.vc-content')
        .css('height', 'auto');
    }
  });
}

// Hides sidebar is user is hovered on slide
function hideSidebarHoverSlide() {
  $('.slide').hover(function() {
    $('body').removeClass('show-sidebar');
  });
}


/*
 * End Misc Functions
 **/

/**
 * MailChimp
 */

// Handles animation of the email subscription input
function initEmailSubscribeAnimation() {
  var $input = $('.email-subs-input');
  var $submit = $('.email-subs-submit');

  if (!isMobile.phone) {
    $input.on('focus', function() {
      $(this).attr('placeholder', '');
      $(this).addClass('full-width');
      $submit.addClass('show');
    });

    $input.on('focusout', function() {
      if ($(this).val() === '') {
        $(this).attr('placeholder', 'Give us your email and we\'ll send you stuff');
        $(this).removeClass('full-width');
        $submit.removeClass('show');
      }
    });

    $submit.on('click', function() {
      $(this).removeClass('show');
      $input.removeClass('full-width');
    });
  }
}

// Hides Email Input
function hideSuccessfullInput() {
  var $input = $('.email-subs-input');
  $input.fadeOut();
}

// Hides Submit Mobile Button
function hideMobileSubmit() {
  var $submit = $('.email-subs-submit');
  $submit.fadeOut();
}

// Hides Result Message
function showResMessage() {
  var $result = $('#notification_container');
  $result.fadeIn();
}

// Hides Result Message
function hideResMessage() {
  var $result = $('#notification_container');
  $result.fadeOut();
}

// MailChimp Handle on Click Event
function handleMailchimpSub() {
  var $form = $('#mc-embedded-subscribe-form');

  $('.email-subs-input').keypress(function(e) {
    if (e.which === 13) {
      e.preventDefault();
      registerMailchimpEmail($form);
      hideSuccessfullInput();
      hideMobileSubmit();
    }
  });

  $('#mc-embedded-subscribe').on('click', function(e) {
    if (e) e.preventDefault();
    registerMailchimpEmail($form);
    hideSuccessfullInput();
    if (isMobile.phone) {
      hideMobileSubmit();
    }
  });
}

// Actual MailChimp JSON Sub
function registerMailchimpEmail($form) {
  $.ajax({
    type: $form.attr('method'),
    url: $form.attr('action'),
    data: $form.serialize(),
    cache: false,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    error: function() {
      $('#notification_container').html('<span class="alert">Could not connect to server. Please try again later.</span>');
      showResMessage();
      _.delay(hideResMessage, 6000);
    },

    success: function(data) {
      var message;

      if (data.result !== 'success') {
        message = data.msg.substring(4);
        $('#notification_container').html('<span class="alert">' + message + '</span>');
      } else {
        message = data.msg;
        $('#notification_container').html('<span class="success">' + message + '</span>');
      }

      showResMessage();
      _.delay(hideResMessage, 6000);
    },

  });
}


/*
 * End MailChimp
 **/


/*
  Local Storage
*/

// localStorage detection
function supportsLocalStorage() {
  return typeof (Storage) !== 'undefined';
}

function setMenuOpen() {
  localStorage.setItem('isMenuOpen', 'true');
}

function setMenuClosed() {
  localStorage.setItem('isMenuOpen', 'false');
}

function browsingMenuOpen() {
  if (!supportsLocalStorage()) {
    // Cookie setup
    console.log('Menu state support disabled. Please update to a newer browser version.');
  } else {
    $('.work-nav-link').on('click', function() {
      setMenuOpen();
    });
  }
}

function shouldMenuBeOpened() {
  var isMenuOpen = localStorage.getItem('isMenuOpen') || 'false';

  if (isMenuOpen === 'true') {
    var projectLogoColor = bootstrap.activeProject.logoColor;
    if (projectLogoColor === 'white') {
      $('.navbar-logo').removeClass('white');
      $('body').addClass('show-sidebar');
    } else {
      $('body').addClass('show-sidebar');
    }
  }
}

/*
  End LocalStorage
*/
