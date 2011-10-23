package com.bowling.login;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.json.JSONObject;
import com.bowling.util.Constant;
import com.bowling.util.Util;
import com.bowling.login.User.UserState;

public class LoginServlet extends HttpServlet {

  private static final long serialVersionUID = 1L;

  public void doPost(HttpServletRequest request, HttpServletResponse response) {
    try {
      JSONObject polluser = new JSONObject();
      String loginjson = Util.getBody(request);
      JSONObject loginJsonObject = new JSONObject(loginjson);
      if (Constant.Connection == null) {
        polluser.put("status", String.valueOf(UserState.NA_STATE.getState()));
      } else if (Constant.NUMBERCOUNT == 0 && Constant.JOINNUMBER == 0) {
        // first user join
        Constant.JOINNUMBER++;
        polluser.put("status", String.valueOf(UserState.BECOME_MASTER.getState()));
        polluser.put("order", "1");
        polluser.put("login_id", "1");
        polluser.put("score", 0);
        polluser.put("scorearray", new int[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0});
        polluser.put("isThrowingBall", true);
        polluser.put("total", 0);
        polluser.put("joinnumber", Constant.JOINNUMBER);
        polluser.put("numbercount", Constant.NUMBERCOUNT);

      } else if (Constant.NUMBERCOUNT == 0 && Constant.JOINNUMBER != 0) {
        // wait for master to choose player number
        polluser.put("status", String.valueOf(UserState.WAITING_FOR_MASTER.getState()));
      } else if (Constant.NUMBERCOUNT != 0 && Constant.JOINNUMBER < Constant.NUMBERCOUNT) {
        // other players join
        Constant.JOINNUMBER++;
        polluser.put("status", String.valueOf(UserState.JOINED_GAME.getState()));
        polluser.put("order", Constant.JOINNUMBER);
        polluser.put("login_id", Constant.JOINNUMBER);
        polluser.put("score", 0);
        polluser.put("scorearray", new int[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0});
        polluser.put("isThrowingBall", true);
        polluser.put("total", 0);
        polluser.put("joinnumber", Constant.JOINNUMBER);
        polluser.put("numbercount", Constant.NUMBERCOUNT);
        
        User user = new User();
        String username = loginJsonObject.getString("username");
        int[] scoreArray = new int[Constant.ROUNDS];
        user.setUsername(username);
        user.setScorearray(scoreArray);
        user.setCurrentFrame(0);
        Constant.USERArray[Constant.JOINNUMBER] = user;
        
        JSONObject bowlingScene = new JSONObject();
        
        bowlingScene.put("username", username);
        bowlingScene.put("numbercount", Constant.NUMBERCOUNT);
        bowlingScene.put("joinnumber", Constant.JOINNUMBER);
        bowlingScene.put("scorearray", scoreArray);
        bowlingScene.put("totalscore", 0);
        
        if (Constant.JOINNUMBER < Constant.NUMBERCOUNT) {
          bowlingScene.put("status", BowlingStatus.WAITING_FOR_PLAYERS.getState());
          Constant.Connection.sendMessage(bowlingScene.toString());
        } else {
          // Constant.JOINNUMBER == Constant.NUMBERCOUNT
          bowlingScene.put("status", BowlingStatus.WAITING_FOR_MOBILE.getState());
          bowlingScene.put("currentorder", Constant.current_order);
          String currentUserName = Constant.USERArray[Constant.current_order].getUsername();
          bowlingScene.put("currrentusername", currentUserName);
          Constant.Connection.sendMessage(bowlingScene.toString());  
        }

      } else if (Constant.NUMBERCOUNT != 0 && Constant.JOINNUMBER == Constant.NUMBERCOUNT) {
        // game is full
        polluser.put("status", String.valueOf(UserState.Full_GAME.getState()));
      }

      byte[] bytes = polluser.toString().getBytes("utf-8");
      response.setContentLength(bytes.length);
      response.setContentType("text/json;charset=utf-8");
      response.getOutputStream().write(bytes);
    } catch (JSONException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (UnsupportedEncodingException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }


}
