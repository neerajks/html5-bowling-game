var Client = {
  isPad: false,
  playerNumber: 1,
  playerName: '',
  
  init: function() {
    if (!this.checkSupport()) {
      // TODO: Show message of unsupported browser.
      return;
    }
    if (this.isPad) {
      $(document.body).css('background-image', 'url(images/bg_for_pad.jpg)');
    }
    this.registerEvents();
  },
  
  checkSupport: function() {
    var ua = navigator.userAgent;
    var iosBrowserPattern = /(iPad|iPhone|iPod).+OS\s\d/;
    var androidBrowserPattern = /Android\s(\d)/;
    var matchIos = iosBrowserPattern.exec(ua);
    var matchAndroid = androidBrowserPattern.exec(ua);
    if (matchIos && matchIos[1] == 'iPad' ||
        matchAndroid && matchAndroid[1] >= 3)
      this.isPad = true;
    return (matchIos || matchAndroid) &&
      (window.DeviceOrientationEvent || window.TouchEvent);
  },

  registerEvents: function() {
    var that = this;
    // Add login form submit event listener.
    $('#login-form').on('submit', function(e) {
      e.preventDefault();
      var username = $('#username').val();
      if (username) {
        // TODO: Do login request.
      } else {
        // TODO: Show empty user name message.
      }
      return false;
    });

    // Add click event listener for game mode selection button.s
    $('#game-mode').on('click', function(e) {
      var target = e.target;
      if (target.tagName == 'BUTTON') {
        var id = target.dataset['id'];
        that.handleGameMode(id);
      }
    });

    // Handle start game button click event.
    $('#start-button').on('click', function() {
      Connection.startGame();
      UI.hideStartGameTipMessage();
    });
  },

  /**
   * This function should be invoked from successful login response.
   */
  handleSuccessfulLogin: function(playerName, isFirstPlayer) {
    UI.hideLoginForm();
    UI.showGameInfo(playerName);
    // TODO: If the loged in player is the first one, show game mode
    // selection UI, otherwise show waiting others UI
    if (isFirstPlayer) {
      UI.showGameMode();
    } else {
      UI.showWaitingOthersMessage();
      UI.addPlayer(playerName);
    }
  },

  handleGameMode: function(modeId) {
    if (modeId == 1) {
      UI.showStartGameTipMessage();
    } else {
      UI.showWaitingOthersMessage();
    }
    UI.hideGameMode();
    this.playerNumber = modeId;
  },

  checkPlayerNumber: function(logedPlayerNumber) {
    if (logedPlayerNumber == this.playerNumber) {
      UI.hideWaitingOthersMessage();
      UI.showStartGameTipMessage();
    }
  },

  startGame: function() {
    
  }
};

Client.init();

const BALL_ANIMATION_DURING = 0.8; // in ms
const BALL_SIZE = 100;
var animationDuring;

function initBallPosition() {
  $('#ball').css('top', (window.innerHeight - BALL_SIZE) + 'px');
}

function setAnimationDuring() {
  var ball = document.getElementById('ball');
  var width = BALL_SIZE;
  var radius = width / 2;
  var circumference = 2 * Math.PI * radius;
  var speed = circumference / BALL_ANIMATION_DURING;
  var traceLength = window.innerHeight + width * 2;
  animationDuring = traceLength / speed;
//  setPropertyInStyleSheets('#ball', {
//    top: window.innerHeight + 'px',
//    '-webkit-transition-duration': animationDuring + 's, 0.1s'
//  }, 0);
//
//  setPropertyInStyleSheets('#ball.show', {
//    top: -BALL_WIDTH * 2 + 'px'
//  }, 0);
}

setAnimationDuring();
initBallPosition();
function throwBall() {
  $('#ball').addClass('show').css('top', '200px');
//  setTimeout(function() {
//    $('#ball').removeClass('show');
//  }, animationDuring * 1000)
}

function setPropertyInStyleSheets(selector, rules, styleSheetIndex) {
  var styleSheet;
  var styleSheets = document.styleSheets;
  if (styleSheetIndex) {
    styleSheet = styleSheets[styleSheetIndex];
  } else  {
    for (var i = 0, l = styleSheets.length; i < l; i++) {
      if(setPropertyInStyleSheet(styleSheets.item(i)))
        break;
    }
  }

  function setPropertyInStyleSheet(styleSheet) {
    var cssRules = styleSheet.cssRules;
    for (var i = 0, l = cssRules.length; i < l; i++) {
      var cssRule = cssRules.item(i);
      if (selector == cssRule.selectorText) {
        for (var prop in rules) {
          cssRule.style.setProperty(prop, rules[prop]);
        }
        return true;
      }
    }
    return false;
  }
}

setTimeout(function() {
  throwBall();
}, 2000);
