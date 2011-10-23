package com.bowling.util;


import org.eclipse.jetty.websocket.WebSocket;


import com.bowling.login.User;

public class Constant {
  
  public final static int ROUNDS = 3;
  
  public static int current_order = 1;
  public static User[] USERArray = new User[4];

  public static int NUMBERCOUNT=0;
	public static int JOINNUMBER=0;
	
	public static WebSocket.Connection Connection;

	public static void resetConstant() {
	  current_order = 1;
	  USERArray = new User[4];
	  NUMBERCOUNT = 0;
	  JOINNUMBER = 0;
	}
}
