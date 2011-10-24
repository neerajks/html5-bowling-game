if (!window.WebSocket && window.MozWebSocket) window.WebSocket = window.MozWebSocket;
if (!window.WebSocket) alert("WebSocket not supported by this browser");

function $() {
    return document.getElementById(arguments[0]);
}
function $F() {
    return document.getElementById(arguments[0]).value;
}

function getKeyCode(ev) {
    if (window.event) return window.event.keyCode;
    return ev.keyCode;
}

var room = {
    join: function() {

        var urls = document.location.toString().replace('http://', 'ws://').replace('https://', 'wss://');
        var location = urls.substring(0, urls.indexOf("bowlingsvn")) + "bowlingsvn/bajax/";
        this._ws = new WebSocket(location, "bajax");
        this._ws.onopen = this._onopen;
        this._ws.onmessage = this._onmessage;
        this._ws.onclose = this._onclose;
    },

    _onopen: function() {
        room._send('connect');
    },

    _send: function(message) {

        if (this._ws) this._ws.send(message);
    },
	/*    
	  NO_ONE_JOIN(0),
      WAITING_FOR_PLAYERS(1),
      WAITING_FOR_MOBILE(2),
      THROWING_BALL(3);*/
    _onmessage: function(m) {
	
        if ('connect' != m.data) {
            var result = JSON.parse(m.data);
			
			if (result.status == 1) {
			  var username = result.username;
			  var numbercount = result.numbercount;
			  var joinnumber = result.joinnumber;
			  room.order = joinnumber;
			  var lacknumber = numbercount - joinnumber;
			  VUI.showWaitingMessage(username + "参与了" + numbercount +"人游戏，还缺" + lacknumber + "人");
			  room.setThInfors(result.scorearray.length, 'th_infors');
			  room.setscore(username, result.scorearray, result.totalscore, 'tr' + joinnumber);
			} else if (result.status == 2) {
			  VUI.hideWaitWrapper();
			  var joinnumber = result.joinnumber;
			  room.order = joinnumber;
			  room.setThInfors(result.scorearray.length, 'th_infors');
			  var username = result.username;
			  room.setscore(username, result.scorearray, result.totalscore, 'tr' + joinnumber);
			  
			  var currrentusername = result.currrentusername;
			  VUI.showMainMessage(currrentusername + "正在扔球，其他玩家请等候...");
			  room.trAddCss(joinnumber);
			} else if (result.status == 3) {
			  VUI.hideMainMessage();
			  var ax = result.ax;
			  var ay = result.ay;
			  room.order = result.order;
			  room.current_frame = result.currentframe;
			  room.current_username = result.currentusername; 
			  room.next_username = result.nextusername;
			  Bowling.KickOneFrame(ax, ay, function(score) {
			    var jsonBody = {};
				jsonBody["order"] = room.order;
				jsonBody["score"] = score;
				var current_frame = room.current_frame;
				var next_username = room.next_username;
                var encoded_check = JSON.stringify(jsonBody);
				room.setScoreByFrameAndOrder(room.order, score, current_frame);
				VUI.showMainMessage(next_username + "正在扔球，其他玩家请等候..."); 
				room.trAddCss(room.order);
			    room._send(encoded_check);
			  });
			} else if (result.status == 4){
			   VUI.hideMainMessage();
			   VUI.showWinname(result.winer[0]);
			   VUI.showWinscore(result.winer[1]);
			   VUI.showEndingWraper();
			   window.setTimeout(VUI.refresh,10000);

			}
        }
    },
    setThInfors:function(total,id){
    	 var tdnode = $(id).childNodes.length;
    	if(total!=undefined && tdnode==1){
    		var x = $(id).insertCell(0);
            x.innerHTML = '总分';
            for (var i = total; i >= 1; --i){
                var y = $(id).insertCell(0);
                y.innerHTML = i;
            }
            var z = $(id).insertCell(0);
            z.innerHTML = '玩家';
    	}
    },
	
	setScoreByFrameAndOrder : function(order, score, current_frame) {
	  var scores = $('scores');
	  console.log("room.order:" + order);
	  console.log("score:" + score);
	  console.log("current_frame:" + current_frame);
	  
	  var id = "tr" + order;
	 // var totalsocre=
	  var td = document.querySelector("#" + id + " > td:nth-child(" + (current_frame+2) + ")");
	  td.innerHTML = score;
	},
	trAddCss: function(order){
		id='tr'+order;
		var count=0;
		 if($('tr1')){
			 count++;
			$('tr1').className='';
		 }
		 if($('tr2')){
			 count++;
			$('tr2').className='';
		 }
		 if($('tr3')){
			 count++;
		 	$('tr3').className='';
		 }
		 if(count==1){
			 $(id).className='changeColor';
			 return;
		 }else if(count==2){
			 if(order==2){
				 $('tr1').className='changeColor';
		 	}else{
		 		$('tr2').className='changeColor';
		 	}
		 }else if(count==3){
			 if(order==1){
				 $('tr2').className='changeColor';
				 return;
			 }
			 if(order==2)
				 $('tr3').className='changeColor';
			 else
				 $('tr1').className='changeColor';
		 }
		 
		
	},
    setscore: function(username, scoreArray, totalScore, id) {
        if (scoreArray != undefined) {
            if ($(id) == undefined) {
                var tr = document.createElement('tr');
                tr.id = id;
                var scores = $('scores');
                scores.appendChild(tr);
            }
            room.deleteTd(id);
            var x = $(id).insertCell(0);
            x.innerHTML = totalScore;
            for (var i = scoreArray.length - 1; i >= 0; --i) {
                var y = $(id).insertCell(0);
                y.innerHTML = scoreArray[i];
            }
            var z = $(id).insertCell(0);
            z.innerHTML = username;
        }
    },
    _onclose: function(m) {
        this._ws = null;

    },
    _returnscore: function(g, sendor) {
        //runCmd();
        return 9;
    },
    deleteTd: function(id) {
    	if($(id)){
	        var tdnode = $(id).childNodes.length;
	        if (tdnode > 0) {
	            for (var i = 0; i < tdnode; i++) {
	                $(id).deleteCell(0);
	            }
	        }
    	}
    },
    init: function() {
        var qrCode = document.getElementById('qrCode');
        var url = 'http://' + location.host + '/bowlingsvn/mobileball.html';
        $('client-url').innerHTML = url;
        $('client-url').setAttribute('href', url);
        var width = 180;
        var height = 180;
        qrCode.style.backgroundImage = 'url(http://chart.apis.google.com/chart?chs=' + width + 'x' + height + '&cht=qr&chld=L%7C1&choe=UTF-8&chl=BEGIN%3AVCARD%0AVERSION%3A3.0%0AURL%3A' + url + '%0AEND%3AVCARD)';
    }
};