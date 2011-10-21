package com.bowling.util;

import java.io.BufferedReader;


import javax.servlet.http.HttpServletRequest;

public  class Util {
	
	public static String getBody(HttpServletRequest request){
		StringBuffer buffer=new StringBuffer();
		try {
			
			BufferedReader bodyReader = request.getReader();
			String line = bodyReader.readLine();
			while( line != null ) {
				buffer.append(line);
				line = bodyReader.readLine();
			}
			 
		} catch (Exception e) {
			e.printStackTrace();
		}
		return buffer.toString();
	}

	public static String getPollRank() {
		int num1=0;
		int num2=0;
		int num3=0;
		String name1="";
		String name2="";
		String name3="";
		int temp = 0;
		if(Constant.user1!=null && Constant.user1.totalScore>=0){
			name1=Constant.user1.getUsername();
			num1=Constant.user1.totalScore;
		}
		if(Constant.user2!=null && Constant.user2.totalScore>=0){
			name2=Constant.user2.getUsername();
			num2=Constant.user2.totalScore;
		}
		if(Constant.user3!=null && Constant.user3.totalScore>=0){
			name3=Constant.user3.getUsername();
			num3=Constant.user3.totalScore;
		}
		if(num1==num2 && num2==num3){
			return "祝贺玩家："+name1+","+name2+","+name3+" 并列第一。";
		}
		if(num2==num1 && num1>num3){
			return "祝贺玩家："+name1+","+name2+" 并列第一。";
		}
		if(num3==num2 && num3>num1){
			return "祝贺玩家："+name3+","+name2+" 并列第一。";
		}
		if(num1==num3 && num1>num2){
			return "祝贺玩家："+name1+","+name2+" 并列第一。";
		}
		if(num1>temp)
			temp=num1;
		if(num2>temp)
			temp=num2;
		if(num3>temp){
			temp=num3;
		}
		if(temp==num1)
			return "祝贺玩家："+name1+" 获胜！";
		if(temp==num2)
			return "祝贺玩家："+name2+" 获胜！";
		if(temp==num3)
			return "祝贺玩家："+name3+" 获胜！";
		return "";
	}

}
