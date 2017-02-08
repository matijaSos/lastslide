
$(document).ready(function() {

    var username = '';

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
    var jFail = $(this).find('.subscribe-fail');

    //var spinner = Ladda.create(jForm.find('button.submit')[0]);

    var submitEmail = function () {
      var inputElement = $('#signup-email-input');
      var errorMsgElement = $('#submit-email-form .error-msg');

      //jFail.text('').hide();
      //spinner.start();

      var email = jForm.find('#signup-email-input').val();
      console.log('email is: ' + email);

      if (!validateEmail(email)) {
        inputElement.addClass('error');
        //spinner.stop();
        return;
      }

      // Make request
      $.post('http://api.talkbook.co/subscribe/lastslide', {email: email, username: username})
        .done(function(data) {
          if (data && data.code === 200) {
            //showSubscriptionSuccessfulMessage();
            console.log('everything was successful');
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
          //spinner.stop();
        });
    };

    // -------------------- //

    // ---------- Claim username ------------ //

    $('#claim-username-input').on('keydown', function (event) {
      $(this).removeClass('error');
      $('#claim-username-form .error-msg').text('').hide();
    });

    $('.form-step-1').submit(function (event) {
      event.preventDefault();
      var inputElement = $('#claim-username-input');
      var errorMsgElement = $(this).find('.error-msg');

      console.log('error element step 1: ');
      console.log(errorMsgElement);
      
      username = inputElement.val();
      // Validate username.
      console.log(username);
      if (!validateUsername(username)) {
        console.log('username not valid! Must be alphanumeric');

        // Set error class
        inputElement.addClass('error');
        // Show error msg
        errorMsgElement.text('Alphanumeric characters only!').show();
      } else {
        // Write that username in html.
        $('#ls-username').text(username);
        goToNextStep();
      }
    });

    // ---------- Submit survey answer ------------ //
    
    $('#signup-form .option').off('click').on('click', function (event) {
      // Do something with $(this).text()
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
      // TODO(matija): go to next step only if everything is ok, call it from submitEmail method?
      //goToNextStep();
    });
});

