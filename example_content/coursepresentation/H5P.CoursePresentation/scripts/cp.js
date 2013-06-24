var H5P = H5P || {};

/**
 * Constructor.
 *
 * @param {object} params Start paramteres.
 * @param {int} id Content identifier
 * @param {function} editor
 *  Set if an editor is initiating this library
 * @returns {undefined} Nothing.
 */
H5P.CoursePresentation = function (params, id, editor) {
  this.slides = params.slides;
  this.slidesWithSolutions = [];
  this.editor = editor;

  this.l10n = H5P.jQuery.extend({}, {
    scrollLeft: 'Hold to scroll left',
    jumpToSlide: 'Jump to slide',
    scrollRight: 'Hold to scroll right',
    slide: 'Slide',
    yourScore: 'Your score',
    maxScore: 'Max score',
    goodScore: 'Congratulations! You got @percent correct!',
    okScore: 'Nice effort! You got @percent correct!',
    badScore: 'You need to work more on this. You only got @percent correct...',
    total: 'TOTAL',
    showSolutions: 'Show solutions',
    close: 'Close',
    title: 'Title',
    author: 'Author',
    lisence: 'Lisence',
    infoButtonTitle: 'View metadata',
    solutionsButtonTitle: 'View solution'
  }, params.l10n !== undefined ? params.l10n : {});
  this.contentPath = H5P.getContentPath(id);
};

/**
 * Render the presentation inside the given container.
 *
 * @param {H5P.jQuery} $container Container for this presentation.
 * @returns {undefined} Nothing.
 */
