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

var ballSize = 80;
var throwBallTimer;
var isPad = false;
var ballTargetTop = 200;

function checkSupport() {
  var ua = navigator.userAgent;
  var iosBrowserPattern = /(iPad|iPhone|iPod).+OS\s\d/;
  var androidBrowserPattern = /Android\s(\d)/;
  var matchIos = iosBrowserPattern.exec(ua);
  var matchAndroid = androidBrowserPattern.exec(ua);
  if (matchIos && matchIos[1] == 'iPad' ||
      matchAndroid && matchAndroid[1] >= 3)
    isPad = true;
  return (matchIos || matchAndroid) &&
    (window.DeviceOrientationEvent || window.TouchEvent);
}

if (!this.checkSupport()) {
  throw new Error();
}
if (isPad) {
  $.addStyleSheet('css/client_for_pad.css');
  ballTargetTop = 450;
  ballSize = 150;
}

function initBallPosition() {
  $('#ball').css('top', (document.documentElement.scrollHeight - ballSize) + 'px');
}
initBallPosition();
function throwBall() {
  clearTimeout(throwBallTimer);
  $('#ball').show();
  setTimeout(function() {
    $('#ball').addClass('show').css('top', ballTargetTop + 'px');
  }, 0);
  
  throwBallTimer = setTimeout(function() {
    $('#ball').hide().removeClass('show');
    initBallPosition();
  }, 3000)
}
