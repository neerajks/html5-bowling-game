package com.bowling.websocket;

import java.io.IOException;

import org.eclipse.jetty.websocket.WebSocket;
import org.json.JSONException;
import org.json.JSONObject;

import com.bowling.login.User;
import com.bowling.util.Constant;

public class ChatWebSocket implements WebSocket.OnTextMessage

{
  WebSocket.Connection _connection;

  public ChatWebSocket() {
  }

  public void onOpen(final WebSocket.Connection connection) {
    this._connection = connection;
    System.out.println("onopen");
    Constant.Connection = connection;
    try {
      this._connection.sendMessage("connect");
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }

  public void onMessage(final byte frame, final byte[] data, final int offset, final int length) {
  }

  public void onMessage(final String data) {
    if (!data.equals("connect")) {
      try {
        JSONObject jsonObject = new JSONObject(data);
        System.out.println(jsonObject);
        int order = Integer.parseInt(jsonObject.getString("order"));
        int score = jsonObject.getInt("score");
        User user = Constant.USERArray[order];
        user.scorearray[user.currentFrame] = score;
        user.totalScore += score;
        user.currentFrame ++;
        user.setNewScore(true);
        
      } catch (JSONException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
    }
 

  }

  /*public void send(JSONObject a) {
    try {
      if (Constant.user1 != null) {
        a = new JSONObject();
        a = beantoJson(Constant.user1, a);
        this._connection.sendMessage(a.toString());
      }
      if (Constant.user2 != null) {
        a = new JSONObject();
        a = beantoJson(Constant.user2, a);
        this._connection.sendMessage(a.toString());
      }
      if (Constant.user3 != null) {
        a = new JSONObject();
        a = beantoJson(Constant.user3, a);
        this._connection.sendMessage(a.toString());
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }*/

  public void onClose(final int code, final String message) {

  }

  public JSONObject beantoJson(User u, JSONObject json) throws JSONException {
    json.put("username", u.getUsername());
    json.put("login_id", u.getLoginid());
    json.put("status", u.getStatus());
    json.put("order", u.getOrder());
    json.put("score", u.getTotalScore());
    json.put("total", u.getCurrentFrame());
    json.put("scorearray", u.getScorearray());
    return json;

  }

}