H5P.CoursePresentation.prototype.attach = function ($container) {
  var that = this;

  var html =
          '<div class="h5p-wrapper" tabindex="0">' +
          '  <div class="h5p-presentation-wrapper">' +
          '    <div class="h5p-slides-wrapper h5p-keyword-slides"></div>' +
          '    <div class="h5p-keywords-wrapper"></div>' +
          '  </div>' +
          '    <a href="#" class="h5p-show-solutions" style="display: none;">' + this.l10n.showSolutions + '</a>' +
          '  <div class="h5p-slideination">' +
          '    <a href="#" class="h5p-scroll-left" title="' + this.l10n.scrollLeft + '">&lt;</a>' +
          '    <ol></ol>' +
          '    <a href="#" class="h5p-scroll-right" title="' + this.l10n.scrollRight + '">&gt;</a>' +
          '  </div>' +
          '</div>';

  $container.addClass('h5p-course-presentation').html(html);

  this.$container = $container;
  this.$wrapper = $container.children('.h5p-wrapper').focus(function () {
    that.initKeyEvents();
  }).blur(function () {
    H5P.jQuery('body').unbind('keydown', that.keydown);
    delete that.keydown;
  }).click(function (event) {
    var $target = H5P.jQuery(event.target);
    if (!$target.is("input, textarea")) {
      // Add focus to the wrapper so that it may capture keyboard events
      that.$wrapper.focus();
    }
  });

  this.width = parseInt(this.$wrapper.css('width'));
  this.height = parseInt(this.$wrapper.css('height'));
  this.ratio = this.width / this.height;
  this.fontSize = parseInt(this.$wrapper.css('fontSize'));

  this.$presentationWrapper = this.$wrapper.children('.h5p-presentation-wrapper');
  this.$slidesWrapper = this.$presentationWrapper.children('.h5p-slides-wrapper');
  this.$keywordsWrapper = this.$presentationWrapper.children('.h5p-keywords-wrapper');
  this.$slideination = this.$wrapper.children('.h5p-slideination');
  var $solutionsButton = this.$wrapper.children('.h5p-show-solutions');

  // Detemine if there are any keywords.
  for (var i = 0; i < this.slides.length; i++) {
    var slide = this.slides[i];
    if (slide.keywords !== undefined) {
      this.keywordsWidth = this.$keywordsWrapper.width() / (this.width / 100);
      break;
    }
  }
  if (this.keywordsWidth === undefined) {
    this.keywordsWidth = 0;
    this.$keywordsWrapper.remove();
    this.$slidesWrapper.removeClass('h5p-keyword-slides');
  }
  this.slideWidthRatio = (100 - this.keywordsWidth) / 100; // Since the slides have empty space under the keywords list.

  // Needed for images etc. to get correct aspect ratio.
  this.slideRatio = (this.$presentationWrapper.width() / this.$presentationWrapper.height());

  var keywords = '';
  var slideinationSlides = '';
  for (var i = 0; i < this.slides.length; i++) {
    var slide = this.slides[i];
    var $slide = H5P.jQuery(H5P.CoursePresentation.createSlide(slide)).appendTo(this.$slidesWrapper);
    var first = i === 0;

    if (first) {
      this.$current = $slide.addClass('h5p-current');
    }

    if (slide.elements !== undefined) {
      for (var j = 0; j < slide.elements.length; j++) {
        this.addElement(slide.elements[j], $slide, i);
      }
    }

    if (this.keywordsWidth && slide.keywords !== undefined) {
      keywords += this.keywordsHtml(slide.keywords, first);
    }

    slideinationSlides += H5P.CoursePresentation.createSlideinationSlide(i + 1, this.l10n.jumpToSlide, first);
  }

  // Initialize keywords
  if (keywords) {
    this.$keywords = this.$keywordsWrapper.html('<ol class="h5p-keywords-ol">' + keywords + '</ol>').children('ol');
    this.$currentKeyword = this.$keywords.children('.h5p-current');

    this.$keywords.children('li').click(function () {
      that.keywordClick(H5P.jQuery(this));
    });
  }

  // Initialize touch events
  this.initTouchEvents();

  // Slideination
  this.initSlideination(this.$slideination, slideinationSlides);

  $solutionsButton.click(function(event) {
    that.showSolutions();
    event.preventDefault();
  });
  if (this.slides.length === 1 && this.editor === undefined && this.slidesWithSolutions.length) {
    $solutionsButton.show();
  }

  H5P.$window.resize(function() {
    that.resize(false);
  });
  this.resize(false);

  // In view mode, make continuous text smaller if it
  // does not fit inside container
  if (this.editor === undefined) {
    H5P.jQuery('.h5p-ct > .ct', $container).each(function (){
      var percent = 100;
      var $ct = $(this);
      var parentHeight = $ct.parent().height();

      while ($ct.height() > parentHeight) {
        percent = percent - 2;
        $ct.css({
          fontSize: percent + '%',
          lineHeight: (percent + 65) + '%'
        });

        if (percent < 50) {
          break; // Just in case. Makes no sense going further.
        }
      }
    });
  }
};

H5P.CoursePresentation.prototype.resize = function (fullscreen) {
  var fullscreenOn = H5P.$body.hasClass('h5p-fullscreen') || H5P.$body.hasClass('h5p-semi-fullscreen');
  if (!fullscreenOn) {
    // Make sure we use all the height we can get. Needed to scale up.
    this.$container.css('height', '99999px');
  }

  var width = this.$container.width();
  var height = this.$container.height();

  if (width / height >= this.ratio) {
    // Wider
    width = height * this.ratio;

  }
  else {
    // Narrower
    height = width / this.ratio;
  }

  this.$wrapper.css({
    width: width + 'px',
    height: height + 'px',
    fontSize: (this.fontSize * (width / this.width)) + 'px'
  });

  this.swipeThreshold = (width / this.width) * 100; // Default swipe threshold is 100px.

  if (fullscreen) {
    this.$wrapper.focus();
  }
  if (!fullscreenOn) {
    this.$container.css('height', '');
  }
};

/**
 *
 * @param {jQuery} $keyword
 * @returns {undefined}
 */
H5P.CoursePresentation.prototype.keywordClick = function ($keyword) {
  if ($keyword.hasClass('h5p-current')) {
    return;
  }

  this.jumpToSlide($keyword.index());
};

