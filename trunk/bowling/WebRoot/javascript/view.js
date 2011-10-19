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
        var location = urls.substring(0, urls.indexOf("bowling")) + "bowling/bajax/";
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
    _onmessage: function(m) {
        if ('connect' != m.data) {
            var result = JSON.parse(m.data);
            if (result.g != undefined) {
                var score = room._returnscore(result.g, result.sendor);
                jsonresult = '{"username":"' + result.username + '","' + 'score":"' + room._returnscore(result) + '"}';
                room._send(jsonresult);
            }
            if (result.message && result.message.length > 7) {
                VUI.hideWaitWrapper();
                VUI.showMainMessage(result.message);
                window.setTimeout(VUI.refresh, 10000);
                return;
            }
            if (result.message && result.message == 'end') {
                /*VUI.showMainMessage(m.flag);
            	 window.setTimeout(VUI.hideMainMessage(),1000);*/

                VUI.hideMainMessage();
                VUI.hidePlayer1();
                VUI.hidePlayer2();
                VUI.hidePlayer3();

            }
            if (result.message && result.message == 'win') {
                VUI.hideWaitWrapper();
                VUI.showMainMessage('玩家：' + m.message + '获胜！');
                window.setTimeout(VUI.hideMainMessage(), 1000);
            }
            var status;
            if (result.username != undefined && result.status == '0') status = 'waiting..';
            if (result.username != undefined && result.status == '1') {
                VUI.hideWaitWrapper();
                VUI.showMainMessage('轮到玩家：' + result.username + '击球');
                window.setTimeout(VUI.hideMainMessage, 5000);
            }
            if (result.username != undefined && result.order == '1') {
                VUI.showPlayer1('玩家：' + result.username + '已登录');
                room.setThInfors(result.scorearray.length,'th_infors');
                room.setscore(result.username, result.scorearray, result.score, result.total, 'tr1');
            }
            if (result.username != undefined && result.order == '2') {
                VUI.showPlayer2('玩家：' + result.username + '已登录');
                room.setscore(result.username, result.scorearray, result.score, result.total, 'tr2');
            }
            if (result.username != undefined && result.order == '3') {
                VUI.showPlayer3('玩家：' + result.username + '已登录');
                room.setscore(result.username, result.scorearray, result.score, result.total, 'tr3');
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
    setscore: function(username, Arraylist, count, total, id) {
        if (Arraylist != undefined) {
            if ($(id) == undefined) {
                var tr = document.createElement('tr');
                tr.id = id;
                var scores = $('scores');
                scores.appendChild(tr);
            }
            room.deleteTd(id);
            var x = $(id).insertCell(0);
            x.innerHTML = count;
            for (var i = Arraylist.length - 1; i >= 0; --i) {
                var y = $(id).insertCell(0);
                y.innerHTML = Arraylist[i];

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
        var tdnode = $(id).childNodes.length;
        if (tdnode > 0) {
            for (var i = 0; i < tdnode; i++) {
                $(id).deleteCell(0);
            }
        }
    },
    init: function() {
        var qrCode = document.getElementById('qrCode');
        var url = 'http://' + location.host + '/bowling/bowlingajaxindex.html';
        $('client-url').innerHTML = url;
        $('client-url').setAttribute('href', url);
        var width = 180;
        var height = 180;
        qrCode.style.backgroundImage = 'url(http://chart.apis.google.com/chart?chs=' + width + 'x' + height + '&cht=qr&chld=L%7C1&choe=UTF-8&chl=BEGIN%3AVCARD%0AVERSION%3A3.0%0AURL%3A' + url + '%0AEND%3AVCARD)';
    }
};