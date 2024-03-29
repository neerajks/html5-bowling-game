package com.bowling.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.User.UserState;
import com.bowling.util.Constant;
import com.bowling.util.Util;

public class ChoosePlayersNumber extends HttpServlet {

  /**
	 * 
	 */
  private static final long serialVersionUID = 1L;

  public void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    JSONObject loginJsonObject;

    String loginjson = Util.getBody(request);

    try {
      loginJsonObject = new JSONObject(loginjson);
      JSONObject responsejson = new JSONObject();
      Constant.NUMBERCOUNT = Integer.parseInt(loginJsonObject.getString("choicenumber"));

      String WAITING_FOR_OTHERS = String.valueOf(UserState.WAITING_FOR_OTHERS.getState());
      String THROWING_BALL = String.valueOf(UserState.THROWING_BALL.getState());
      String NA_STATE = String.valueOf(UserState.NA_STATE.getState());

      String username = loginJsonObject.getString("username");
      int[] scoreArray = new int[Constant.ROUNDS];
      User user = new User();
      user.setUsername(username);
      user.setScorearray(scoreArray);
      user.setCurrentFrame(0);
      Constant.USERArray[1] = user;
     
      responsejson.put("order", 1);
      System.out.println(Constant.Connection);
      if (Constant.Connection != null) {
        if (Constant.NUMBERCOUNT != 1) {
          responsejson.put("status", WAITING_FOR_OTHERS);

          JSONObject bowlingScene = new JSONObject();
          bowlingScene.put("status", BowlingStatus.WAITING_FOR_PLAYERS.getState());
          bowlingScene.put("username", username);
          bowlingScene.put("numbercount", Constant.NUMBERCOUNT);
          bowlingScene.put("scorearray", scoreArray);
          bowlingScene.put("joinnumber", Constant.JOINNUMBER);
          bowlingScene.put("totalscore", 0);
          Constant.Connection.sendMessage(bowlingScene.toString());
        } else if (Constant.NUMBERCOUNT == 1) {
          responsejson.put("status", THROWING_BALL);
          JSONObject bowlingScene = new JSONObject();
          bowlingScene.put("status", BowlingStatus.WAITING_FOR_MOBILE.getState());
          bowlingScene.put("username", username);
          bowlingScene.put("scorearray", scoreArray);
          bowlingScene.put("currentframe", 1);
          bowlingScene.put("totalscore", 0);
          bowlingScene.put("joinnumber", Constant.JOINNUMBER);
          bowlingScene.put("currentorder", Constant.current_order);
          String currentUserName = Constant.USERArray[Constant.current_order].getUsername();
          bowlingScene.put("currrentusername", currentUserName);
          Constant.Connection.sendMessage(bowlingScene.toString());
        }
      } else {
        responsejson.put("status", NA_STATE);
      }

      response.setContentType("text/json;charset=utf-8");
      byte[] bytes = responsejson.toString().getBytes("utf-8");
      response.setContentLength(bytes.length);
      response.getOutputStream().write(bytes);
    } catch (JSONException e) {
      e.printStackTrace();
    }

  }

 
}