/**
 * Add element to the given slide and stores elements with solutions.
 *
 * @param {Object} element The Element to add.
 * @param {jQuery} $slide Optional, the slide. Defaults to current.
 * @param {int} index Optional, the index of the slide we're adding elements to.
 * @returns {unresolved}
 */
H5P.CoursePresentation.prototype.addElement = function (element, $slide, index) {
  if ($slide === undefined) {
    $slide = this.$current;
  }
  if (index === undefined) {
    index = $slide.index();
  }

  var elementInstance = new (H5P.classFromName(element.action.library.split(' ')[0]))(element.action.params, this.contentPath);

  var $elementContainer = H5P.jQuery('<div class="h5p-element" style="left: ' + (element.x + this.keywordsWidth) + '%; top: ' + element.y + '%; width: ' + (element.width * this.slideWidthRatio) + '%; height: ' + element.height + '%;"></div>').appendTo($slide);
  elementInstance.attach($elementContainer);

  if (this.editor !== undefined) {
    // If we're in the H5P editor, allow it to manipulate the elements
    this.editor.processElement(element, $elementContainer, index);
  }
  else {
    if (element.solution) {
      this.addElementSolutionButton(element, elementInstance, $elementContainer);
    }
    var info = this.getElementInfo(element);
    if (info) {
      this.addElementInfoButton(info, $elementContainer);
    }
  }

  if (this.checkForSolutions(elementInstance)) {
    if (this.slidesWithSolutions[index] === undefined) {
      this.slidesWithSolutions[index] = [];
    }
    this.slidesWithSolutions[index].push(elementInstance);
  }

  return $elementContainer;
};

/**
 * Adds a solution button
 *
 * @param {string} info Info in html format.
 * @param {jQuery} $elementContainer Wrapper for the element.
 * @returns {undefined}
 */
H5P.CoursePresentation.prototype.addElementInfoButton = function (info, $elementContainer) {
  var that = this;
  var $elementInfoButton = H5P.jQuery('<a href="#" class="h5p-element-info" title="' + this.l10n.infoButtonTitle +'"></a>')
  .click(function(event) {
    event.preventDefault();
    that.showPopup(info);
  });
  $elementContainer.append($elementInfoButton);
};

/**
 * Extract info from element Params and convert to html
 *
 * @param {object} elementParams
 * @returns
 *  false if no info is found
 *  info as html string if info is found
 */
H5P.CoursePresentation.prototype.getElementInfo = function (elementParams) {
  var infoKeys = ['title', 'author', 'lisence'];
  var listContent = '';
  if (elementParams.metadata !== undefined) {
    for (var i = 0; i < infoKeys.length; i++) {
      var info = elementParams.metadata[infoKeys[i]];
      if (info !== undefined && info.length > 0) {
        listContent += '<dt>' + this.l10n[infoKeys[i]] + ':</dt><dd>' + info + '</dd>';
      }
    }
  }
  if (listContent === '') {
    return false;
  }
  return '<dl>' + listContent + '</dl>';
};

/**
 * Adds a info button
 *
 * @param {Object} element Properties from params.
 * @param {Object} elementInstance Instance of the element.
 * @param {jQuery} $elementContainer Wrapper for the element.
 * @returns {undefined}
 */
H5P.CoursePresentation.prototype.addElementSolutionButton = function (element, elementInstance, $elementContainer) {
  var that = this;
  elementInstance.showSolutions = function() {
    if ($elementContainer.children('.h5p-element-solution').length === 0) {
      var $elementSolutionButton = H5P.jQuery('<a href="#" class="h5p-element-solution" title="' + that.l10n.solutionsButtonTitle + '"></a>')
      .data('solution', element.solution).click(function(event) {
        event.preventDefault();
        that.showPopup(H5P.jQuery(this).data('solution'));
      });
      $elementContainer.append($elementSolutionButton);
    }
  };
};

/**
 * Displays a popup.
 *
 * @param {String} popupContent
 * @returns {undefined}
 */
