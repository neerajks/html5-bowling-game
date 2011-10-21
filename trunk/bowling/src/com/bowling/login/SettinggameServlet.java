package com.bowling.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.util.Constant;
import com.bowling.util.Util;

public class SettinggameServlet extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
		 JSONObject a;
		 String flag="";
		  String loginjson=Util.getBody(request);
		  try {
			 a= new JSONObject(loginjson);
//			 if(a.getBoolean("close"))
//				 updateUserStatus(a);
			 if(!a.isNull("completed")){
				 Constant.endfrequency++;
				 if(Constant.endfrequency==Constant.NUMBERCOUNT){
					 String message =Util.getPollRank();
					 JSONObject messagejson= new JSONObject();
					 messagejson.put("message", message);
					 Constant.Connection.sendMessage(messagejson.toString());
					 Constant.initConst();
				 }
			 }else{
				 if(!a.isNull("choicenumber"))
					 flag=a.getString("choicenumber");
				 if(flag.equals("1") || flag.equals("2") || flag.equals("3")){
					 Constant.NUMBERCOUNT=Integer.parseInt(flag);
					 Constant.iscreate=true;
					 Constant.timeOut(null);
				 }else{
					 initgame();
					 byte[] bytes = a.toString().getBytes("utf-8");
				 	 response.setContentLength(bytes.length);
				 	 response.getOutputStream().write(bytes);;
				 	 return;
					 
				 }
				 byte[] bytes = ("{\"message\":\""+flag+"\"}").getBytes("utf-8");
			 	 response.setContentLength(bytes.length);
			 	 response.getOutputStream().write(bytes);
			 }
		   }catch(Exception e){
			   e.printStackTrace();
		   }
	}
	
	public void initgame(){
		Constant.ISEND=false;
		Constant.ISRESTART=true;
		
	}
	/*
	public void updateUserStatus(JSONObject json) throws JSONException{
		if(!json.isNull("username") && Constant.NUMBERCOUNT==0){
			Constant.initConst();
			
		}else if(!json.isNull("username") && Constant.NUMBERCOUNT>0){
			if(Constant.NUMBERCOUNT==1){
				Constant.initConst();
			}else if(!json.isNull("username") && Constant.NUMBERCOUNT==2){
				Constant.JOINNUMBER=1;
				Constant.NUMBERCOUNT=1;
				if((json.getString("username")).equals(Constant.user1.username)){
					Constant.user1=null;
					Constant.user2.setStatus("1");
				}else if((json.getString("username")).equals(Constant.user2.username)){
					Constant.user2=null;
					Constant.user1.setStatus("1");
				}
			}else if(!json.isNull("username") && Constant.NUMBERCOUNT==3){
				Constant.NUMBERCOUNT=2;
				Constant.JOINNUMBER=2;
				if(Constant.user1.getUsername().equals(json.getString("username"))){
					Constant.user1=null;
					Constant.user2.setStatus("1");
					Constant.user2.setOrder("1");
					Constant.user3.setOrder("2");
				}else if(Constant.user2.getUsername().equals(json.getString("username"))){
					Constant.user2=null;
					Constant.user3.setStatus("1");
					Constant.user3.setOrder("2");
				}else if(Constant.user3.getUsername().equals(json.getString("username"))){
					Constant.user3=null;
					Constant.user1.setStatus("1");
				}
			}
			
		}
	}*/
}
