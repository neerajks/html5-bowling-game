
function $F() {
    return document.getElementById(arguments[0]).value;
}
function xhr(method, uri, body, handler) {
    var req = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    req.onreadystatechange = function() {
        if (req.readyState == 4 && handler) {
        	if (req.status == 200) {
        	    var result = JSON.parse(req.responseText);
                handler(result);
            } else {
            	 document.location.href = document.location.toString();
            }
        } 
    }
    req.open(method, uri, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send(body);
}
var isPad = false;
var isTouchEvent = false;
var room = {
    login: function() {
        room.username = $F('username');
        var jsonpoll = {};
        jsonpoll["username"] = room.username;
        if(room.isUserNameNull() == false) {
          var encoded_check = JSON.stringify(jsonpoll);
          xhr('POST', 'bajax/login', encoded_check, room.loginCallback);
		}
    },
	
	loginCallback : function(m) {
	  /*
	 BECOME_MASTER(0),
    WAITING_FOR_MASTER(1),
    JOINED_GAME(2),
    Full_GAME(3),
    WAITING_FOR_OTHERS(4),
    WAITING_THROWING(5),
    THROWING_BALL(6),
    WAITING_FOR_SCORE(7),
    NA_STATE(8);
	  */
	  if (m.status == "0") { 
	    UI.hideLoginForm();
        UI.showGameMode();
	  } else if (m.status == "1") {
     	UI.hideLoginForm(); 
		UI.showMainMessage('游戏正在创建，稍后登陆！',isPad);
		setTimeout(room.login, 500);
	  } else if (m.status == "2") {
	    UI.hideMainMessage();
	    UI.hideGameMode();
		UI.hideLoginForm();
		UI.showWaitingOthersMessage();
        room.order = m.order;
        room.score = m.score;
		// n frame
		room.total = m.total;
		room.status = "4";
		room.isThrowingBall = m.isThrowingBall;		
		setTimeout(room.checkuserstatus, 500);
	  } else if (m.status == "3") {
		UI.hideLoginForm();
		UI.showMainMessage('游戏人数已满，请等候下一局！',isPad);
	  } else if (m.status == "8") {
	    UI.hideLoginForm();
	    UI.showMainMessage('服务器未连接，请重新刷新页面！',isPad);
	  }
	},
	
    checkuserstatus: function(result) {
	  /*WAITING_FOR_OTHERS(4),
      WAITING_THROWING(5),
      THROWING_BALL(6);
	  GAME_END(9)*/
	  if (result) {
	    room.status = result.status;
		if (result.order) {
		  room.order = result.order;
		}
	  }
	  
	  var jsonpoll = {};
	  if (room.status == "4") {
        jsonpoll["status"] = "4";
        jsonpoll["order"] = room.order;    
	    UI.hideGameMode();
		UI.showWaitingOthersMessage();
	  } else if (room.status == "5") {
	    UI.hideWaitingOthersMessage();
		UI.hideGameMode();
		UI.showMainMessage("其他玩家正在抛球，请您等候",isPad);
        jsonpoll["status"] = "5";
        jsonpoll["order"] = room.order;    		
	  } else if (room.status == "6") {
		room.throwFlag=true;
	    UI.hideGameMode();
	    UI.hideWaitingOthersMessage();
		UI.showMainMessage(room.notice,isPad);
	    return;
	  } else if (room.status == "8") {
	    UI.hideGameMode();
	    UI.hideWaitingOthersMessage();
		UI.showMainMessage('服务器未连接，请重新刷新页面！',isPad);
		return;
	  } else if (room.status == "9") {
	    jsonpoll["status"] = "9";
		jsonpoll["order"] = room.order;  
	  } else if (room.status == "10") {
	    var result = room.overallresult;
	    UI.hideMainMessage();
	    UI.showGameResult(result);
		room.resetGame();
		return;
	  }
	  var encoded_check = JSON.stringify(jsonpoll);
	  if (encoded_check != "{}") {
		  
		  xhr('POST', 'bajax/check', encoded_check, function(result) {
			  if (result) {
				room.status = result.status;
				room.overallresult = result.overallresult;
			  }
			  setTimeout(room.checkuserstatus, 500);
			 });
	  }
		  //setTimeout(room.checkuserstatus, 500);
    },
	
	resetGame : function() {
	  var jsonpoll = {};
	  jsonpoll.order = room.order;
	  var encoded_check = JSON.stringify(jsonpoll);
	  xhr('POST', 'bajax/resetgame', encoded_check, function(result) {
	    //console.log(result);
	  });
	  
	},
	initgame: function() {
       document.location.href = document.location.toString();
    },
	send: function() {
	  if (!room.isSending) 
	    room.isSending = false;
	  
	  if (room.status == 6) {
		  if (room.isSending == false) {
			room.isSending = true;
			var jsonpoll = {};
			jsonpoll["order"] = room.order;
			jsonpoll["status"] = "6";
			jsonpoll["ax"] = room.ay;
			jsonpoll["ay"] = room.ax;
			var encoded_check = JSON.stringify(jsonpoll);
			xhr('POST', 'bajax/poll', encoded_check, room.waitForScore);
		  }
	  }
    },
	
	waitForScore: function(result) {
	  /*
	     BECOME_MASTER(0),
    WAITING_FOR_MASTER(1),
    JOINED_GAME(2),
    Full_GAME(3),
    WAITING_FOR_OTHERS(4),
    WAITING_THROWING(5),
    THROWING_BALL(6),
    WAITING_FOR_SCORE(7),
	NA_STATE(8);*/
	  if (result && result.status) {
	    room.status = result.status;
	  }
	  //console.log(room.status);
	  if (room.status == "7") {
		throwBall();
        var jsonpoll = {};
        jsonpoll["order"] = room.order;
	    jsonpoll["status"] = "7";
        var encoded_check = JSON.stringify(jsonpoll);
		setTimeout( function() {
          xhr('POST', 'bajax/poll', encoded_check, room.waitForScore);
		}, 500);
	  } else if (room.status == "5") {
	    //console.log(result.currentframe);
		//console.log(result.totalscore);
	    $('#current-inning-score').html(result.currentframe);
        $('#total-score').html(result.totalscore);
        UI.showScoreInfo();
        UI.showGameInfo(room.username);
		room.isSending = false;
		//console.log(result.currentframe);
		//console.log(result.rounds);
	    if (result.currentframe != result.rounds) {
		  setTimeout(room.checkuserstatus, 500);
		} else {
		   room.status = "9";
		   UI.showMainMessage('本局结束，请等待最后结果，感谢您的参与！',isPad);
		   setTimeout(room.checkuserstatus, 500);
		}
	  } else if (room.status == "8") { 
	    UI.hideSocreInfo();
		UI.hideMainMessage();
		UI.showMainMessage('服务器未连接，请重新刷新页面！',isPad);
	  } 
	},
	
    choicejoinnumber: function(e) {
        var choicenumber = {};
        choicenumber["username"] = room.username;
        /*choicenumber["login_id"] = room.login_id;
        choicenumber["status"] = room.status;
        choicenumber["order"] = room.order;*/
        choicenumber["choicenumber"] = e.getAttribute('data-id');
        encoded_check = JSON.stringify(choicenumber);
        xhr('POST', 'bajax/chooseplayersnumber', encoded_check, room.checkuserstatus);
    },
	
    isUserNameNull:function(){
    	var username=$('#username').val();
    	if(username==null || username.length==0){
    	  $("#username").attr("placeholder" ,"名字不能为空");
		  //$("#username").css("color", "red");
    		//window.setTimeout(UI.hideMainMessage(), 2000);
    	  return true;
    	}else{
    		return false;
    	}
    }
}

function init() {
    //room.checkuserstatus();
    registerThrowEvent();
    if(room.username!=undefined){
    	room.close();
    }
}

function registerThrowEvent() {
    if (window.DeviceOrientationEvent) {
        var starttime = 0;
        var endtime = 0;
        var maxangle = -Infinity;
        var minangle = Infinity;
        var xangle;
        var az;
        
        window.addEventListener('deviceorientation',
        function(e) {
			var beta = e.beta;
			//room.notice = '请晃动您的平板！';
			if (beta < minangle) {
				minangle = beta;
				starttime = new Date().getTime();
			}
			
			if (beta > maxangle) {
				maxangle = beta;
				endtime = new Date().getTime();
			}

			if (maxangle && minangle && maxangle >= 0 && maxangle - minangle > 93) {
				room.ay = az * (Math.abs(endtime - starttime) / 1000);
				room.ax = xangle;
				console.log(room.ax+"----"+room.ay);
				if(room.throwFlag){
					room.throwFlag = false;
					room.send();
					throwBall();
				}
				maxangle = -Infinity;
				minangle = Infinity;
			}
            
        },
        false);

        window.addEventListener('devicemotion',
        function(e) {
            var aig = event.accelerationIncludingGravity;
            az = aig.z;
            xangle = Math.atan(aig.x / aig.z);
        },
        false);
    } else if (window.TouchEvent) {
        this.throwMode = 'touch';
        var startClientX;
        var startClientY;
        var MIN_TOUCH_LENGTH = 100; // in pixel
        var startTime;
        room.notice = '请滑动屏幕！';
        isTouchEvent=true;
        document.addEventListener('touchmove',
        function(e) {
            var touches = e.touches.item(0);
            if (!startClientX) startClientX = touches.clientX;
            if (!startClientY) startClientY = touches.clientY;

            startTime = new Date().getTime();
        },
        false);

        document.addEventListener('touchend',
        function(e) {
           
            var touches = e.changedTouches.item(0);
            var endClientX = touches.clientX;
			var endClientY = touches.clientY;
			var xMoved = endClientX - startClientX;
			var yMoved = endClientY - startClientY;
			if (Math.abs(xMoved) >= MIN_TOUCH_LENGTH || Math.abs(yMoved) >= MIN_TOUCH_LENGTH || Math.sqrt(xMoved * xMoved + yMoved * yMoved) >= MIN_TOUCH_LENGTH) {
				var time = new Date().getTime() - startTime;
				//room.ay=xMoved/time;
				room.ay = yMoved / time;
				room.ax = Math.asin(xMoved / yMoved);
				//alert(1);
				if(room.throwFlag){
					room.throwFlag = false;
					room.send();
					throwBall();
				}
				startClientY = null;
				startClientX = null;
            }
            
        },
        false);
    }
}

var ballSize = 80;
var throwBallTimer;

var ballTargetTop = 200;

function checkSupport() {
    var ua = navigator.userAgent;
    var iosBrowserPattern = /(iPad|iPod).+OS\s\d/;
    var iphoneBrowserPatern=/(iPhone).+OS\s\d/;
    var androidBrowserPattern = /Android\s(\d)/;
    var matchIos = iosBrowserPattern.exec(ua);
    var matchiphone=iphoneBrowserPatern.exec(ua);
    var matchAndroid = androidBrowserPattern.exec(ua);
    if (matchIos && matchIos[1] == 'iPad' || matchAndroid && matchAndroid[1] >= 3){ 
    	isPad = true;room.notice='请晃动您的平板！';
    }else if(/(iPhone|iPad|iPod)/i.test(ua)){
    	isPad=true;
    	room.notice='请晃动您的手机！';
    }
    return (matchIos || matchAndroid) && (window.DeviceOrientationEvent || window.TouchEvent);
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
    },
    0);

    throwBallTimer = setTimeout(function() {
        $('#ball').hide().removeClass('show');
        initBallPosition();
    },
    3000)
}
