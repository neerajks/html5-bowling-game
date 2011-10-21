package com.bowling.login;

import com.bowling.util.Constant;

public class User {
  public enum UserState {
    BECOME_MASTER(0),
    WAITING_FOR_MASTER(1),
    JOINED_GAME(2),
    Full_GAME(3),
    WAITING_FOR_OTHERS(4),
    WAITING_THROWING(5),
    THROWING_BALL(6),
    WAITING_FOR_SCORE(7),
    NA_STATE(8);
    
    private int value;
    // Constructor 
    UserState(int s) {
      value = s;
    };
    public int getState() {
      return value;
    };
  }
  
	public String loginid; 
	public String username;
	public String status;
	public String order;
	public int totalScore;
	public int currentFrame = 0;
	
	public boolean newScore = false;
	public int[] scorearray=new int[Constant.ROUNDS];
	
  public boolean isGetNewScore() {
    return this.newScore;
  }
  
  public void setNewScore(boolean isNewScore) {
    this.newScore = isNewScore;
  }
  
	public int[] getScorearray() {
		return scorearray;
	}
	public void setScorearray(int[] scorearray) {
		this.scorearray = scorearray;
	}
	public int getCurrentFrame() {
		return currentFrame;
	}
	public void setCurrentFrame(int total) {
		this.currentFrame = total;
	}
	public int getTotalScore() {
		return totalScore;
	}
	public void setTotalScore(int score) {
		this.totalScore = score;
	}
	public String getLoginid() {
		return loginid;
	}
	public void setLoginid(String loginid) {
		this.loginid = loginid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
}
