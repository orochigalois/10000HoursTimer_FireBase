// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js'


// Add Firebase products that you want to use
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js'
import { getDatabase, ref, set, get, child, update, remove } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js'



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYYS3ScbmSNxRW356FaSSkAdvpCiwRbDU",
  authDomain: "hourstimer-dad4b.firebaseapp.com",
  projectId: "hourstimer-dad4b",
  databaseURL: "https://hourstimer-dad4b-default-rtdb.firebaseio.com/",
  storageBucket: "hourstimer-dad4b.appspot.com",
  messagingSenderId: "1018547992856",
  appId: "1:1018547992856:web:941511b18478647bec466d",
  measurementId: "G-7PQT8ENKYE"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(firebaseApp);

var currentUID;
const db = getDatabase();

const auth = getAuth(firebaseApp);
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    currentUID = user.uid;


    //Get timer value
    const dbref = ref(db);

    var ss = 0, mm = 0, hh = 0;

    get(child(dbref, "users/" + currentUID)).then((snapshot) => {
      if (snapshot.exists()) {
        ss = snapshot.val().second;
        mm = snapshot.val().minute;
        hh = snapshot.val().hour;
      }
      $('.flipTimer').flipTimer({
        init_seconds: ss,
        init_minutes: mm,
        init_hours: hh,
        step: 1000
      });
  
      $("body").show();
    })
    




  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
