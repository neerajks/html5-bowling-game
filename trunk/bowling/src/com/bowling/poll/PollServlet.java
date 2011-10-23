package com.bowling.poll;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.BowlingStatus;
import com.bowling.login.User;
import com.bowling.login.User.UserState;
import com.bowling.util.Constant;
import com.bowling.util.Util;

public class PollServlet extends HttpServlet {

  /**
	 * 
	 */
  private static final long serialVersionUID = 1L;

  public void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

    String jsonpoll = Util.getBody(request);
    JSONObject polluser = new JSONObject();
    try {
      if (Constant.Connection != null) {
        JSONObject pollJsonObject = new JSONObject(jsonpoll);
        String THROWING_BALL = String.valueOf(UserState.THROWING_BALL.getState());
        String WAITING_FOR_SCORE = String.valueOf(UserState.WAITING_FOR_SCORE.getState());

        String status = pollJsonObject.getString("status");
        int order = Integer.parseInt(pollJsonObject.getString("order"));
        User user = Constant.USERArray[order];
        if (user != null) {
          if (status.compareTo(THROWING_BALL) == 0) {
            String ax = pollJsonObject.getString("ax");
            String ay = pollJsonObject.getString("ay");

            JSONObject bowlingScene = new JSONObject();
            bowlingScene.put("ax", ax);
            bowlingScene.put("ay", ay);
            bowlingScene.put("order", order);
            bowlingScene.put("status", BowlingStatus.THROWING_BALL.getState());
            bowlingScene.put("currentframe", user.getCurrentFrame());
            bowlingScene.put("currentusername", user.getUsername());
            
            int nextOrder = order + 1;
            if (nextOrder > Constant.NUMBERCOUNT) nextOrder = 1;
            User nextUser = Constant.USERArray[nextOrder];
            bowlingScene.put("nextusername", nextUser.getUsername());
            Constant.Connection.sendMessage(bowlingScene.toString());
            polluser.put("status", String.valueOf(UserState.WAITING_FOR_SCORE.getState()));
          } else if (status.compareTo(WAITING_FOR_SCORE) == 0) {
            if (user.isGetNewScore()) {
              polluser.put("totalscore", user.getTotalScore());
              polluser.put("currentframe", user.getCurrentFrame());
              polluser.put("rounds", Constant.ROUNDS);
              polluser.put("status", String.valueOf(UserState.WAITING_THROWING.getState()));
              Constant.current_order++;
              if (Constant.current_order > Constant.NUMBERCOUNT) {
                Constant.current_order = 1;
              }
              user.setNewScore(false);
            } else {
              polluser.put("status", String.valueOf(UserState.WAITING_FOR_SCORE.getState()));
            }
          }
        } else {
          polluser.put("status", String.valueOf(UserState.NA_STATE.getState()));
        }
      } else {
        polluser.put("status", String.valueOf(UserState.NA_STATE.getState()));
      }

      byte[] bytes = polluser.toString().getBytes("utf-8");
      response.setContentLength(bytes.length);
      response.setContentType("text/json;charset=utf-8");
      response.getOutputStream().write(bytes);

    } catch (JSONException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

  }

}
