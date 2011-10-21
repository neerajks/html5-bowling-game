package com.bowling.login;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;
import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.util.Constant;
import com.bowling.util.Util;

public class LoginServlet extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
	 
	  
	  User user=null;
	  JSONObject a;
	  JSONObject polluser=new JSONObject();
	  String loginjson=Util.getBody(request);
	  try {
		 a= new JSONObject(loginjson);
		 	 JSONObject messagejson= new JSONObject();
			 if(Constant.NUMBERCOUNT==0 && Constant.JOINNUMBER!=0){
				 messagejson.put("message", Constant.MESSAGE3);
				 byte[] bytes = messagejson.toString().getBytes("utf-8");
			 	 response.setContentLength(bytes.length);
			 	 response.getOutputStream().write(bytes);
				 	return;
			 }else if(Constant.JOINNUMBER==Constant.NUMBERCOUNT && Constant.JOINNUMBER>0){
				 messagejson.put("message", Constant.MESSAGE3);
				 byte[] bytes = messagejson.toString().getBytes("utf-8");
			 	 response.setContentLength(bytes.length);
			 	 response.getOutputStream().write(bytes);
				 	return;
			 }
			 if(IsExistName(a)){
				 messagejson.put("message", Constant.MESSAGE3);
				 byte[] bytes = messagejson.toString().getBytes("utf-8");
			 	 response.setContentLength(bytes.length);
			 	 response.getOutputStream().write(bytes);
				 	return;
			 }
		 	 if(user==null){
				  user  = new User();
				  user.setLoginid(String.valueOf(Constant.JOINNUMBER+1));
				  user.setUsername(a.getString("username"));
				  user.setStatus(String.valueOf(0));
				  user.setScore(0);
				  user.setOrder(String.valueOf(Constant.JOINNUMBER+1));
				  user.setScorearray(new int[]{0,0,0,0,0,0,0,0,0,0});
				  Constant.setUser(user);
				  Constant.JOINNUMBER++;
				  Constant.timeOut(user);
				  
			 }
		 
		 response.setContentType("text/json;charset=utf-8");
		if(Constant.Connection!=null){
			 polluser=new JSONObject(); 
			 polluser.put("username", user.getUsername());
			 polluser.put("order", user.getOrder());
			 polluser.put("status", user.getStatus());
			 polluser.put("login_id", user.getLoginid());
			 polluser.put("score", user.getScore());
			 polluser.put("scorearray", user.scorearray);
			 polluser.put("iscomplete", Constant.iscomplete);
			 polluser.put("iscreate", Constant.iscreate);
			 polluser.put("total", user.total);
			 polluser.put("joinnumber", Constant.JOINNUMBER);
			 polluser.put("numbercount", Constant.NUMBERCOUNT);
			 Constant.Connection.sendMessage(polluser.toString());
		 }
	 	 byte[] bytes = polluser.toString().getBytes("utf-8");
	 	 response.setContentLength(bytes.length);
	 	 response.getOutputStream().write(bytes);
	  } catch (JSONException e) {
			e.printStackTrace();
	  } 
  }


	private boolean IsExistName(JSONObject a) throws JSONException {
		if(Constant.user2!=null && Constant.user2.username.equals(a.getString("username")) )
			return true;
		else if(  Constant.user3!=null && Constant.user3.username.equals(a.getString("username")))
			return true;
		return false;
			
	}
	
}
