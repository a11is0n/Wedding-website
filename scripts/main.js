var ABOUT_US_BACKGROUND_IMAGE_HEIGHT = 300;

var $window;
var $nav, navTop, navHeight, $navPlaceholder;
var $pageLinks, pageLocations, currentActivePageHash;
var $aboutUsImageDivs;

$(document).ready(setup);

function setup() {
  $window = $(window);

  $nav = $('header > nav');
  navTop = $nav.offset().top;
  navHeight = $nav.height();
  $navPlaceholder = $('header > div#nav_placeholder');

  $pageLinks = $('header > nav > ul > li > a');
  pageLocations = {};
  currentActivePageHash = null;
  $pageLinks.each(function() {
    var pageHash = getPageHash($(this));
    pageLocations[pageHash] = $('#' + pageHash).offset().top;
  });

  $aboutUsImageDivs = $('#content > article#about_us > section > div > div.image_cell > div');

  $('header > nav > ul > li').on('click', 'a', smoothScroll);
  
  $window.scroll(scrollChecks);
  scrollChecks(); // Call this once on load to set up initial positions
}

function smoothScroll(event) {
  event.preventDefault();
  var selectedPage = $(this).attr('href');
  var destination = $(selectedPage).offset().top;
  $('body').animate({scrollTop: destination}, 750, function() {
    window.location.hash = selectedPage;
  });

  return false;
}

function scrollChecks() {
  toggleNav();
  updateActivePageLink();
  moveParallax();
}

function toggleNav() {
  var shouldStick = $window.scrollTop() > navTop;
  if (shouldStick && !$nav.hasClass('stuck')) {
    $nav.addClass('stuck');
    $navPlaceholder.height(navHeight);
  } else if (!shouldStick && $nav.hasClass('stuck')) {
    $nav.removeClass('stuck');
    $navPlaceholder.height(0);
  }
}

function updateActivePageLink() {
  var $activePageLink = null;
  var scrollTop = $window.scrollTop();
  // Iterate in page order
  $pageLinks.each(function() {
    var $this = $(this);
    var pageHash = getPageHash($this);
    if (scrollTop < pageLocations[pageHash]) {
      return false;
    }
    $activePageLink = $this;
  });
  if (getPageHash($activePageLink) !== currentActivePageHash) {
    $('header > nav > ul > li.active').removeClass('active');
    if ($activePageLink) {
      $activePageLink.parent('li').addClass('active');
    }
    currentActivePageHash = getPageHash($activePageLink);
  }
}

function getPageHash($element) {
  return $element ? $element.attr('href').replace(/^.*?(#|$)/,'') : null;
}

function moveParallax() {
  var windowTop = $window.scrollTop();
  var windowHeight = $window.height();
  var windowBottom = windowTop + windowHeight;
  $aboutUsImageDivs.each(function() {
    $this = $(this);
    if (elementOnScreen($this, windowTop, windowBottom)) {
      var offset = $this.offset();
      var height = $this.height();
      var currentOffset = offset.top - (windowTop - height);
      var startPosition = 0;
      var endPosition = height - ABOUT_US_BACKGROUND_IMAGE_HEIGHT;
      var distanceToMove = endPosition - startPosition;
      var distanceToTravel = windowHeight + height;
      var newPosition = endPosition - (currentOffset / distanceToTravel) * distanceToMove;
      var alignment = $this.is(':nth-child(even)') ? 'left' : 'right';
      $this.css('background-position', alignment + ' ' + newPosition + 'px');
    }
  });
}

function elementOnScreen($element, windowTop, windowBottom) {
  var offset = $element.offset();
  var top = offset.top;
  var height = $element.height();
  var bottom = top + height;
  return (top >= windowTop && top <= windowBottom) || (bottom >= windowTop && bottom <= windowBottom);
}