H5P.CoursePresentation.prototype.showPopup = function (popupContent) {
  var $popup = H5P.jQuery('<div class="h5p-popup-overlay"><div class="h5p-popup-container"><div class="h5p-popup-wrapper">' + popupContent +
           '</div><a href="#" class="h5p-button h5p-close-popup">' + this.l10n.close + '</a></div></div>')
  .prependTo(this.$wrapper).find('.h5p-close-popup').click(function(event) {
    event.preventDefault();
    $popup.remove();
  }).end();
};

/**
 * Does the element have a solution?
 *
 * @param {H5P library instance} elementInstance
 * @returns {Boolean}
 *  true if the element has a solution
 *  false otherwise
 */
H5P.CoursePresentation.prototype.checkForSolutions = function (elementInstance) {
  if (elementInstance.showSolutions !== undefined) {
    return true;
  }
  else {
    return false;
  }
};

/**
 * Generate html for the given keywords.
 *
 * @param {Array} keywords List of keywords.
 * @param {Boolean} first Indicates if this is the first slide.
 * @returns {String} HTML.
 */
H5P.CoursePresentation.prototype.keywordsHtml = function (keywords, first) {
  var html = '';

  for (var i = 0; i < keywords.length; i++) {
    var keyword = keywords[i];

    html += '<li class="h5p-keywords-li"><span>' + keyword.main + '</span>';

    if (keyword.subs !== undefined && keyword.subs.length) {
      html += '<ol class="h5p-keywords-ol">';
      for (var j = 0; j < keyword.subs.length; j++) {
        html += '<li class="h5p-keywords-li h5p-sub-keyword"><span>' + keyword.subs[j] + '</span></li>';
      }
      html += '</ol>';
    }
    html += '</li>';
  }
  if (html) {
    html = '<ol class="h5p-keywords-ol">' + html + '</ol>';
  }

  return '<li class="h5p-keywords-li' + (first ? ' h5p-current' : '') + '">' + html + '</li>';
};

/**
 * Initialize key press events.
 *
 * @returns {undefined} Nothing.
 */
H5P.CoursePresentation.prototype.initKeyEvents = function () {
  if (this.keydown !== undefined) {
    return;
  }

  var that = this;
  var wait = false;

  this.keydown = function (event) {
    if (wait) {
      return;
    }

    // Left
    if (event.keyCode === 37 && that.previousSlide()) {
      wait = true;
    }

    // Right
    else if (event.keyCode === 39 && that.nextSlide()) {
      wait = true;
    }

    if (wait) {
      // Make sure we only change slide every 300ms.
      setTimeout(function () {
        wait = false;
      }, 300);
    }
  };

  H5P.jQuery('body').keydown(this.keydown);
};

/**
 * Initialize touch events
 *
 * @returns {undefined} Nothing.
 */
H5P.CoursePresentation.prototype.initTouchEvents = function () {
  var that = this;
  var startX, startY, lastX, prevX, nextX, scroll;

  this.$slidesWrapper.bind('touchstart', function (event) {
    // Set start positions
    lastX = startX = event.originalEvent.touches[0].pageX;
    startY = event.originalEvent.touches[0].pageY;
    prevX = parseInt(that.$current.addClass('h5p-touch-move').prev().addClass('h5p-touch-move').css('left'));
    nextX = parseInt(that.$current.next().addClass('h5p-touch-move').css('left'));

    scroll = null;

  }).bind('touchmove', function (event) {
    var touches = event.originalEvent.touches;

    // Determine horizontal movement
    lastX = touches[0].pageX;
    var movedX = startX - lastX;

    if (scroll === null) {
      // Detemine if we're scrolling horizontally or changing slide
      scroll = Math.abs(startY - event.originalEvent.touches[0].pageY) > Math.abs(movedX);
    }
    if (touches.length !== 1 || scroll) {
      // Do nothing if we're scrolling, zooming etc.
      return;
    }

    // Disable horizontal scrolling when changing slide
    event.preventDefault();

    if (movedX < 0) {
      // Move previous slide
      that.$current.next().css('left', '');
      that.$current.prev().css('left', prevX - movedX);
    }
    else {
      // Move next slide
      that.$current.prev().css('left', '');
      that.$current.next().css('left', nextX - movedX);
    }

    // Move current slide
    that.$current.css('left', -movedX);

  }).bind('touchend', function () {
    if (!scroll) {
      // If we're not scrolling detemine if we're changing slide
      var moved = startX - lastX;
      if (moved > that.swipeThreshold && that.nextSlide() || moved < -that.swipeThreshold && that.previousSlide()) {
        return;
      }
    }
    // Reset.
    that.$slidesWrapper.children().css('left', '').removeClass('h5p-touch-move');
  });
};

