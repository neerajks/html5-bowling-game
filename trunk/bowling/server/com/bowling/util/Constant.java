package com.bowling.util;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocket.Connection;
import org.json.JSONObject;

import com.bowling.login.User;

public class Constant {
	public static String MESSAGE1 = "游戏正在进行中，请等待！";
	public static String MESSAGE2="场景资源未加载完毕";
	
	
	public static int JOINNUMBER=0;
	public static boolean iscomplete=true;
	public static User user1;
	public static User user2;
	public static User user3;
	
	public static void setUser(User u){
		if(user1==null){
			user1=u;
			return;
		}	
		if(user2==null){
			user2=u;
			return;
		}else{
			user3=u;
		}
	}
	public static String METHOD="";
	public static String jsonstr="{\"login_id\":\"0\",\"username\":\"0\",\"status\":\"0\"}";
	public static JSONObject jsonpoll;


	public static WebSocket.Connection Connection;
}
