
$(document).ready(function() {

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    var jForm = $(this).find('.form-step-2');
    var jFail = $(this).find('.subscribe-fail');

    //var spinner = Ladda.create(jForm.find('button.submit')[0]);

    var submitEmail = function () {
      jFail.text('').hide();
      //spinner.start();

      var email = jForm.find('#signup-email-input').val();
      console.log('email is: ' + email);

      if (!validateEmail(email)) {
        jFail.text('Please enter valid email address').show();
        //spinner.stop();
        return;
      }

      // Make request
      $.post('http://api.talkbook.co/subscribe/lastslide', {email: email})
        .done(function(data) {
          if (data && data.code === 200) {
            //showSubscriptionSuccessfulMessage();
            console.log('everything was successful');
          } else {
            if (data && data.error && data.error.title && data.error.title.indexOf('Member Exists') !== -1) {
              jFail.text('You have already signed up!').show();
            } else {
              // Something is wrong, but not 'member exists'. Output error message?
              jFail.text('Something is wrong').show();
            }
          }
        })
        .fail(function() {
          // Did not get response from server.
          jFail.text('There was an error, please try again.').show();
        })
        .always(function() {
          //spinner.stop();
        });
    };

    $('.form-step-2').submit(function (event) {
      submitEmail();
      event.preventDefault();
    });
});

