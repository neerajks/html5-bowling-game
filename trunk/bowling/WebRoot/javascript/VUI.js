var VUI = {
  showMainMessage: function(message) {
	$('main-message').style.display = 'block';
    $('main-message').innerHTML=message;
  },

  hideMainMessage: function() {
    $('main-message').style.display='none';
  },
  hideWaitWrapper: function() {
	    $('waiting-zone').style.display='none';
  },
  showWaitWrapper: function() {
	    $('waiting-zone').style.display='';
  },
  showPlayer1: function(message){
	  $('player1').innerHTML=message;
  },
  hidePlayer1: function(){
	  $('player1').style.display='none';
  },
  hidePlayer2: function(){
	  $('player2').style.display='none';
  },
  hidePlayer3: function(){
	  $('player3').style.display='none';
  },
  showPlayer2: function(message){
	  $('player2').innerHTML=message;
  },
  showPlayer3: function(message){
	  $('player3').innerHTML=message;
  },
  
  showWaitingMessage: function(message) {
    $('wait_user').innerHTML = message;
  },
 
  
  hideWaitingMessage: function() {
    $('wait_user').style.display='none';
  },
  
  refresh: function(){
	  
	  VUI.hidePlayer1();
	  VUI.hidePlayer2();
	  VUI.hidePlayer3();
	  if($('tr1')!=undefined) {
 		 room.deleteTd('tr1');}
 	  if($('tr2')!=undefined)
 		 room.deleteTd('tr2');
 	  if($('tr3')!=undefined)
 		 room.deleteTd('tr3');
 	  VUI.hideMainMessage();
 	  VUI.hideEndingWraper();
 	  VUI.hideWaitingMessage();
	  VUI.showWaitWrapper();
	  init.audio.stop(Bowling.Ball_BACKGROUND_MUSIC);
	  init.audio.play(Bowling.START_BACKGROUND_MUSIC,true);
  },
  
  showEndingWraper : function(){
		$('ending_wrapper').style.display='block';
  },
  
  hideEndingWraper: function(){
	  $('ending_wrapper').style.display='none';
  }, 
  showWinname: function(message,socre){
	  $('name').innerHTML = message+"("+socre+")的高分";
  }, 
  hideWinname: function(){
	  $('name').innerHTML = '';
  }, 
  showWinscore: function(){
	  $('winner').innerHTML = '赢得了比赛。 ';
  },
  hideWinscore: function(){
	  $('winner').innerHTML = '';
  }
}