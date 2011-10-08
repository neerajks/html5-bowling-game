package com.bowling.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.util.Constant;

public class Checkuserstatus extends HttpServlet{
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
		User user=null;
		JSONObject a;
		String loginjson=request.getParameter("jsonlogin");
		
		try {
			 a= new JSONObject(loginjson);
			 System.out.println(a.getString("username"));
			 user=synchronoususer(a.getString("username"));
			 response.setContentType("text/json;charset=utf-8");
			 StringBuilder buf = new StringBuilder();
			 if(user!=null){
				 buf.append("{\"username\":\"");
				 buf.append(user.getUsername());
				 buf.append("\",\"login_id\":\"");
				 buf.append(user.getLoginid());
				 buf.append("\",\"status\":\"");
				 buf.append(user.getStatus());
				 buf.append("\",\"order\":\"");
				 buf.append(user.getOrder());
				 buf.append("\",\"iscomplete\":\""+Constant.iscomplete+"\"}");
			 }else{
				 buf.append("{\"action\":\"check\"}");
			 }
		 	 byte[] bytes = buf.toString().getBytes("utf-8");
		 	 response.setContentLength(bytes.length);
		 	 response.getOutputStream().write(bytes);
		} catch (JSONException e) {
			
			e.printStackTrace();
		}
	}
	
	public User synchronoususer(String username){
		if(Constant.user1!=null && username.equals(Constant.user1.username)){
			return Constant.user1;
		}
		if(Constant.user2!=null && username.equals(Constant.user2.username)){
			return Constant.user2;
		}
		if(Constant.user3!=null && username.equals(Constant.user3.username)){
			return Constant.user3;
		}
		return null;
	}
}
