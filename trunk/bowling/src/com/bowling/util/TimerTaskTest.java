package com.bowling.util;

import java.util.Timer;
import java.util.TimerTask;

public class TimerTaskTest extends TimerTask{
	
	public static void main(String[] args){ 
		Timer timer = new Timer();
		timer.schedule(new TimerTaskTest(),1000,2000);
		try{
			Thread.sleep(1000);
		}catch(Exception ex){
			timer.cancel();
		}
	}

	@Override
	public void run() {
		System.out.println("make it");
	}
	
}
