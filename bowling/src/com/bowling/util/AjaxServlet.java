package com.bowling.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocketServlet;

import com.bowling.login.User;
import com.bowling.websocket.ChatWebSocket;


public class AjaxServlet extends WebSocketServlet{
	List<User> list=new ArrayList<User>();
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	    throws ServletException, IOException{
			String action =getMethod(request);
			getServletContext().getNamedDispatcher(action).forward(request, response);
	}
	  
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws ServletException, IOException{
		  if (request.getParameter("action") != null)
		      doPost(request, response);
		  else
		      getServletContext().getNamedDispatcher("default").forward(request, response);
	  }
		public WebSocket doWebSocketConnect(HttpServletRequest arg0, String arg1) {
			WebSocket ws=new ChatWebSocket();
			return ws;
		}
	public String getMethod(HttpServletRequest request){
		String url[]=request.getRequestURI().split("/");
		return url[url.length-1];
	}
}
