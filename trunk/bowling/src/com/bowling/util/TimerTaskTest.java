package com.bowling.util;

import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.User;

public class TimerTaskTest extends TimerTask{
	
	public void changeUserStatusByTime(User u) throws JSONException{
		try{
			if(u!=null)
				Constant.synchronizedUser=u;
			if(Constant.timer==null){
				Constant.timer=new Timer();
				Constant.timer.schedule(new TimerTaskTest(), 15000);
			}else{
				Constant.timer.cancel();
				Constant.timer=null;
				Constant.timer=new Timer();
				Constant.timer.schedule(new TimerTaskTest(), 15000);
			}
			
		}catch(Exception ex){
			ex.printStackTrace();
			Constant.timer.cancel();
		}
	}

	@Override
	public void run() {
		try{
			System.out.println("========执行超时操作");
			JSONObject mess=new JSONObject();
			//no create 
			if(Constant.NUMBERCOUNT==0 && Constant.JOINNUMBER==1){
				Constant.initConst();
				mess.put("message", "创建游戏超时,其他玩家可以重新创建");
				if(Constant.Connection!=null)
					Constant.Connection.sendMessage(mess.toString());
			}
			//create   no player
			if(Constant.NUMBERCOUNT>0 && Constant.JOINNUMBER!=Constant.NUMBERCOUNT){
				Constant.initConst();
				mess.put("message", "玩家人数不足,等待超时,其他玩家可以重新创建");
				if(Constant.Connection!=null)
					Constant.Connection.sendMessage(mess.toString());
			}
			//player timeout
			if(Constant.NUMBERCOUNT>0 && Constant.JOINNUMBER==Constant.NUMBERCOUNT){
				
				//one player
				if(Constant.NUMBERCOUNT==1){
					Constant.user1.currentFrame++;
					if(Constant.user1.currentFrame<=10)
						Constant.user1.scorearray[Constant.user1.currentFrame-1]=0;
						Constant.timeOut(null);
				}
				
				//two player
				if(Constant.NUMBERCOUNT==2){
					if(Constant.user1.status=="1"){
						Constant.user1.status="0";
						Constant.user1.currentFrame++;
						Constant.user1.scorearray[Constant.user1.currentFrame-1]=0;
						Constant.user2.status="1";
						Constant.timeOut(null);
					}else{
						Constant.user2.status="0";
						Constant.user2.currentFrame++;
						if(Constant.user2.currentFrame==10)
							Constant.user2.scorearray[Constant.user2.currentFrame-1]=0;
						Constant.user1.status="1";
						Constant.timeOut(null);
					}
				}
				
				//three player
				if(Constant.NUMBERCOUNT==3){
					if(Constant.user1.status=="1"){
						Constant.user1.status="0";
						Constant.user1.currentFrame++;
						Constant.user1.scorearray[Constant.user1.currentFrame-1]=0;
						Constant.user2.status="1";
						Constant.timeOut(null);
					}else if(Constant.user2.status=="1"){
						Constant.user2.status="0";
						Constant.user2.currentFrame++;
						Constant.user2.scorearray[Constant.user2.currentFrame-1]=0;
						Constant.user3.status="1";
						Constant.timeOut(null);
					}else{
						Constant.user3.status="0";
						Constant.user3.currentFrame++;
						if(Constant.user3.currentFrame==10)
							Constant.user3.scorearray[Constant.user3.currentFrame-1]=0;
						Constant.user1.status="1";
						Constant.timeOut(null);
					}
				}
				
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}

