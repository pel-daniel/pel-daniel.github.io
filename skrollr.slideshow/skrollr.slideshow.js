
(function($) {
  $.skrollrSlideshow = function(slides) {

    // default configuration values
    var options = {
      slideshowContainer: '#slideshow',
      navContainer: '#nav',
      thumbsContainer: '#thumbs',
      slideNumberContainer: '#slide-number',
      controlsContainer: '#controls',
      instructionsContainer: '#instructions',
      screensPerSlide: 1,
      screensPerTransition: .5,
      backgroundColor: 'rgb(18, 18, 18)',
      borderColor: 'rgb(230, 230, 230)'
    };

    var resizeThumbsContainer = function() {
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var imageWidth = windowHeight * 0.98 / 680 * 1024;
      var navWidth = windowWidth * 0.97 - imageWidth;

      $(options.navContainer).width(navWidth);
      $(options.slideshowContainer).width(imageWidth);
      $(options.instructionsContainer).width(imageWidth);
      $(options.thumbsContainer).height(windowHeight - $(options.thumbsContainer).position().top - 50);
    };

    var screens = function(index) {
      return index * 100 * (options.screensPerSlide + options.screensPerTransition);
    };

    var transitionStart = function(index) {
      return screens(index) - (options.screensPerTransition * 100);
    };

    var initSlides = function() {
      appendControls();

      $.each(slides, function(index, slide) {
        appendThumb(index, slide);
        appendSlide(index, slide);
        appendSlideNumber(index);
      });

      $(options.slideNumberContainer).append('<div>/ ' + slides.length + '</div>');
    };

    var appendControls = function() {
      $(options.controlsContainer).append(
        '<div><div id="' + options.slideNumberContainer.substring(1) + '"></div></div>' +
        '<div id="progress-bar">' +
          '<div id="progress" data-0p="width: 0%;" data-end="width: 100%;"></div>' +
        '</div>');
    };

    var appendThumb = function(index, slide) {
      $(options.thumbsContainer).append(
        '<img data-thumb-number="' + index + '" ' +
        (index == 0 ? '' : 'data-' + transitionStart(index) + 'p="border-color: ' + options.backgroundColor + '" ' ) + 
        'data-' + screens(index) + 'p="border-color: ' + options.borderColor + '" ' +
        'data-' + screens(index + 1) + 'p="border-color: ' + options.backgroundColor + '" src="' + slide.t + '" />');
    };

    var appendSlide = function(index, slide) {
      $(options.slideshowContainer).append(
        '<div id="s' + index + '"' +
        'data-' + transitionStart(index + 1) + 'p="opacity: 1"' +
        'data-' + screens(index + 1) + 'p="opacity: 0; z-index:' + (slides.length - index) + '"' +
        'data-' + (screens(index + 1) + 10) + 'p="z-index: -1">' +
          '<img class="slide" src="' + slide.s + '">' +
        '</div>');
    };

    var appendSlideNumber = function(index) {
      $(options.slideNumberContainer).append(
        '<span style="z-index:' + (slides.length - index) + '" ' +
        (index == 0 ? '' : 'data-' + transitionStart(index) + 'p="opacity: 0;" ' ) + 
        'data-' + screens(index) + 'p="opacity: 1;" ' +
        (index == slides.length - 1 ? '>' : 'data-' + screens(index + 1) + 'p="opacity: 0;">') + // Don't fade out the number of the last slide
        (index + 1) + '</span>');
    };

    initSlides();
    $('#thumbs > img').click(function() {
      var top = $(this).data('thumb-number') * $(window).height() * (options.screensPerSlide + options.screensPerTransition);
      $(window).scrollTop(top);
    })

    skrollr.init();

    resizeThumbsContainer();
    $(window).resize(resizeThumbsContainer);
  }
}) (jQuery);