/**
 * Initialize the slide selector.
 *
 * @param {H5P.jQuery} $slideination Wrapper.
 * @param {String} slideinationSlides HTML.
 * @returns {undefined} Nothing.
 */
H5P.CoursePresentation.prototype.initSlideination = function ($slideination, slideinationSlides) {
  var that = this;
  var $ol = $slideination.children('ol');
  var $left = $slideination.children('.h5p-scroll-left');
  var $right = $slideination.children('.h5p-scroll-right');
  var timer;

  // Slide selector
  this.$slideinationSlides = $ol.html(slideinationSlides).children('li').children('a').click(function () {
    that.jumpToSlide(H5P.jQuery(this).text() - 1);

    return false;
  }).end().end();
  this.$currentSlideinationSlide = this.$slideinationSlides.children('.h5p-current');

  var toggleScroll = function () {
    if ($ol.scrollLeft() === 0)  {
      // Disable left scroll
      $left.removeClass('h5p-scroll-enabled');
    }
    else {
      // Enable left scroll
      $left.addClass('h5p-scroll-enabled');
    }

    if ($ol.scrollLeft() + $ol.width() === $ol[0].scrollWidth)  {
      // Disable right scroll
      $right.removeClass('h5p-scroll-enabled');
    }
    else {
      // Enable right scroll
      $right.addClass('h5p-scroll-enabled');
    }
  };

  var disableClick = function () {
    return false;
  };

  var scrollLeft = function (event) {
    event.preventDefault();
    H5P.$body.mouseup(stopScroll).mouseleave(stopScroll).bind('touchend', stopScroll);

    timer = setInterval(function () {
      $ol.scrollLeft($ol.scrollLeft() - 1);
    }, 1);
  };

  var scrollRight = function (event) {
    event.preventDefault();
    H5P.$body.mouseup(stopScroll).mouseleave(stopScroll).bind('touchend', stopScroll);

    timer = setInterval(function () {
      $ol.scrollLeft($ol.scrollLeft() + 1);
    }, 1);
  };

  var stopScroll = function () {
    clearInterval(timer);
    H5P.$body.unbind('mouseup', stopScroll).unbind('mouseleave', stopScroll).unbind('touchend', stopScroll);
    toggleScroll();
  };

  // Scroll slide selector to the left
  $left.click(disableClick).mousedown(scrollLeft).bind('touchstart', scrollLeft);

  // Scroll slide selector to the right
  $right.click(disableClick).mousedown(scrollRight).bind('touchstart', scrollRight);

  toggleScroll();
};

/**
 * Switch to previous slide
 *
 * @param {Boolean} noScroll Skip UI scrolling.
 * @returns {Boolean} Indicates if the move was made.
 */
H5P.CoursePresentation.prototype.previousSlide = function (noScroll) {
  var $prev = this.$current.prev();
  if (!$prev.length) {
    return false;
  }

  return this.jumpToSlide($prev.index(), noScroll);
};

/**
 * Switch to next slide.
 *
 * @param {Boolean} noScroll Skip UI scrolling.
 * @returns {Boolean} Indicates if the move was made.
 */
H5P.CoursePresentation.prototype.nextSlide = function (noScroll) {
  var $next = this.$current.next();
  if (!$next.length) {
    return false;
  }

  return this.jumpToSlide($next.index(), noScroll);
};

/**
 * Jump to the given slide.
 *
 * @param {type} slideNumber The slide number to jump to.
 * @param {Boolean} noScroll Skip UI scrolling.
 * @returns {Boolean} Always true.
 */
