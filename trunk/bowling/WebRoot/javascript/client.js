function $F() {
    return document.getElementById(arguments[0]).value;
}
function xhr(method, uri, body, handler) {
    var req = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    req.onreadystatechange = function() {
        if (req.readyState == 4 && handler) {
            var result = JSON.parse(req.responseText);
            handler(result);
        }
    }
    req.open(method, uri, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send(body);
}

var room = {
    login: function(name) {
        this.username = name;
        var jsonpoll = {};
        jsonpoll["username"] = room.username;
        jsonpoll["login_id"] = room.login_id;
        jsonpoll["status"] = room.status;
        jsonpoll["order"] = room.ay;
        jsonpoll["sendor"] = room.ax;
        jsonpoll["g"] = room.order;
        jsonpoll["choicenumber"] = room.id;
        var encoded_check = JSON.stringify(jsonpoll);
        xhr('POST', 'bajax/login', encoded_check, room.poll);
    },
    poll: function(m) {
        if (room.username == undefined && m.joinnumber == 0 && m.numbercount == 0) {
            UI.hideMainMessage();
            UI.showLoginForm();
        } else if (room.username == undefined && m.joinnumber != 0 && m.numbercount == 0) {
            UI.hideLoginForm();
            UI.showMainMessage('游戏正在创建，稍后登陆！');
            return;
        } else if (room.username == undefined && m.joinnumber != 0 && m.numbercount != 0 && m.message.length > 7) {
            UI.hideLoginForm();
            UI.showMainMessage(m.message);
            return;
        } else if (room.username == undefined && m.joinnumber != 0 && m.numbercount != 0) {
            UI.hideMainMessage();
            UI.showLoginForm();
        }
        if (room.username != undefined && m.numbercount != 0 && m.score != undefined) {
            $('#current-inning-score').html(m.total);
            $('#total-score').html(m.score);
            UI.showScoreInfo();
            UI.showGameInfo(room.username);
        } else {
            UI.hideGameInfo();
            UI.hideSocreInfo();
        }
        if (m.message && m.message == 'gameend') {
            room.flag = true;
            room.restart(m);
        }
        if (m.message && (m.message == '1' || m.message == '2' || m.message == '3')) {
            UI.hideGameMode();
            UI.hideLoginForm();
            UI.showWaitingOthersMessage();
            return;
        }
        if (m.iscreate == 'true') $('#infor').hide();
        if (m.message == 'null' && !room.flag) {
            UI.hideMainMessage();
            UI.showLoginForm();
            return;
        }
        if (m.order == '1' && m.iscomplete && m.iscreate == false) {
            UI.hideLoginForm();
            UI.showGameMode();
        } else if (m.numbercount != 0 && m.numbercount != m.joinnumber) {
            UI.hideLoginForm();
            UI.hideMainMessage();
            UI.showWaitingOthersMessage();
            return;
        }

        if (m.status == '1' && m.iscomplete) {
            UI.hideWaitingOthersMessage();
            UI.showMainMessage(room.notice);
            room.throwFlag = true;
        } else if (m.iscreate == true && m.status == '0' && m.numbercount != 0 && m.numbercount == m.joinnumber) {
            UI.hideLoginForm();
            UI.hideWaitingOthersMessage();
            UI.showMainMessage('玩家:' + m.pollusername + ',  正在抛球,请稍后！');
        }

        if (m.message && m.message == 'restart') {
            UI.hideGameResult();
            room.throwFlag = false;
            UI.showLoginForm();
            return;
        }
        room.username = m.username;
        room.status = m.status;
        room.login_id = m.login_id;
        room.order = m.order;

    },
    close: function() {
    	closejson={};
    	closejson["username"]=room.username;
    	closejson["status"]=room.status;
    	closejson["close"]=true;
    	var encoded_check = JSON.stringify(closejson);
        xhr('POST', 'bajax/choicenumber', encoded_check, room.poll);
    },

    restart: function(m) {
        if (m.username == room.username && m.order == '1') {
            UI.hideMainMessage();
            UI.hideLoginForm();
            UI.showGameResult('win');
            return;

        } else if (m.win == room.username) {
            UI.hideMainMessage();
            UI.hideLoginForm();
            //UI.showMainMessage('win');
            UI.showGameResult('win');
            return;
        } else {
            UI.hideMainMessage();
            UI.hideLoginForm();
            //UI.showMainMessage('lose');
            UI.showGameResult('lose');
            return;
        }
    },
    checkuserstatus: function() {

        var jsonpoll = {};
        //jsonpoll["action"] = "poll";
        jsonpoll["username"] = room.username;
        jsonpoll["login_id"] = room.login_id;
        jsonpoll["status"] = room.status;
        jsonpoll["order"] = room.ay;
        jsonpoll["choicenumber"] = room.id;
        var encoded_check = JSON.stringify(jsonpoll);
//        if(!navigator.onLine){
//        	UI.showMainMessage('您已经处于离线状态，请检查您的网络设置');
//        }
        if (room.flag) {
            jsonpoll["completed"] = true;
            encoded_check = JSON.stringify(jsonpoll);
            xhr('POST', 'bajax/choicenumber', encoded_check, null);
            return;
        }
        xhr('POST', 'bajax/check', encoded_check, room.poll);
        setTimeout(room.checkuserstatus, 500);
    },
    send: function() {
        var jsonpoll = {};
        jsonpoll["username"] = room.username;
        jsonpoll["login_id"] = room.login_id;
        jsonpoll["status"] = room.status;
        jsonpoll["order"] = room.ay;
        jsonpoll["sendor"] = room.ax;
        jsonpoll["g"] = room.order;
        jsonpoll["choicenumber"] = room.id;
        var encoded_check = JSON.stringify(jsonpoll);
        xhr('POST', 'bajax/poll', encoded_check, room.poll);
    },
    choicejoinnumber: function(e) {
        var choicenumber = {};
        choicenumber["username"] = room.username;
        choicenumber["login_id"] = room.login_id;
        choicenumber["status"] = room.status;
        choicenumber["order"] = room.order;
        choicenumber["choicenumber"] = e.getAttribute('data-id');
        encoded_check = JSON.stringify(choicenumber);
        xhr('POST', 'bajax/choicenumber', encoded_check, room.poll);
    },
    initgame: function() {
        UI.hideGameResult();
        room.complete;
        document.location.href = document.location.toString();
    }
}

function init() {
    room.checkuserstatus();
    registerThrowEvent();
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
            if (room.throwFlag) {
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

                if (maxangle && minangle && maxangle >= 0 && maxangle - minangle > 93 && room.status == '1') {
                    room.ay = az * (Math.abs(endtime - starttime) / 1000);
                    room.ax = xangle;
                    room.throwFlag = false;
                    room.send();
                    throwBall();
                    maxangle = -Infinity;
                    minangle = Infinity;
                }
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
            if (room.throwFlag) {
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
                    if (room.status != '1') return;

                    room.throwFlag = false;
                    room.send();
                    throwBall();

                    startClientX = null;
                    startClientY = null;
                }
            }
        },
        false);
    }
}

var ballSize = 80;
var throwBallTimer;
var isPad = false;
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