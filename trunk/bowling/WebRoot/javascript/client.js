 function $() { return document.getElementById(arguments[0]); }
        function $F() { return document.getElementById(arguments[0]).value; }
        function xhr(method,uri,body,handler){
          var req=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
          req.onreadystatechange=function() { 
            if (req.readyState==4 && handler) {
              var result = JSON.parse(req.responseText);
              handler(result);
            }
          }
          req.open(method,uri,true);
          req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
          req.send(body);
        }
        
        var room = {
         
          login: function(name){
            this.username=name;
           $('login').className='hidden';
            var login = "action=login&jsonlogin={\"username\":\""+room.username+"\",\"login_id\":\""+room.login_id+"\","
            +"\"status:\":\""+room.status+"\",\"order\":\""+room.order+"\",\"choicenumber\":\""+room.id+"\"}";
            xhr('POST','bajax',login,room.poll);
          },
      poll: function(m) {
            if(m.message && m.message.length>5){
              $('infor').innerHTML=m.message;
             return;
           }
             if(m.message && (m.message=='1' || m.message=='2' || m.message=='3')){
             $('choice').style.display='none';
             $('login').style.display='none';
             $('wait').style.display='';
             return;
             
             } 
             if(m.iscreate=='true')
              $('infor').style.display='none';
            if(m.message=='null')
              return;
            if(m.order=='1' && m.iscomplete && m.iscreate=='false'){
             $('login').style.display='none';
             $('choice').style.display='';
         }else{
           $('login').style.display='none';
              $('wait').style.display='';
         }     
              if(m.status=='1' && m.iscomplete){
                 $('wait').style.display='none';
                 $('infor').style.display='';
              $('infor').innerHTML='&#x8BF7;&#x6643;&#x52A8;&#x60A8;&#x7684;&#x5E73;&#x677F;&#x6216;&#x8005;&#x6ED1;&#x52A8;&#x5C4F;&#x5E55;';
            
           }else if(m.iscreate=='true' && m.status=='0'){
             $('wait').style.display='';
           }
              room.username=m.username;
           room.status=m.status;
           room.login_id=m.login_id;
           room.order=m.order;
           room.throwFlag=true;
           
       },
       
         checkuserstatus:function(){
        
             var login = "action=check&jsonlogin={\"username\":\""+room.username+"\",\"login_id\":\""+room.login_id+"\","
           +"\"status:\":\""+room.status+"\",\"order\":\""+room.order+"\",\"choicenumber\":\""+room.id+"\"}";
           xhr('POST','bajax',login,room.poll);
           setTimeout(room.checkuserstatus,500);
          },
       send:function(){
          var jsonpoll='action=poll&jsonpoll={"username":"'+room.username+'",'
                 +'"login_id":"'+room.login_id+'",'
                 +'"order":"'+room.order+'",'
                 +'"status":"'+room.status+'",'
                 +'"g":"'+room.ay+'",'+'"sendor":"'+room.ax+'"}';
          xhr('POST','bajax',jsonpoll,room.poll);
       },
       choicejoinnumber:function(e){
         var choicenumber = "action=choicenumber&jsonlogin={\"username\":\""+room.username+"\",\"login_id\":\""+room.login_id+"\","
              +"\"status:\":\""+room.status+"\",\"order\":\""+room.order+"\",\"choicenumber\":\""+e.id+"\"}";
              xhr('POST','bajax',choicenumber,room.poll);
       }
        }
  
       function init(){
         room.checkuserstatus();
          registerThrowEvent();
        }
        
        function registerThrowEvent() {
            if(window.DeviceOrientationEvent){  
              var starttime=0;
         var endtime=0;
         var maxangle = -Infinity;
         var minangle = Infinity;
         var xangle;
         var az;
        
      
        window.addEventListener('deviceorientation', function(e) {
          
             var beta = e.beta;
             
               if(beta<minangle){
                  minangle=beta;
                  starttime=new Date().getTime();
              }     
               if(beta>maxangle){
                  maxangle=beta;
                  endtime=new Date().getTime();
              }
              if(maxangle && minangle && maxangle >= 0 && maxangle - minangle > 93 && room.status=='1' && room.throwFlag){
                  room.ay=az*(Math.abs(endtime-starttime)/1000);
                  room.ax=xangle;
                  room.throwFlag=false;
                  room.send();
                  maxangle = -Infinity;
                 minangle = Infinity;
              }
            
      }, false);
      
      window.addEventListener('devicemotion',function(e){
           var aig = event.accelerationIncludingGravity;
           az=aig.z;
           xangle = Math.atan(aig.x/aig.z);
      
      },false);
           }else if(window.TouchEvent){
          this.throwMode = 'touch';
            var startClientX;
             var startClientY;
             var MIN_TOUCH_LENGTH = 100; // in pixel
             var startTime;
    
            document.addEventListener('touchmove', function(e) {
            var touches = e.touches.item(0);
            if (!startClientX)
              startClientX = touches.clientX;
            if (!startClientY)
              startClientY = touches.clientY;
            
            startTime = new Date().getTime();
          }, false);
    
           document.addEventListener('touchend', function(e) {
            var touches = e.changedTouches.item(0);
            var endClientX = touches.clientX;
            var endClientY = touches.clientY;
            var xMoved = endClientX - startClientX;
            var yMoved = endClientY - startClientY;
            if (Math.abs(xMoved) >= MIN_TOUCH_LENGTH ||
                Math.abs(yMoved) >= MIN_TOUCH_LENGTH ||
                Math.sqrt(xMoved * xMoved + yMoved * yMoved) >= MIN_TOUCH_LENGTH) {
              var time = new Date().getTime() - startTime;
              //room.ay=xMoved/time;
              room.ay=yMoved/time;
              room.ax=Math.asin(xMoved/yMoved);
              //alert(1);
               if(room.status!='1')
                   return;
                if(room.throwFlag){
                  room.throwFlag=false;
                room.send();
              }
              startClientX = null;
              startClientY = null;
              
            }
          }, false);
        }  
       }

const BALL_ANIMATION_DURING = 0.8; // in ms
const BALL_WIDTH = 100;
var animationDuring;

function setAnimationDuring() {
  var ball = document.getElementById('ball');
  var width = BALL_WIDTH;
  var radius = width / 2;
  var circumference = 2 * Math.PI * radius;
  var speed = circumference / BALL_ANIMATION_DURING;
  var traceLength = window.innerHeight + width * 2;
  animationDuring = traceLength / speed;
  setPropertyInStyleSheets('#ball', {
    top: window.innerHeight + 'px',
    '-webkit-transition-duration': animationDuring + 's, 0.1s'
  }, 0);

  setPropertyInStyleSheets('#ball.show', {
    top: -BALL_WIDTH * 2 + 'px'
  }, 0);
}

setAnimationDuring();

function throwBall() {
  $('#ball').addClass('show');
  setTimeout(function() {
    $('#ball').removeClass('show');
  }, animationDuring * 1000)
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