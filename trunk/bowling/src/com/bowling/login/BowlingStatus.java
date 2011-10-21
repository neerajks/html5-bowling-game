package com.bowling.login;

public enum BowlingStatus {
  NO_ONE_JOIN(0),
  WAITING_FOR_PLAYERS(1),
  WAITING_FOR_MOBILE(2),
  THROWING_BALL(3);
  
  private int value;
  // Constructor 
  BowlingStatus(int s) {
    value = s;
  };
  public int getState() {
    return value;
  };
}
