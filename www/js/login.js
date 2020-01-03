function login() {
  var data = {};
  data['email'] = $('#email').val()
  data['password'] = $('#password').val()
  console.log(data);

  settings = get_settings('login/', 'POST', JSON.stringify(data))
  settings['headers'] = {};
  console.log(settings);

  $.ajax(settings).done(function (response) {
    var msg = JSON.parse(response);
    console.log(msg);
    console.log(msg['token']);
    localStorage.session_id = msg['token'];
    window.location = '/form.html';
  }).fail(function(err) {
    // alert('Got err');
    $('.msg').html(err['responseText']);
    $('.msg').css("display", "block");
    console.log(err);
  });
}

$(document).on('change click', '#login-btn', function() {
  login();
});

$(document).on('change click', '#forgot-password', function() {
  email = $('#email').val();
  console.log(email);

  if(email === '' || email === null) {
    $('.msg').html('Email is required.');
    $('.msg').css("display", "block");
  } else {
    var data = {};
    data['email'] = $('#email').val();
    settings = get_settings('forgot-password/', 'POST', JSON.stringify(data));

    $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      console.log(msg);
      $('.msg').html("Email has been sent.");
      $('.msg').css("display", "block");
      // window.location = '/form.html';
    }).fail(function(err) {
      // alert('Got err');
      $('.msg').html(err['responseText']);
      $('.msg').css("display", "block");
      console.log(err);
    });
    console.log('api call');
  }

});
