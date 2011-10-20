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
     	 		+"\"status:\":\""+room.status+"\",\"order\":\""+room.order+"\"}";
     	 		xhr('POST','bajax',login,room.poll);
     	 	},
			poll: function(m) {
			   if(m.action!='check')
			   		$('login').className='hidden';
			   if(m.status=='1' && m.iscomplete){
			   	  $('playa').className='';
			   	   $('playa').innerHTML='&#x8BF7;&#x6643;&#x52A8;&#x60A8;&#x7684;&#x5E73;&#x677F;&#x6216;&#x8005;&#x6ED1;&#x52A8;&#x5C4F;&#x5E55;';
			   	  $('strarts').className='hidden';
			   	}else if(!m.iscomplete || m.status=='0'){
			   		$('playa').className='hidden';
			   	  	$('strarts').className='';
			   	}  	
			   	room.username=m.username;
			   	room.status=m.status;
			   	room.login_id=m.login_id;
			   	room.order=m.order;
			   	if(m.message){
			   		alert(m.message);
			   		return;
			   	}
			 },
			 
		   	checkuserstatus:function(){
				
    	 			var login = "action=check&jsonlogin={\"username\":\""+room.username+"\",\"login_id\":\""+room.login_id+"\","
    	 		+"\"status:\":\""+room.status+"\",\"order\":\""+room.order+"\"}";
    	 		xhr('POST','bajax',login,room.poll);
    	 		setTimeout(room.checkuserstatus,6000);
     	 	},
			 send:function(){
			 	 var jsonpoll='action=poll&jsonpoll={"username":"'+room.username+'",'
			 	 			 +'"login_id":"'+room.login_id+'",'
			 	 			 +'"order":"'+room.order+'",'
			 	 			 +'"status":"'+room.status+'",'
			 	 			 +'"g":"'+room.ay+'",'+'"sendor":"'+room.ax+'"}';
			 	 xhr('POST','bajax',jsonpoll,room.poll);
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
		      	if(maxangle && minangle && maxangle >= 0 && maxangle - minangle > 85 && room.status=='1'){
		      		  room.ay=az*(Math.abs(endtime-starttime)/1000);
		      		  room.ax=xangle;
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
	      		 var MIN_TOUCH_LENGTH = 200; // in pixel
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
		          room.send();
		          startClientX = null;
		          startClientY = null;
		        }
		      }, false);
     	 }	
     	}