H5P.CoursePresentation.prototype.jumpToSlide = function (slideNumber, noScroll) {
  var that = this;

  if (this.$current.hasClass('h5p-animate')) {
    return;
  }

  // Jump to given slide and enable animation.
  var $old = this.$current.addClass('h5p-animate');
  var $slides = that.$slidesWrapper.children();
  var $prevs = $slides.filter(':lt(' + slideNumber + ')');
  this.$current = $slides.eq(slideNumber).addClass('h5p-animate');

  setTimeout(function () {
    // Play animations
    $old.removeClass('h5p-current');
    $slides.css('left', '').removeClass('h5p-touch-move').removeClass('h5p-previous');
    $prevs.addClass('h5p-previous');
    that.$current.addClass('h5p-current');
  }, 1);

  setTimeout(function () {
    // Done animating
    that.$slidesWrapper.children().removeClass('h5p-animate');
  }, 250);

  // Jump keywords
  if (this.$keywords !== undefined) {
    this.$currentKeyword.removeClass('h5p-current');
    this.$currentKeyword = this.$keywords.children(':eq(' + slideNumber + ')').addClass('h5p-current');

    if (!noScroll) {
      this.scrollToKeywords();
    }
  }

  this.jumpSlideination(slideNumber, noScroll);

  // Show show solutions button on last slide
  if (slideNumber === this.slides.length - 1 && this.editor === undefined && this.slidesWithSolutions.length) {
    H5P.jQuery('.h5p-show-solutions', this.$container).show();
  }

  if (this.editor !== undefined) {
    // Update drag and drop menu bar container
    this.editor.dnb.setContainer(this.$current);
    if (this.editor.dnb.dnd.$coordinates !== undefined) {
      this.editor.dnb.dnd.$coordinates.remove();
    }
  }

  return true;
};

/**
 * Scroll to current keywords.
 *
 * @returns {undefined} Nothing
 */
H5P.CoursePresentation.prototype.scrollToKeywords = function () {
  var $parent = this.$currentKeyword.parent();
  var move = $parent.scrollTop() + this.$currentKeyword.position().top - 8;

  if (H5P.CoursePresentation.isiPad) {
    // scrollTop animations does not work well on ipad.
    // TODO: Check on iPhone.
    $parent.scrollTop(move);
  }
  else {
    $parent.stop().animate({scrollTop: move}, 250);
  }
};

/**
 * Jump slideination.
 *
 * @param {type} slideNumber
 * @param {type} noScroll
 * @returns {undefined}
 */
H5P.CoursePresentation.prototype.jumpSlideination = function (slideNumber, noScroll) {
  this.$currentSlideinationSlide.removeClass('h5p-current');
  this.$currentSlideinationSlide = this.$slideinationSlides.children(':eq(' + slideNumber + ')').addClass('h5p-current');

  if (!noScroll) {
    var $parent = this.$currentSlideinationSlide.parent();
    var move = this.$currentSlideinationSlide.position().left - ($parent.width() / 2) + (this.$currentSlideinationSlide.width() / 2) + 10 + $parent.scrollLeft();

    if (H5P.CoursePresentation.isiPad) {
      // scrollLeft animations does not work well on ipad.
      // TODO: Check on iPhone.
      $parent.scrollLeft(move);
    }
    else {
      $parent.stop().animate({scrollLeft: move}, 250);
    }
  }
};

/**
 * @type Boolean Indicate if this is an ipad user.
 */
H5P.CoursePresentation.isiPad = navigator.userAgent.match(/iPad/i) !== null;

/**
 * Create HTML for a slide.
 *
 * @param {object} slide Params.
 * @returns {String} HTML.
 */
H5P.CoursePresentation.createSlide = function (slide) {
  return '<div class="h5p-slide"' + (slide.background !== undefined ? ' style="background:' + slide.background + '"' : '') + '"></div>';
};

