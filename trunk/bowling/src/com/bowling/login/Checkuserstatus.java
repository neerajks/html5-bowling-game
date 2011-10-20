package com.bowling.login;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.util.Constant;
import com.bowling.util.Util;

public class Checkuserstatus extends HttpServlet{
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
		User user=null;
		JSONObject a;
		String message=null;
		
		String loginjson=Util.getBody(request);
		
		try {
			
			 a= new JSONObject(loginjson);
			 setUserStatus();
			 if(!a.isNull("username"))
				 user=synchronoususer(a.getString("username"));
			 response.setContentType("text/json;charset=utf-8");
			 JSONObject responsejson = new JSONObject();
			 
			 if(user!=null){
				 responsejson.put("username", user.getUsername());
				 responsejson.put("login_id", user.getLoginid());
				 responsejson.put("status", user.getStatus());
				 responsejson.put("order", user.getOrder());
				 responsejson.put("iscomplete", Constant.iscomplete);
				 responsejson.put("iscreate", Constant.iscreate);
				 responsejson.put("joinnumber", Constant.JOINNUMBER);
				 responsejson.put("numbercount", Constant.NUMBERCOUNT);
				 responsejson.put("total", user.getTotal());
				 responsejson.put("score", user.getScore());
				 responsejson.put("pollusername", Constant.pollusername);
				 
				 
			 }else{
				 message=checkUserStatus(message);
				 responsejson.put("message", message);
				 responsejson.put("joinnumber", Constant.JOINNUMBER);
				 responsejson.put("numbercount", Constant.NUMBERCOUNT);
				 
			 }
			 
			 
			 gameEnd();
			 if(Constant.ISEND && !Constant.ISRESTART){
				 sendMessageToClient(response,a);
				 sendMessageToView();
			}else if(Constant.ISRESTART){
				 sendMessageToClient(response,a);
				 sendMessageToView();
			 }
			 GameStart(responsejson.toString());
		 	 byte[] bytes = responsejson.toString().getBytes("utf-8");
		 	 response.setContentLength(bytes.length);
		 	 response.getOutputStream().write(bytes);
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	public User synchronoususer(String username){
		if(Constant.user1!=null && username.equals(Constant.user1.username)){
			if("1".equals(Constant.user1.getStatus()))
				Constant.pollusername=Constant.user1.username;
			return Constant.user1;
		}
		if(Constant.user2!=null && username.equals(Constant.user2.username)){
			if("1".equals(Constant.user2.getStatus()))
				Constant.pollusername=Constant.user2.username;
			return Constant.user2;
		}
		if(Constant.user3!=null && username.equals(Constant.user3.username)){
			if("1".equals(Constant.user3.getStatus()))
				Constant.pollusername=Constant.user3.username;
			return Constant.user3;
		}
		return null;
	}
	
	public  void gameEnd(){
		
		if(Constant.NUMBERCOUNT==1 ){
			System.out.print(Constant.user1.total);
			if(Constant.user1!=null && Constant.user1.total==Constant.ROUNDS){
				Constant.ISEND=true;
				
			}else if(Constant.user2!=null && Constant.user2.total==Constant.ROUNDS){
				Constant.ISEND=true;
				
			}else if(Constant.user3!=null && Constant.user3.total==Constant.ROUNDS){
				Constant.ISEND=true;
				
			}
		}else if(Constant.NUMBERCOUNT==2 && !Constant.sendflag){
			if(Constant.user3!=null && Constant.user3.total==Constant.ROUNDS){
				Constant.ISEND=true;
				
			}else if(Constant.user2!=null && Constant.user2.total==Constant.ROUNDS){
				Constant.ISEND=true;
				
			}
		}else if(Constant.user3!=null && Constant.NUMBERCOUNT==3 && Constant.user3.total==Constant.ROUNDS){
			Constant.ISEND=true;
		}
		
	}
	
	public void sendMessageToClient(HttpServletResponse response,JSONObject b) throws JSONException, IOException{
		JSONObject a=new JSONObject();;
		User user = null;
		String username="";
		if(!b.isNull("username"))
			username=b.getString("username");
		user=returnWin(user,username);
		if(Constant.ISEND){
			Constant.sendflag=false;
			//beantoJson(user,a);
			a.put("win", username);
			a.put("username",username);
			a.put("message", "gameend");
		}
		if(Constant.ISRESTART){
			Constant.ISEND=false;
			Constant.sendflag=false;
			a.put("message", "restart");
		}
		byte[] bytes = a.toString().getBytes("utf-8");
	 	 response.setContentLength(bytes.length);
	 	 response.getOutputStream().write(bytes);
	}
	
	public User returnWin(User user,String username){
		int maxscore=0;
		if(Constant.user1!=null && username.equals(Constant.user1.username)){
			maxscore=Constant.user1.score;
			user=Constant.user1;
			return user;
		}
		if(Constant.user2!=null && Constant.user2.score>=maxscore){
			maxscore=Constant.user2.score;
			user=Constant.user2;
			if(Constant.user3!=null && Constant.user3.score==maxscore && username.equals(Constant.user2.getUsername())){
				Constant.win=user.getUsername();
				return user;
			}
		}	
		if(Constant.user3!=null && Constant.user3.score>=maxscore){
			maxscore=Constant.user3.score;
			user=Constant.user3;
		}
		if(user!=null)
			Constant.win=user.getUsername();
		return user;
	}
	
	public void sendMessageToView(){
		JSONObject a= new JSONObject();
		try{
			if(Constant.ISEND && !Constant.sendflag){
				a.put("win", Constant.win);
				//a.put("message", "win");
				a.put("message", "end");
				Constant.Connection.sendMessage(a.toString());
				Constant.sendflag=true;
			}
			if(Constant.ISRESTART && !Constant.sendflag){
				a.put("message", "end");
				Constant.Connection.sendMessage(a.toString());
				Constant.initConst();
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public JSONObject beantoJson(User u,JSONObject json) throws JSONException{
    	json.put("username", u.getUsername());
    	json.put("login_id", u.getLoginid());
    	json.put("status", u.getStatus());
    	json.put("order", u.getOrder());
    	json.put("score", u.getScore());
    	json.put("total", u.getTotal());
    	return json;
    	
    }
	
	public void GameStart(String data){
		if(Constant.Connection!=null){
			
			try{
				
				JSONObject a =new JSONObject(data);
				if(!a.isNull("username") && "1".equals(a.getString("status")) && !Constant.polluser.equals(a.getString("username"))){
					Constant.polluser=a.getString("username");
					Constant.Connection.sendMessage(a.toString());
				}
			}catch (Exception e){
				e.printStackTrace();
			}
		}
	}
	
	public String checkUserStatus(String message){
		 if(Constant.JOINNUMBER<Constant.NUMBERCOUNT && Constant.NUMBERCOUNT>0){
			return "null";
		}else if(Constant.NUMBERCOUNT==0){
			return "null";
		}else{
			return Constant.MESSAGE1;
		}
		 
	}
	
	public void setUserStatus(){
		if(Constant.JOINNUMBER==Constant.NUMBERCOUNT && Constant.NUMBERCOUNT>0){
			 if(Constant.user1!=null && Constant.user1.order.equals("1"))
				 if((Constant.user2!=null && !"1".equals(Constant.user2.status)) && (Constant.user3!=null && !Constant.user3.status.equals("1")))
					 Constant.user1.status="1";
				 else if(Constant.NUMBERCOUNT==2 && ((Constant.user2!=null && !"1".equals(Constant.user2.status)) || (Constant.user3!=null && !Constant.user3.status.equals("1"))))
					 Constant.user1.status="1";
				 else if(Constant.NUMBERCOUNT==1)
					 Constant.user1.status="1";
			 else if(Constant.user2!=null && Constant.user2.order.equals("1"))
				 if((Constant.user3!=null && !"1".equals(Constant.user3.status)) && (Constant.user1!=null && !Constant.user1.status.equals("1")))
					 Constant.user2.status="1";
				 else if(Constant.NUMBERCOUNT==2 && ((Constant.user1!=null && !"1".equals(Constant.user1.status)) || (Constant.user3!=null && !Constant.user3.status.equals("1"))))
					 Constant.user2.status="1";
				 else if(Constant.NUMBERCOUNT==1)
					 Constant.user2.status="1";
			 else if(Constant.user3!=null && Constant.user3.order.equals("1"))
				 if((Constant.user2!=null && !"1".equals(Constant.user2.status)) && (Constant.user1!=null && !Constant.user1.status.equals("1")))
					 Constant.user3.status="1";
				 else if(Constant.NUMBERCOUNT==2 && ((Constant.user1!=null && !"1".equals(Constant.user1.status)) || (Constant.user2!=null && !Constant.user2.status.equals("1"))))
					 Constant.user3.status="1";
				 else if(Constant.NUMBERCOUNT==1)
					 Constant.user3.status="1";
			 }
	}
}
