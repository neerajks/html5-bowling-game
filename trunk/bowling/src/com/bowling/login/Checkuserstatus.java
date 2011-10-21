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

  private enum UserAction {
    WAITING_FOR_OTHERS("waitingForOthers");

    private String value;

    // Constructor
    UserAction(String s) {
      value = s;
    };

    String getValue() {
      return value;
    };
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

    User user = null;
    JSONObject loginJsonObject;
    String message = null;

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

    /*
     * if(user!=null){ responsejson.put("username", user.getUsername());
     * responsejson.put("login_id", user.getLoginid());
     * responsejson.put("status", user.getStatus()); responsejson.put("order",
     * user.getOrder()); responsejson.put("iscomplete",
     * Constant.isThrowingBall); responsejson.put("iscreate",
     * Constant.iscreate); responsejson.put("joinnumber", Constant.JOINNUMBER);
     * responsejson.put("numbercount", Constant.NUMBERCOUNT);
     * responsejson.put("total", user.getTotal()); responsejson.put("score",
     * user.getScore()); responsejson.put("pollusername",
     * Constant.pollusername);
     * 
     * }else{ message=checkUserStatus(message); responsejson.put("message",
     * message); responsejson.put("joinnumber", Constant.JOINNUMBER);
     * responsejson.put("numbercount", Constant.NUMBERCOUNT);
     * 
     * }
     * 
     * 
     * gameEnd(); if(Constant.ISEND && !Constant.ISRESTART){
     * sendMessageToClient(response,loginJsonObject); sendMessageToView(); }else
     * if(Constant.ISRESTART){ sendMessageToClient(response,loginJsonObject);
     * sendMessageToView(); } GameStart(responsejson.toString()); byte[] bytes =
     * responsejson.toString().getBytes("utf-8");
     * response.setContentLength(bytes.length);
     * response.getOutputStream().write(bytes); } catch (JSONException e) {
     * e.printStackTrace(); }
     */
  }

  public void gameEnd() {

    if (Constant.NUMBERCOUNT == 1) {
      System.out.print(Constant.user1.currentFrame);
      if (Constant.user1 != null && Constant.user1.currentFrame == Constant.ROUNDS) {
        Constant.ISEND = true;

      } else if (Constant.user2 != null && Constant.user2.currentFrame == Constant.ROUNDS) {
        Constant.ISEND = true;

      } else if (Constant.user3 != null && Constant.user3.currentFrame == Constant.ROUNDS) {
        Constant.ISEND = true;

      }
    } else if (Constant.NUMBERCOUNT == 2 && !Constant.sendflag) {
      if (Constant.user3 != null && Constant.user3.currentFrame == Constant.ROUNDS) {
        Constant.ISEND = true;

      } else if (Constant.user2 != null && Constant.user2.currentFrame == Constant.ROUNDS) {
        Constant.ISEND = true;

      }
    } else if (Constant.user3 != null && Constant.NUMBERCOUNT == 3
        && Constant.user3.currentFrame == Constant.ROUNDS) {
      Constant.ISEND = true;
    }

  }

  public void sendMessageToClient(HttpServletResponse response, JSONObject b) throws JSONException,
      IOException {
    JSONObject a = new JSONObject();;
    User user = null;
    String username = "";
    if (!b.isNull("username"))
      username = b.getString("username");
    user = returnWin(user, username);
    if (Constant.ISEND) {
      Constant.sendflag = false;
      // beantoJson(user,a);
      a.put("win", username);
      a.put("username", username);
      a.put("message", "gameend");
    }
    if (Constant.ISRESTART) {
      Constant.ISEND = false;
      Constant.sendflag = false;
      a.put("message", "restart");
    }
    byte[] bytes = a.toString().getBytes("utf-8");
    response.setContentLength(bytes.length);
    response.getOutputStream().write(bytes);
  }

  public User returnWin(User user, String username) {
    int maxscore = 0;
    if (Constant.user1 != null && username.equals(Constant.user1.username)) {
      maxscore = Constant.user1.totalScore;
      user = Constant.user1;
      return user;
    }
    if (Constant.user2 != null && Constant.user2.totalScore >= maxscore) {
      maxscore = Constant.user2.totalScore;
      user = Constant.user2;
      if (Constant.user3 != null && Constant.user3.totalScore == maxscore
          && username.equals(Constant.user2.getUsername())) {
        Constant.win = user.getUsername();
        return user;
      }
    }
    if (Constant.user3 != null && Constant.user3.totalScore >= maxscore) {
      maxscore = Constant.user3.totalScore;
      user = Constant.user3;
    }
    if (user != null)
      Constant.win = user.getUsername();
    return user;
  }

  public void sendMessageToView() {
    JSONObject a = new JSONObject();
    try {
      if (Constant.ISEND && !Constant.sendflag) {
        a.put("win", Constant.win);
        // a.put("message", "win");
        a.put("message", "end");
        Constant.Connection.sendMessage(a.toString());
        Constant.sendflag = true;
      }
      if (Constant.ISRESTART && !Constant.sendflag) {
        a.put("message", "end");
        Constant.Connection.sendMessage(a.toString());
        Constant.initConst();
      }

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public JSONObject beantoJson(User u, JSONObject json) throws JSONException {
    json.put("username", u.getUsername());
    json.put("login_id", u.getLoginid());
    json.put("status", u.getStatus());
    json.put("order", u.getOrder());
    json.put("score", u.getTotalScore());
    json.put("total", u.getCurrentFrame());
    return json;

  }

  public void GameStart(String data) {
    if (Constant.Connection != null) {

      try {

        JSONObject a = new JSONObject(data);
        if (!a.isNull("username") && "1".equals(a.getString("status"))
            && !Constant.polluser.equals(a.getString("username"))) {
          Constant.polluser = a.getString("username");
          Constant.Connection.sendMessage(a.toString());
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  public String checkUserStatus(String message) {
    if (Constant.JOINNUMBER < Constant.NUMBERCOUNT && Constant.NUMBERCOUNT > 0) {
      return "null";
    } else if (Constant.NUMBERCOUNT == 0) {
      return "null";
    } else {
      return Constant.MESSAGE1;
    }

  }

  public void setUserStatus() {
    if (Constant.JOINNUMBER == Constant.NUMBERCOUNT && Constant.NUMBERCOUNT > 0) {
      if (Constant.user1 != null && Constant.user1.order.equals("1"))
        if ((Constant.user2 != null && !"1".equals(Constant.user2.status))
            && (Constant.user3 != null && !Constant.user3.status.equals("1")))
          Constant.user1.status = "1";
        else if (Constant.NUMBERCOUNT == 2
            && ((Constant.user2 != null && !"1".equals(Constant.user2.status)) || (Constant.user3 != null && !Constant.user3.status.equals("1"))))
          Constant.user1.status = "1";
        else if (Constant.NUMBERCOUNT == 1)
          Constant.user1.status = "1";
        else if (Constant.user2 != null && Constant.user2.order.equals("1"))
          if ((Constant.user3 != null && !"1".equals(Constant.user3.status))
              && (Constant.user1 != null && !Constant.user1.status.equals("1")))
            Constant.user2.status = "1";
          else if (Constant.NUMBERCOUNT == 2
              && ((Constant.user1 != null && !"1".equals(Constant.user1.status)) || (Constant.user3 != null && !Constant.user3.status.equals("1"))))
            Constant.user2.status = "1";
          else if (Constant.NUMBERCOUNT == 1)
            Constant.user2.status = "1";
          else if (Constant.user3 != null && Constant.user3.order.equals("1"))
            if ((Constant.user2 != null && !"1".equals(Constant.user2.status))
                && (Constant.user1 != null && !Constant.user1.status.equals("1")))
              Constant.user3.status = "1";
            else if (Constant.NUMBERCOUNT == 2
                && ((Constant.user1 != null && !"1".equals(Constant.user1.status)) || (Constant.user2 != null && !Constant.user2.status.equals("1"))))
              Constant.user3.status = "1";
            else if (Constant.NUMBERCOUNT == 1)
              Constant.user3.status = "1";
    }
  }
}
