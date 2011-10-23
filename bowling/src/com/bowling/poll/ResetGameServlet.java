package com.bowling.poll;

import java.io.IOException;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.BowlingStatus;
import com.bowling.util.Constant;


@SuppressWarnings("serial")
public class ResetGameServlet extends HttpServlet{
  /**
   * 
   */
  private static final long serialVersionUID = 8476927235219882734L;
  
  private static int hasFinishedUsersNumber = 0;

  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException{
    hasFinishedUsersNumber ++;
    if (hasFinishedUsersNumber == Constant.NUMBERCOUNT) {
      //reset game
      ///compute ranks 	
      Constant.resetConstant();
      //reset bowling review
      
      JSONObject bowlingScene = new JSONObject();
      try {
        bowlingScene.put("status", BowlingStatus.RESET.getState());
      } catch (JSONException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
      Constant.Connection.sendMessage(bowlingScene.toString());
      hasFinishedUsersNumber = 0;
    }
    byte[] bytes = "{}".toString().getBytes("utf-8");
    response.setContentLength(bytes.length);
    response.setContentType("text/json;charset=utf-8");
    response.getOutputStream().write(bytes);
  }   
}
