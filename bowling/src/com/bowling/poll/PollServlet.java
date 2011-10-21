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
import com.bowling.websocket.ChatWebSocket;

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
        String WAITING_THROWING = String.valueOf(UserState.WAITING_THROWING.getState());

        String status = pollJsonObject.getString("status");
        int order = Integer.parseInt(pollJsonObject.getString("order"));
        User user = Constant.USERArray[order];
        if (status.compareTo(THROWING_BALL) == 0) {
          String ax = pollJsonObject.getString("ax");
          String ay = pollJsonObject.getString("ay");

          JSONObject bowlingScene = new JSONObject();
          bowlingScene.put("ax", ax);
          bowlingScene.put("ay", ay);
          bowlingScene.put("order", order);
          bowlingScene.put("status", BowlingStatus.THROWING_BALL.getState());
          bowlingScene.put("currentframe", user.getCurrentFrame());
          Constant.Connection.sendMessage(bowlingScene.toString());
          polluser.put("status", String.valueOf(UserState.WAITING_FOR_SCORE.getState()));
        } else if (status.compareTo(WAITING_FOR_SCORE) == 0) {
          if (user != null) {
            if (user.isGetNewScore()) {
              polluser.put("totalscore", user.getTotalScore());
              polluser.put("currentframe", user.getCurrentFrame());
              polluser.put("status", String.valueOf(UserState.WAITING_THROWING.getState()));
              Constant.current_order ++;
              if (Constant.current_order  > Constant.NUMBERCOUNT) {
                Constant.current_order = 1;
              }
              user.setNewScore(false);
            } else {
              polluser.put("status", String.valueOf(UserState.WAITING_FOR_SCORE.getState()));
            }
          }
        } else if (status.compareTo(WAITING_THROWING) == 0) {
          
        }
      } else {
        System.out.println("poll NA_State");
        
        polluser.put("status", String.valueOf(UserState.NA_STATE.getState()));
        System.out.println(polluser);
      }

      byte[] bytes = polluser.toString().getBytes("utf-8");
      response.setContentLength(bytes.length);
      response.setContentType("text/json;charset=utf-8");
      response.getOutputStream().write(bytes);

    } catch (JSONException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }

    /*
     * try{ if(Constant.Connection==null){
     * response.setContentType("text/json;charset=utf-8"); byte[] bytes =
     * ("{\"message\":\""+Constant.MESSAGE2+"\"}").getBytes("utf-8");
     * response.setContentLength(bytes.length);
     * response.getOutputStream().write(bytes); return; } Constant.jsonpoll=new
     * JSONObject(jsonpoll); if(Constant.Connection!=null){
     * Constant.Connection.sendMessage(Constant.jsonpoll.toString()); }
     * 
     * 
     * boolean flag=false; if(Constant.isThrowingBall){ StringBuilder buf = new
     * StringBuilder(); buf.append("{\"username\":\"");
     * buf.append(Constant.jsonpoll.getString("username"));
     * buf.append("\",\"login_id\":\"");
     * buf.append(Constant.jsonpoll.getString("login_id"));
     * buf.append("\",\"status\":\""); if(Constant.user1!=null &&
     * Constant.jsonpoll.getString("username").equals(Constant.user1.username)){
     * buf.append(Constant.user1.status); flag=true; } if(Constant.user2!=null
     * &&
     * Constant.jsonpoll.getString("username").equals(Constant.user2.username)){
     * buf.append(Constant.user2.status); flag=true; } if(Constant.user3!=null
     * &&
     * Constant.jsonpoll.getString("username").equals(Constant.user3.username)){
     * buf.append(Constant.user3.status); flag=true; } if(!flag)
     * buf.append(Constant.jsonpoll.getString("status")); buf.append("\"}");
     * User
     * user=Constant.synchronoususer(Constant.jsonpoll.getString("username"));
     * Constant.timeOut(user);
     * response.setContentType("text/json;charset=utf-8"); byte[] bytes =
     * buf.toString().getBytes("utf-8");
     * response.setContentLength(bytes.length);
     * response.getOutputStream().write(bytes); }else{
     * response.setContentType("text/json;charset=utf-8"); PrintWriter out =
     * response.getWriter(); out.print("{action:\"poll\"}"); } }catch(Exception
     * e){ e.printStackTrace(); }
     */
  }

}