/**
 * Create html for a slideination slide.
 *
 * @param {int} index Optional
 * @param {String} title
 * @param {int} first Optional
 * @returns {String}
 */
H5P.CoursePresentation.createSlideinationSlide = function (index, title, first) {
  var html =  '<li class="h5p-slide-button';

  if (first !== undefined && first) {
    html += ' h5p-current';
  }
  html += '"><a href="#" title="' + title + '">';

  if (index !== undefined) {
    html += index;
  }

  return html + '</a></li>';
};

/**
 * Show solutions for all slides that have solutions
 *
 * @returns {undefined}
 */
H5P.CoursePresentation.prototype.showSolutions = function () {
  var jumpedToFirst = false;
  var slideScores = [];
  var hasScores = false;
  for (var i = 0; i < this.slidesWithSolutions.length; i++) {
    if (this.slidesWithSolutions[i] !== undefined) {
      this.$slideinationSlides.children(':eq(' + i + ')').addClass('h5p-has-solutions');
      if (!jumpedToFirst) {
        this.jumpToSlide(i, false);
        jumpedToFirst = true;
      }
      var slideScore = 0;
      var slideMaxScore = 0;
      for (var j = 0; j < this.slidesWithSolutions[i].length; j++) {
        var elementInstance = this.slidesWithSolutions[i][j];
        elementInstance.showSolutions();
        if (elementInstance.getMaxScore !== undefined) {
          slideMaxScore += elementInstance.getMaxScore();
          slideScore += elementInstance.getScore();
          hasScores = true;
        }
      }
      slideScores.push({
        slide: (i + 1),
        score: slideScore,
        maxScore: slideMaxScore
      });
    }
  }
  this.$container.find('.h5p-hidden-solution-btn').show();
  if (hasScores) {
    this.outputScoreStats(slideScores);
  }
};

H5P.CoursePresentation.prototype.outputScoreStats = function(slideScores) {
  var totalScore = 0;
  var totalMaxScore = 0;
  var tds = ''; // For saving the main table rows...
  for (var i = 0; i < slideScores.length; i++) {
    tds += '<tr><td class="h5p-td"><a href="#" class="h5p-slide-link" data-slide="' + slideScores[i].slide + '">' + this.l10n.slide + ' ' + slideScores[i].slide + '</a></td>'
            + '<td class="h5p-td">' + slideScores[i].score + '</td><td class="h5p-td">' + slideScores[i].maxScore + '</td></tr>';
    totalScore += slideScores[i].score;
    totalMaxScore += slideScores[i].maxScore;
  }
  var percentScore = Math.round(totalScore / totalMaxScore * 100);
  var scoreMessage = this.l10n.goodScore;
  if (percentScore < 80) {
    scoreMessage = this.l10n.okScore;
  }
  if (percentScore < 40) {
    scoreMessage = this.l10n.badScore;
  }
  var html = '' +
          '<div class="h5p-score-message">' + scoreMessage.replace('@percent', '<em>' + percentScore + ' %</em>') + '</div>' +
          '<table>' +
          '  <thead>' +
          '    <tr>' +
          '      <th class="h5p-th">' + this.l10n.slide + '</th>' +
          '      <th class="h5p-th">' + this.l10n.yourScore + '</th>' +
          '      <th class="h5p-th">' + this.l10n.maxScore + '</th>' +
          '    </tr>' +
          '  </thead>' +
          '  <tbody>' + tds + '</tbody>' +
          '  <tfoot>' +
          '    <tr>' +
          '      <td class="h5p-td">' + this.l10n.total + '</td>' +
          '      <td class="h5p-td">' + totalScore + '</td>' +
          '      <td class="h5p-td">' + totalMaxScore + '</td>' +
          '    </tr>' +
          '  </tfoot>' +
          '</table>';
  this.showPopup(html);
  var that = this;
  this.$container.find('.h5p-slide-link').click(function(event) {
    event.preventDefault();
    that.jumpToSlide(H5P.jQuery(this).data('slide') - 1);
    that.$container.find('.h5p-popup-overlay').remove();
  });
};
