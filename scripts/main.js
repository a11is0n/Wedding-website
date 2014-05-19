var $window;
var $nav, navTop, navHeight, $navPlaceholder;

$(document).ready(setup);

function setup() {
  $window = $(window);
  $nav = $('header > nav');
  navTop = $nav.offset().top;
  navHeight = $nav.height();
  $navPlaceholder = $('header > div#nav_placeholder');
  $window.scroll(toggleNav);
  $('header > nav > ul > li').on('click', 'a', smoothScroll);
}

function smoothScroll(event) {
  event.preventDefault();
  var selectedPage = $(this).attr('href');
  var destination = $(selectedPage).offset().top;
  $('body').animate({scrollTop: destination}, 1000, function() {
    window.location.hash = selectedPage;
  });

  return false;
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