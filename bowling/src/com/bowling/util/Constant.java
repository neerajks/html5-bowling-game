package com.bowling.util;

import java.util.Timer;

import org.eclipse.jetty.websocket.WebSocket;
import org.eclipse.jetty.websocket.WebSocket.Connection;
import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.User;

public class Constant {
  public static int current_order = 1;
  public static User[] USERArray = new User[4];
  
	public static String MESSAGE1 ="游戏人数已满,请稍后再试！";
	public static String MESSAGE2="场景未加载完毕！";
	public static String MESSAGE3="游戏正在创建！请稍后登陆";
	public static String MESSAGE4="��Ϸ���������Ժ�����";
	public static String MESSAGE5="用户名重复，请重新输入！";
	public static String win="";
	public static String MESSAGE6="祝贺玩家:"+win+"获胜！"; 
	
	
	public static String BEGIN="begin";
	public static String END="end";
	public static String polluser="";
	public static String pollusername="";
	
	public static boolean iscreate=false;
	public static boolean ISEND=false;
	public static boolean ISRESTART=false;
	public static boolean sendflag=false;
	public static boolean START=false;
	
	public static int endfrequency=0;
	public static int ROUNDS=10;
	public static int NUMBERCOUNT=0;
	public static int JOINNUMBER=0;
	public static boolean isThrowingBall = true;
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

	public static void initConst() {
		 user1=null;
		 user2=null;
		 user3=null;
		 BEGIN="begin";
		 END="end";
		 iscreate=false;
		 ISEND=false;
		 NUMBERCOUNT=0;
		 JOINNUMBER=0;
		 isThrowingBall=true;
		 sendflag=false;
		 ISRESTART=false;
		 jsonpoll=null;
		 pollusername="";
		 endfrequency=0;
	}
	
	public static TimerTaskTest timetask;
	public static Timer timer;
	public static User synchronizedUser;
	
	public static void timeOut(User user) throws JSONException{
		
		  if(Constant.timetask==null){
			  Constant.timetask=new TimerTaskTest();
		  }
		  Constant.timetask.changeUserStatusByTime(user);	  
	}
	
	public static User synchronoususer(String username){
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
}