(function ($) {

  /**
   * @class flipTimer
   * @constructor
   *
   * @param element {HTMLElement} the element flipTimer is called on
   */
  var flipTimer = function (element, options) {
    this.element = element;

    // ensures the HTMLElement has a class of 'flipTimer'
    if (!this.element.hasClass('flipTimer')) {
      this.element.addClass('flipTimer');
    }

    // attach users options to instance
    this.userOptions = options;

    // attach default options to instance
    this.defaultOptions = flipTimer.defaults;

    // merge default options with user options and attach to instance
    this.options = $.extend({}, this.defaultOptions, this.userOptions);

    // detects if the seconds digits should be used
    if (this.element.find('.seconds').length > 0) {
      this.options.seconds = this.element.find('.seconds')[0];
    }

    // detects if the minutes digits should be used
    if (this.element.find('.minutes').length > 0) {
      this.options.minutes = this.element.find('.minutes')[0];
    }

    // detects if the hours digits should be used
    if (this.element.find('.hours').length > 0) {
      this.options.hours = this.element.find('.hours')[0];
    }

    this.start();
  };

  flipTimer.defaults = {
    seconds: false,
    minutes: false,
    hours: false,
    init_seconds: 0,
    init_minutes: 0,
    init_hours: 0,
    step: 1000,
    digitTemplate: '' +
      '<div class="digit">' +
      '  <div class="digit-top">' +
      '    <span class="digit-wrap"></span>' +
      '  </div>' +
      '  <div class="shadow-top"></div>' +
      '  <div class="digit-bottom">' +
      '    <span class="digit-wrap"></span>' +
      '  </div>' +
      '  <div class="shadow-bottom"></div>' +
      '</div>'
  };

  flipTimer.prototype = {

    start: function () {
      this.seconds = this.options.init_seconds;
      this.minutes = this.options.init_minutes;
      this.hours = this.options.init_hours;
      // render the html for the plugin
      this.render();
    },

    /**
     * Dictates what needs rendering for the plugin
     *
     * @method render
     */
    render: function () {
      // if using seconds, populate it
      if (this.options.seconds) {
        this.renderDigits(this.options.seconds, this.seconds);
      }
      // if using minutes, populate it
      if (this.options.minutes) {
        this.renderDigits(this.options.minutes, this.minutes);
      }
      // if using hours, populate it
      if (this.options.hours) {
        this.renderDigits(this.options.hours, this.hours);
      }

      this.startTimer();
    },

    /**
     * Renders the digits for a given subject
     *
     * @method renderDigits
     * @param subject {HTMLElement} the element to generate digits for
     */
    renderDigits: function (subject, value) {
      var i, x, max, maxDigit, currentDigit, number_array, _this = this;
      // if digits are not already rendered...
      if ($(subject).find('.digit').length == 0) {
        // split the value into two individual digits

        number_array = String(value).split(""); // split all digits

        // ensure the set is at least 2 digits long
        if (number_array.length < 2) {
          number_array.unshift(0)
        }

        // hours have 5 digits
        if (subject == _this.options.hours) {
          while (number_array.length < 5) {
            number_array.unshift(0)
          }
        }


        // set maximum digits for seconds/minutes/hours
        if (subject == _this.options.seconds || subject == _this.options.minutes) {
          // minutes and seconds max digit
          maxDigit = 5;
        } else if (subject == _this.options.hours) {
          // hours max digit
          maxDigit = 9;
        } else {
          // everything else digit max
          maxDigit = 9;
        }

        // append a div for each digit
        number_array.forEach(function () {
          $(subject).append('<div class="digit-set"></div>');
        });

        // for each digit-set in the subject
        $(subject).find('.digit-set').each(function (el) {
          // if first digit, then use digit max
          max = (el == 0) ? maxDigit : 9;

          // generate the right number of digits
          for (i = 0; i <= max; i++) {
            // append the digit template
            $(this).append(_this.options.digitTemplate);



            // select the current digit and apply the number to it
            currentDigit = $(this).find('.digit')[i];
            $(currentDigit).find('.digit-wrap').append(i);

            // if the current number matches the value then apply active class
            if (i == number_array[el]) {
              $(currentDigit).addClass('active');
            } else if (number_array[el] != 0 && ((i + 1) == number_array[el])) {
              // if the current number is one less than active but not zero
              $(currentDigit).addClass('previous');
            } else if (number_array[el] == 0 && i == max) {
              // if the current number is zero then apply previous to max
              $(currentDigit).addClass('previous');
            }
          }
        });
      }
    },

    /**
     * Start a timer with an interval of 1 second
     *
     * @method startTimer
     */
    startTimer: function () {
      var _this = this;

      clearInterval(this.timer);
      this.timer = setInterval(function () {


        // increase/decrease seconds
        _this.seconds++;
        if (_this.options.seconds) _this.increaseDigit(_this.options.seconds);

        // increase/decrease minutes
        if (_this.seconds == 60) {

          _this.seconds = 0;
          _this.minutes++;

          if (_this.options.minutes) _this.increaseDigit(_this.options.minutes);
        }

        // increase/decrease hours
        if (_this.minutes == 60) {

          _this.minutes = 0;
          _this.hours++;

          if (_this.options.hours) _this.increaseDigit(_this.options.hours);
        }

        // save to local
        // localStorage.setItem("hours", _this.hours);
        // localStorage.setItem("minutes", _this.minutes);
        // localStorage.setItem("seconds", _this.seconds);

        set(ref(db, 'users/' + currentUID), {
          hour: _this.hours,
          minute: _this.minutes,
          second: _this.seconds
        })
          .then(() => {
            console.log("data stored - " + _this.hours + ":" + _this.minutes + ":" + _this.seconds);
          })
          .catch((error) => {
            console.log(error);
          })


      }, _this.options.step);
    },

    /**
     * Changes classes on the digits to increase the number
     *
     * @method increaseDigit
     * @param target {HTMLElement} the element to increase digit for
     */
    increaseDigit: function (target) {
      var digitSets = new Array(), _this = this;

      // find all digit-sets related to digit type
      $(target).find('.digit-set').each(function () {
        digitSets.push(this);
      });

      // increase individual digit
      increase(digitSets[digitSets.length - 1]);

      /**
       * Increases individual digit in a digit-set
       *
       * @param el {HTMLElement} the digit-set being increased
       */
      function increase(el) {
        var current = $(el).find('.active'),
          previous = $(el).find('.previous'),
          index = $.inArray(el, digitSets);

        previous.removeClass('previous');
        current.removeClass('active').addClass('previous');

        if (current.next().length == 0) {
          if (_this.options.direction == 'down'
            && target == _this.options.hours
            && (_this.hours == -1 || _this.hours == 23)
            && $(el).find('.digit').length == 10) {
            // if the hours digit reaches 0 it should make 24 active
            $($(el).find('.digit')[6]).addClass('active');
          } else {
            // increase to first digit in set
            $(el).find('.digit:first-child').addClass('active');
          }
          if (index != 0) {
            // increase digit of sibling digit-set
            increase(digitSets[index - 1]);
          }
        } else {
          current.next().addClass('active');
        }
      }
    }
  };

  $.fn.flipTimer = function (options) {
    return this.each(function () {
      if (!$(this).data('flipTimer')) {
        $(this).data('flipTimer', new flipTimer($(this), options));
      }
    });
  };
})(jQuery);