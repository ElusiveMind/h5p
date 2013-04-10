var H5P = H5P || {};

H5P.Flashcards = function (options, contentId) {
  var panel;
  var target;
  var $ = H5P.jQuery;

  if ( !(this instanceof H5P.Flashcards) ){
    return new H5P.Flashcards(options, contentId);
  }

  var cp = H5P.getContentPath(contentId);

  var getScore = function(){
    var score = 0;
    panel.find('.input').each(function (idx, el) {
      var i = parseInt(el.id.replace(/^.*-/,''));
      var correct_answer = options.questions[i].answer.toLowerCase();
      var answer_given = $(el).val().trim().toLowerCase();
      score += correct_answer == answer_given ? 1 : 0;
    });
    return score;
  }

  var getAnswerGiven = function(){
    var answers = 0;
    panel.find('.input').each(function (idx, el) {
      var i = parseInt(el.id.replace(/^.*-/,''));
      answer_given = $(el).val().trim().toLowerCase();
      if(answer_given != ''){
        answers++;
      }
    });
    return totalScore() == answers;
  };

  var focusElement = function(el){
    var i = Math.round(-parseInt(el.css('left')) / parseInt(el.css('width')));
    $('#'+panel.attr('id')+'-input-'+i).focus();
  }

  var totalScore = function(){
    var score = 0;
    panel.find('.input').each(function (idx, el) {
      score++;
    });
    return score;
  };

  var showScore = function(){
    var i = Math.round(-parseInt($('#flashcards').css('left')) / parseInt($('#flashcards').css('width')));
    $('#'+panel.attr('id')+'-fasit-'+i).fadeIn('slow');

    var answer_given = $('#'+panel.attr('id')+'-input-'+i).val().trim().toLowerCase();
    if(options.questions[i].answer.toLowerCase() == answer_given) {
      $('#'+panel.attr('id')+'-input-'+i).parent().removeClass('wrong-answer');
      $('#'+panel.attr('id')+'-input-'+i).parent().addClass('correct-answer');
    }
    else {
      $('#'+panel.attr('id')+'-input-'+i).parent().removeClass('correct-answer');
      $('#'+panel.attr('id')+'-input-'+i).parent().addClass('wrong-answer');
    }

    // TODO: Remove confirmations
    console.log("total " + totalScore());
    console.log("score " + getScore());
    console.log("given " + (getAnswerGiven() ? "true" : "false"));
  }

  function addElement(container, id, className, el) {
    var text = el.text ? el.text : '';
    var $el = $('<div class="'+className+'">'+text+'</div>');
    container.append($el);
    if(el.top) {
      $el.css({ top: el.top});
    }
    if(el.left) {
      $el.css({ left: el.left});
    }
    if(el.right) {
      $el.css({ right: el.right});
    }
    if(el.bottom) {
      $el.css({ bottom: el.bottom});
    }
    if(id) {
      $el.attr('id', id);
    }
    if(el.height) {
      $el.css({ height: el.height });
    }
    if(el.width) {
      $el.css({ width: el.width });
    }
    if(el.click) {
      $el.click(el.click);
    }
    return $el;
  }

  var hideAnswer = function () {
    answer_panel.animate({
      top: -parseInt(panel.css('height'))
    }, 'slow');
  }

  var attach = function (el) {
    target = $(el);
    target.addClass('flashcard');
    panel = addElement(target, 'panel-'+target.attr('data-content-id'), 'panel', { });
    addElement(panel, null, 'flashcard-title', { text: options.title });
    addElement(panel, null, 'flashcard-description', { text: options.description });

    // Panel setup
    var questions = addElement(panel, null, 'flashcard-inner-panel', { });
    var flashcards = addElement(questions, 'flashcards', 'flashcards', { });
    var navigation = addElement(questions, 'navigation', 'navigation', { });

    var prev = addElement(navigation, 'previous-flashcard', 'flashcard-navigation-button', {
      text: options.previous,
      click: function() {
        flashcards.animate({
          left: '+='+flashcards.css('width'),
          complete: function(){
          }
        }, 'fast', 'swing', function() {
          if(flashcards.css('left') == '0px'){
            prev.css({display: 'none'});
          }
          focusElement(flashcards);
        });
        $('#next-flashcard').css({display: 'block'});
      }
    });

    var next = addElement(navigation, 'next-flashcard', 'flashcard-navigation-button', {
      text: options.next,
      click: function() {
        flashcards.animate({
          left: '-='+flashcards.css('width')
        }, 'fast', 'swing', function() {
          var length = options.questions.length * parseInt(flashcards.css('width')) - parseInt(flashcards.css('width'));
          if(-parseInt(flashcards.css('left')) == length) {
            next.css({display: 'none'});
          }
          focusElement(flashcards);
        });
        $('#previous-flashcard').css({display: 'block'});
      }
    });

    // Add questions
    for(var i=0; i < options.questions.length; i++) {
      var question = addElement(flashcards, panel.attr('id')+'-question-'+i, 'flashcard-question', { left: i * parseInt(questions.css('width'))});
      if(options.questions[i].image) {
        addElement(question, null, 'flashcard-image', { text: '<img src="'+cp+options.questions[i].image.path+'"/>' });
        // question.css({ background: 'url('+cp+options.questions[i].image.path+') no-repeat center 0px' });
      }
      if(options.questions[i].text) {
        addElement(question, panel.attr('id')+'-question-'+i, 'flashcard-text', { text: options.questions[i].text });
      }
      var input_container = addElement(question, null, 'input-container', { });
      addElement(input_container, panel.attr('id')+'-fasit-'+i, 'fasit-container', { text: '<span class="fasit">'+options.questions[i].answer+'</span>' });
      addElement(input_container, null, 'flashcard-label', { text: 'Oppgave ' + (i+1) + ' av ' + options.questions.length });
      if(options.questions[i].answer) {
        // input_container.html('<span><input id="'+panel.attr('id')+'-input-'+i+'" class="input" type="text"/></span>');
        addElement(input_container, null, 'flashcard-navigation-button flashcard-show-answer', { click: showScore, text: options.score });
        addElement(input_container, null, 'flashcard-input', { text: '<input id="'+panel.attr('id')+'-input-'+i+'" class="input" type="text"/>' });
      }
    }

    $('#'+panel.attr('id')+'-input-0').focus();

    return this;
  };

  var returnObject = {
    attach: attach,
    machineName: 'H5P.Flashcards',
    getScore: getScore,
    getAnswerGiven: getAnswerGiven,
    totalScore: totalScore
  };

  return returnObject;
};
