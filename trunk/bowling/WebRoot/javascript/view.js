if (!window.WebSocket && window.MozWebSocket)
        window.WebSocket=window.MozWebSocket;
      if (!window.WebSocket)
        alert("WebSocket not supported by this browser");
    
      function $() { return document.getElementById(arguments[0]); }
      function $F() { return document.getElementById(arguments[0]).value; }
      
      function getKeyCode(ev) { if (window.event) return window.event.keyCode; return ev.keyCode; } 
      
      var room = {
        join: function() {
          
          var urls=document.location.toString().replace('http://','ws://').replace('https://','wss://');
          var location=urls.substring(0,urls.indexOf("bowling"))+"bowling/bajax/";
          this._ws=new WebSocket(location,"bajax");
          this._ws.onopen=this._onopen;
          this._ws.onmessage=this._onmessage;
          this._ws.onclose=this._onclose;
        },
        
        _onopen: function(){
         	room._send('connect');
        },
        
        _send: function(message){
         
          if (this._ws)
            this._ws.send(message);
        },
      _onmessage: function(m) {
          if ('connect'!=m.data){
             var result = JSON.parse(m.data);
             if(result.g!= undefined){
             	 var score=room._returnscore(result.g,result.sendor);
	             jsonresult='{"username":"'+result.username+'","'
	             		   +'score":"'+room._returnscore(result)+'"}';
	             room._send(jsonresult);
             }
             if(m.message && message=='end')
            	 room.join();
             var status;
             if(result.username!= undefined && result.status=='0')
             		status='waiting..';
             if(result.username!= undefined && result.status=='1')
             		status='go'
             if(result.username!= undefined && result.order=='1'){
             	$('A').className='';
             	$('playa').innerHTML='<b>玩家：'+result.username+',得分：score：'+result.score+',status:'+status+'</b>';
             }
             if(result.username!= undefined && result.order=='2'){
             	$('B').className='';
             	$('playb').innerHTML='<b> 玩家：'+result.username+',得分：score：'+result.score+'--status:'+status+'</b>';
             }
             if(result.username!= undefined && result.order=='3'){
             	$('C').className='';
             	$('playc').innerHTML='<b> 玩家：'+result.username+',得分：score：'+result.score+'--status:'+status+'</b>';
             }
           }
        },
        
        _onclose: function(m) {
          this._ws=null;
          
        },
        _returnscore:function(g,sendor){
        	//runCmd();
        	return 9;
        },
        init:function(){
       	 var qrCodeImage = document.getElementById('qrCode');
           var url = 'http://' + location.host + '/bowling/bowlingajaxindex.html';
           $('client-url').innerHTML = url;
           var width = 150;
           var height = 150;
           qrCodeImage.src = 'http://chart.apis.google.com/chart?chs=' + width +
             'x' + height +
             '&cht=qr&chld=L%7C1&choe=UTF-8&chl=BEGIN%3AVCARD%0AVERSION%3A3.0%0AURL%3A' +
             url + '%0AEND%3AVCARD';
       }
      };