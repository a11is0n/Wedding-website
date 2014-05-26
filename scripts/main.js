var $window;
var $nav, navTop, navHeight, $navPlaceholder;
var $pageLinks, pageLocations, currentActivePageHash;

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

  $('header > nav > ul > li').on('click', 'a', smoothScroll);
  $window.scroll(scrollChecks);
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