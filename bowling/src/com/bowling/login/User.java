package com.bowling.login;

import com.bowling.util.Constant;

public class User {
	public String loginid; 
	public String username;
	public String status;
	public String order;
	public int score;
	public int total=0;
	public int[] scorearray=new int[Constant.ROUNDS];
	public int[] getScorearray() {
		return scorearray;
	}
	public void setScorearray(int[] scorearray) {
		this.scorearray = scorearray;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
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
