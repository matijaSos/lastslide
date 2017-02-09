
$(document).ready(function() {

    var username = '';
    var numSpeechesPerYear = '';
    var nextSpeechDate = '';

    var step = 1;
    function goToNextStep () {
      $('#signup-form').removeClass('step-' + step++).addClass('step-' + step);
    }

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    function validateUsername(username) {
      // Alphanumeric only.
      var re = /^([0-9]|[a-z])+([0-9a-z]+)$/i;
      return re.test(username);
    }

    var jForm = $(this).find('#submit-email-form');
    var spinner = $('#signup-button').ladda();
    var claimUsernameSpinner = $('#claim-username-button').ladda();

    var submitEmail = function () {
      var inputElement = $('#signup-email-input');
      var errorMsgElement = $('#submit-email-form .error-msg');

      spinner.ladda('start');

      var email = jForm.find('#signup-email-input').val();

      if (!validateEmail(email)) {
        inputElement.addClass('error');
        spinner.ladda('stop');
        return;
      }

      // Make request
      $.post('http://api.talkbook.co/subscribe/lastslide', 
        {
            email: email, 
            username: username,
            numSpeechesPerYear: numSpeechesPerYear,
            nextSpeechDate: nextSpeechDate
        })
        .done(function(data) {
          if (data && data.code === 200) {
            goToNextStep();
          } else {
            if (data && data.error && data.error.title && data.error.title.indexOf('Member Exists') !== -1) {
              errorMsgElement.text('Email already used!').show();
            } else {
              // Something is wrong, but not 'member exists'. Output error message?
              errorMsgElement.text('Error occurred, please try again').show();
            }
          }
        })
        .fail(function() {
          // Did not get response from server.
          errorMsgElement.text('Error occurred, please try again').show();
        })
        .always(function() {
          spinner.ladda('stop');
        });
    };

    // -------------------- //

    // ---------- Claim username ------------ //

    $('#claim-username-input').on('keydown', function (event) {
      $(this).removeClass('error');
      $('#claim-username-form .error-msg').text('').hide();
    });

    $('#claim-username-form').submit(function (event) {
      event.preventDefault();
      var inputElement = $('#claim-username-input');
      var errorMsgElement = $(this).find('.error-msg');

      username = inputElement.val();
      // Validate username.
      if (!validateUsername(username)) {
        inputElement.addClass('error');
        errorMsgElement.text('Alphanumeric characters only!').show();
      } else {

        claimUsernameSpinner.ladda('start');
        // Check if username is available.
        $.get('http://api.talkbook.co/lastslide/username/' + username + '/exists')
          .done(function(response){
            if (response.data === false) {
              // Write that username in html.
              $('.ls-username').text(username);
              goToNextStep();
            } else {
              errorMsgElement.text('Username already taken!').show();
            }
          })
          .fail(function() {
            errorMsgElement.text('Error occurred, please try again').show();
          })
          .always(function() {
            claimUsernameSpinner.ladda('stop');
          });
      }
    });

    // ---------- Submit survey answer ------------ //
    
    $('#signup-form #how-many-pres-form .option').off('click').on('click', function (event) {
      numSpeechesPerYear = $(this).text();
      goToNextStep();
    });

    $('#signup-form #when-next-pres-form .option').off('click').on('click', function (event) {
      nextSpeechDate = $(this).text();
      goToNextStep();
    });

    // ---------- Submit email ------------ //

    $('#signup-email-input').on('keydown', function (event) {
      $(this).removeClass('error');
      $('#submit-email-form .error-msg').text('').hide();
    });

    $('#submit-email-form').submit(function (event) {
      event.preventDefault();
      submitEmail();
    });

    // ----------- Smooth scrolling ---------- //
    $('#hero nav a').smoothScroll();
    $('#get-started-button, #learn-more').smoothScroll();
    $('#footer-section nav a').smoothScroll();

});

