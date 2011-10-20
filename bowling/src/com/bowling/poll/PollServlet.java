package com.bowling.poll;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import com.bowling.util.Constant;
import com.bowling.util.Util;
import com.bowling.websocket.ChatWebSocket;

public class PollServlet extends HttpServlet{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
		String jsonpoll=Util.getBody(request);
		try{
		if(Constant.Connection==null){
			response.setContentType("text/json;charset=utf-8");
			 byte[] bytes = ("{\"message\":\""+Constant.MESSAGE2+"\"}").getBytes("utf-8");
		     response.setContentLength(bytes.length);
	         response.getOutputStream().write(bytes);
	         return;
		}
		Constant.jsonpoll=new JSONObject(jsonpoll);
		 	if(Constant.Connection!=null){
		 		Constant.Connection.sendMessage(Constant.jsonpoll.toString());
		 	}
			
		
		boolean flag=false;
		if(Constant.iscomplete){
			 StringBuilder buf = new StringBuilder();
			 buf.append("{\"username\":\"");
			 buf.append(Constant.jsonpoll.getString("username"));
			 buf.append("\",\"login_id\":\"");
			 buf.append(Constant.jsonpoll.getString("login_id"));
			 buf.append("\",\"status\":\"");
			 if(Constant.user1!=null && Constant.jsonpoll.getString("username").equals(Constant.user1.username)){
				 buf.append(Constant.user1.status);
				 flag=true;
			 }
			if(Constant.user2!=null && Constant.jsonpoll.getString("username").equals(Constant.user2.username)){
				 buf.append(Constant.user2.status);
				 flag=true;
			}	 
			if(Constant.user3!=null && Constant.jsonpoll.getString("username").equals(Constant.user3.username)){
				 buf.append(Constant.user3.status);
				 flag=true;
			}
			 if(!flag)
				 buf.append(Constant.jsonpoll.getString("status"));
			 buf.append("\"}");
			 response.setContentType("text/json;charset=utf-8");
			 byte[] bytes = buf.toString().getBytes("utf-8");
		     response.setContentLength(bytes.length);
	         response.getOutputStream().write(bytes);
		}else{
			response.setContentType("text/json;charset=utf-8");
	        PrintWriter out = response.getWriter();
	        out.print("{action:\"poll\"}");
		}
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
