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
  showScoreWraper: function() {
	    $('scores-wrapper').style.display='block';
  },
  hideScoreWraper: function(){
	    $('scores-wrapper').style.display='none';
 },
  showWaitingMessage: function(message) {
    $('wait_user').innerHTML = message;
  },
  showloginMessage: function(message){
	$('login').innerHTML = "玩家："+message+"已登陆！";
  },
  hideloginMessage: function(){
	$('login').innerHTML = '';
  },
  hideWaitingMessage: function() {
    $('wait_user').style.display='none';
  },
  
  refresh: function(){

	  if($('tr1')!=undefined) {
 		 room.deleteTd('tr1');}
 	  if($('tr2')!=undefined)
 		 room.deleteTd('tr2');
 	  if($('tr3')!=undefined)
 		 room.deleteTd('tr3');
 	  VUI.hideMainMessage();
 	  VUI.hideEndingWraper();
 	  VUI.showWaitingMessage("等待玩家进入...");
 	  $('login').innerHTML = '';
 	  VUI.hideScoreWraper();
	  VUI.showWaitWrapper();
	  VUI.sh
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