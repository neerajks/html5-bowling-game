package com.bowling.websocket;

import java.io.IOException;

import org.eclipse.jetty.websocket.WebSocket;
import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.User;
import com.bowling.util.Constant;



public class ChatWebSocket implements WebSocket.OnTextMessage

  {
    WebSocket.Connection _connection;

     public ChatWebSocket() {
    }

    public void onOpen(final WebSocket.Connection connection) {
      this._connection = connection;
      System.out.println("onopen");
      Constant.Connection=connection;
      if(Constant.jsonpoll!=null){
    	  try {
			this._connection.sendMessage(Constant.jsonpoll.toString());
			Constant.iscomplete=false;
		} catch (IOException e) {
			e.printStackTrace();
		}
      }
     
    }

    public void onMessage(final byte frame, final byte[] data, final int offset, final int length)
    {
    }

    public void onMessage(final String data)
    {
    	JSONObject a=null;
    	try {
    		  if(!data.equals("connect")){
	    		  a=new  JSONObject(data);
		    	  if(Constant.user1!=null && a.get("username").equals(Constant.user1.username)){
		    		  Constant.user1.total++;
		    		  Constant.user1.score+=Integer.parseInt((String) a.get("score"));
		    		  Constant.user1.scorearray[Constant.user1.total-1]=Integer.parseInt((String) a.get("score"));
		    		  
		    		  if(Constant.user2!=null){
		    			  Constant.user2.status="1";
		    			  Constant.user1.status="0";
		    		  }else if(Constant.user3!=null){
		    			  Constant.user3.status="1";
		    			  Constant.user1.status="0";
		    		  }
		    		  
		    		  Constant.iscomplete=true;
		    	  }
		    	  if(Constant.user2!=null && a.get("username").equals(Constant.user2.username)){
		    		  Constant.user2.total++;
		    		  Constant.user2.score+=Integer.parseInt((String) a.get("score"));
		    		  Constant.user2.scorearray[Constant.user2.total-1]=Integer.parseInt((String) a.get("score"));
		    		  if(Constant.user3!=null){
		    			  Constant.user3.status="1";
		    			  Constant.user2.status="0";
		    		  }else if(Constant.user1!=null){
		    			  Constant.user1.status="1";
		    			  Constant.user2.status="0";
		    		  }
		    		  
		    		  Constant.iscomplete=true;
		    	  }
		    	  if(Constant.user3!=null && a.get("username").equals(Constant.user3.username)){
		    		  
		    		  Constant.user3.score+=Integer.parseInt((String) a.get("score"));
		    		  Constant.user3.scorearray[Constant.user3.total-1]=Integer.parseInt((String) a.get("score"));
		    		  Constant.user3.total++;
		    		  if(Constant.user1!=null){
		    			  Constant.user1.status="1";
		    			  Constant.user3.status="0";
		    		  }else if(Constant.user2!=null){
		    			  Constant.user2.status="1";
		    			  Constant.user3.status="0";
		    		  }
		    		  
		    		  Constant.iscomplete=true;
		    	  }
		    	  send(a);
	    	  }else if(data.equals("connect")){
	    		  Constant.initConst();
	    	  }
    		  
			System.out.println("onmessage");
    	} catch (Exception e) {
			e.printStackTrace();
		}
      if (data.indexOf("disconnect") >= 0) {
        this._connection.disconnect();
      }
      
    }
    
    public void send(JSONObject a){
    	try{
	    	if(Constant.user1!=null){
	 		   a= new JSONObject();
	 		   a=beantoJson(Constant.user1,a);
	 		   this._connection.sendMessage(a.toString());
			}
			if(Constant.user2!=null){
	 		   a= new JSONObject();
	 		   a=beantoJson(Constant.user2,a);
	 		   this._connection.sendMessage(a.toString());
			}
			if(Constant.user3!=null){
	 		   a= new JSONObject();
	 		   a=beantoJson(Constant.user3,a);
	 		   this._connection.sendMessage(a.toString());
			}
    	}catch(Exception e){
    		e.printStackTrace();
    	}
    }
    public void onClose(final int code, final String message)
    {
     
    }
    
    public JSONObject beantoJson(User u,JSONObject json) throws JSONException{
    	json.put("username", u.getUsername());
    	json.put("login_id", u.getLoginid());
    	json.put("status", u.getStatus());
    	json.put("order", u.getOrder());
    	json.put("score", u.getScore());
    	json.put("total", u.getTotal());
    	json.put("scorearray", u.getScorearray());
    	return json;
    	
    }
  
  }
