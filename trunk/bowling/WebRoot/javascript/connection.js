var Connection ={
  /**
   * Init web socket or ajax connection etc.
   */
  init: function() {},

  /**
   * Register connection event listener.
   */
  registerEvents: function() {
    // Successful login response:
    var otherPlayers = ['John', 'Kevin'];
  },

  /**
   * Send login request to server.
   */
  login: function() {},

  /**
   * Tell server the current round's player number, so that
   * server can reject new extra connection.
   */
  setPlayerNumber: function(number) {},

  /**
   * Tell server to broatcast message of game start.
   */
  startGame: function() {
    Client.startGame();
  }
};