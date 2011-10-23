package com.bowling.login;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.util.Constant;
import com.bowling.util.Util;
import com.bowling.login.User.UserState;

public class Checkuserstatus extends HttpServlet {

  public void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

    JSONObject loginJsonObject;

    String loginjson = Util.getBody(request);

    try {

      loginJsonObject = new JSONObject(loginjson);
      JSONObject responsejson = new JSONObject();
      // setUserStatus();
      if (loginJsonObject.isNull("status")) {
        System.out.println(loginjson);
      }
      String status = loginJsonObject.getString("status");
      String WAITING_FOR_OTHERS = String.valueOf(UserState.WAITING_FOR_OTHERS.getState());
      String WAITING_THROWING = String.valueOf(UserState.WAITING_THROWING.getState());
      String THROWING_BALL = String.valueOf(UserState.THROWING_BALL.getState());
      String NA_STATE = String.valueOf(UserState.NA_STATE.getState());
      String GAME_END = String.valueOf(UserState.GAME_END.getState());
      String SHOW_RESULTS = String.valueOf(UserState.SHOW_RESULTS.getState());

      int order = loginJsonObject.getInt("order");
      if (Constant.Connection != null) {
        if (status.compareTo(WAITING_FOR_OTHERS) == 0) {
          if (Constant.JOINNUMBER < Constant.NUMBERCOUNT) {
            responsejson.put("status", WAITING_FOR_OTHERS);
          } else if (Constant.JOINNUMBER == Constant.NUMBERCOUNT) {
            if (order != Constant.current_order) {
              //
              responsejson.put("status", WAITING_THROWING);
            } else {
              responsejson.put("status", THROWING_BALL);
            }
          }
        } else if (status.compareTo(WAITING_THROWING) == 0) {
          if (order != Constant.current_order) {
            responsejson.put("status", WAITING_THROWING);
          } else {
            responsejson.put("status", THROWING_BALL);
          }
        } else if (status.compareTo(GAME_END) == 0) {
          responsejson.put("status", GAME_END);

          int len = Constant.NUMBERCOUNT;
          String s = SHOW_RESULTS;

          for (int i = 0; i < len; i++) {
            User user = Constant.USERArray[i + 1];
            if (user == null) {
              responsejson.put("status", NA_STATE);
            } else {
              if (user.currentFrame != Constant.ROUNDS) {
                s = GAME_END;
                break;
              }
            }
          }

          responsejson.put("status", s);
          if (s == SHOW_RESULTS) {
            if (this.isWin(order)) {
              responsejson.put("overallresult", "win");  
            } else {
              responsejson.put("overallresult", "lose");
            }
            
          }
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

  public boolean isWin(int order) {
    int current_user_score = Constant.USERArray[order].totalScore;
    for (int i = 1 ; i <= Constant.NUMBERCOUNT; i ++) {
      if (i != order ) {
        int another_user_score = Constant.USERArray[i].totalScore;
        if (current_user_score < another_user_score) {
          return false;
        }
      }
    }
    return true;
  }
}
