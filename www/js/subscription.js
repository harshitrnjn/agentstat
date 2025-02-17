function init() {

  // static/main.js
  console.log("Sanity check!");
  // Get Stripe publishable key
  const local_storage = localStorage;
  if (local_storage.session_id) {
    settings = get_settings_checkout("config/", "GET");
  } else {
    settings = window.location;
  }
  
  $.ajax(settings).done(function(response) {
    let data;
    try {
      data = JSON.parse(response);
    } catch {}
    const local_storage = localStorage;
    const session_id = local_storage.session_id;
    if (data) {
      const stripe = Stripe(data.publicKey);
    }

    let submitBtn = document.querySelector("#submitBtn");
    let cancelBtn = document.querySelector("#cancelBtn");
    let retrieveBtn = document.querySelector("#retrieveBtn");
    let loginBtn = document.querySelector("#loginBtn");
    let logoutBtn = document.querySelector('#logoutBtn');
    let closeBtn = document.querySelector('#closeBtn');
    let signUpBtn = document.querySelector('#signUp');

    if (submitBtn !== null) {

      submitBtn.addEventListener("click", () => {
        if (data) {
          settings = get_settings_checkout("retrieve-subscription/", "GET")
          $.ajax(settings).done(function(response) {
              subscription_data = JSON.parse(response);
              if (subscription_data['subscription'].length > 0) {
                $("#myModal").show();
              } 
              else {
                settings = get_settings_checkout("create-checkout-session/", "GET")
                $.ajax(settings).done(function(response) {
                    console.log("Data", data)
                    data_session = JSON.parse(response);
                    // Redirect to Stripe Chaeckout
                    const stripe = Stripe(data.publicKey);
                    console.log("stripe", stripe)
                    return stripe.redirectToCheckout({
                      sessionId: data_session.sessionId
                    })
                  })
                  .then((res) => {
                    console.log(res);
                  });
              }

            })
            .then((res) => {
              return res
            });
        } else {
          window.location.href = '/login.html'; // Redirect to /login
        }

      });
    }
    

    if (cancelBtn !== null) {
      cancelBtn.addEventListener("click", () => {
        // Get Checkout Session ID
        settings = get_settings_checkout("cancel-subscription/", "POST")
        $.ajax(settings).done(function(response) {
            data = response;
            alert(data);
          })
          .then((res) => {
            return res
          });
      });
    }

    if (closeBtn !== null) {
      closeBtn.addEventListener("click", () => {
        $("#myModal").hide();
      });
    }

    if (signUpBtn !== null) {
      signUpBtn.addEventListener("click", () => {
      window.location.href = '/login.html';
      });
    }

    if (retrieveBtn !== null) {
      retrieveBtn.addEventListener("click", () => {
        // Get Checkout Session ID
        console.log("Here for retrieving")
        settings = get_settings_checkout("retrieve-subscription/", "GET")
        $.ajax(settings).done(function(response) {
            subscription_data = JSON.parse(response);
            console.log("Subscription: ", subscription_data)
            if (subscription_data['subscription'].length > 0) {
              alert("Subscription already exists");
            } else {
              alert("No subsciptions");
            }

          })
          .then((res) => {
            return res
          });
      });
    }

    if (session_id) {
      console.log("Session Exists", session_id)
      loginBtn.style.display = "none";
      logoutBtn.addEventListener("click", () => {
        logout_session();

      });
    } else {
      console.log("Logged Out");
      logoutBtn.style.display = "none";
      loginBtn.addEventListener("click", () => {
        window.location.href = '/login.html'; // Redirect to /login
      });

    }

  });
}
window.addEventListener('DOMContentLoaded', init, false);