var UI = {
  showLoginForm: function() {
    $('#login').show();
  },
  
  hideLoginForm: function() {
    $('#login').hide();
  },

  showGameMode: function() {
    $('#game-mode').show();
  },

  hideGameMode: function() {
    $('#game-mode').hide();
  },

  showWaitingOthersMessage: function() {
    $('#waiting-others-message').show();
  },
  
  hideWaitingOthersMessage: function() {
    $('#waiting-others-message').hide();
  },
  
  addPlayer: function(name) {
    var li = document.createElement('li');
    var html = '玩友<strong>' + name + '</strong>已进入...';
    $(li).html(html);
    $('#waiting-others-message').append(li);
  },

  showStartGameTipMessage: function() {
    $('#start-game-tip-message').show();
  },

  hideStartGameTipMessage: function() {
    $('#start-game-tip-message').hide();
  },

  showMainMessage: function(message) {
    $('#main-message').show().text(message);
  },

  hideMainMessage: function() {
    $('#main-message').hide();
  },

  showGameInfo: function(playerName) {
    $('#game-info').show();
    $('#player-name').text(playerName).attr('title', playerName);
  },
  
  hideGameInfo: function() {
    $('#game-info').hide();
  },

  showScoreInfo: function() {
    $('#score-info').show();
  },

  hideSocreInfo: function() {
    $('#score-info').hide();
  },

  /**
   * Set current inning score and total score.
   * @param {Number} score
   */
  setScore: function(score) {
    $('#current-inning-score').text(score);
    var totalScore = parseInt($('#total-score').text()) + score;
    $('#total-score').text(totalScore)
  }
};