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

public class LoginServlet extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
	 
	  User user=null;
	  JSONObject a;
	  String loginjson=request.getParameter("jsonlogin");
	  try {
		 a= new JSONObject(loginjson);
		 if(Constant.JOINNUMBER==3 && a.getString("login_id").equals("undefined")){
			 byte[] bytes = ("{\"message\":\""+Constant.MESSAGE1+"\"}").getBytes("utf-8");
		 	 response.setContentLength(bytes.length);
		 	 response.getOutputStream().write(bytes);
			 	return;
		 }
		 if(Constant.JOINNUMBER<3){
			 
			 if(user==null){
				  user  = new User();
				  user.setLoginid(String.valueOf(Constant.JOINNUMBER+1));
				  user.setUsername(a.getString("username"));
				  if(Constant.JOINNUMBER==2){
					  Constant.user1.status="1";
				  }
				  user.setStatus(String.valueOf(0));
				  
				  user.setOrder(String.valueOf(Constant.JOINNUMBER+1));
				  Constant.setUser(user);
				  Constant.JOINNUMBER++; 
			 }
		 }
		 response.setContentType("text/json;charset=utf-8");
		 StringBuilder buf = new StringBuilder();
		 buf.append("{\"username\":\"");
		 buf.append(user.getUsername());
		 buf.append("\",\"login_id\":\"");
		 buf.append(user.getLoginid());
		 buf.append("\",\"status\":\"");
		 buf.append(user.getStatus());
		 buf.append("\",\"order\":\"");
		 buf.append(user.getOrder());
		 buf.append("\",\"iscomplete\":\""+Constant.iscomplete+"\"}");
		 if(Constant.Connection!=null){
			 Constant.Connection.sendMessage(buf.toString());
		 }
	 	 byte[] bytes = buf.toString().getBytes("utf-8");
	 	 response.setContentLength(bytes.length);
	 	 response.getOutputStream().write(bytes);
	  } catch (JSONException e) {
			e.printStackTrace();
	  } 
  }
	
}
