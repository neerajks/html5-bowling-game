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
      String[] nameandsocre=getUsersRank();
      Constant.resetConstant();
      
      JSONObject bowlingScene = new JSONObject();
      try {
    	bowlingScene.put("winer", nameandsocre);
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
  
  public String[] getUsersRank(){
	  String nameandsocre[]=new String[]{"",""};
	  int winsocre=0;
	  for(int i=1;i<=Constant.NUMBERCOUNT;i++){
		  if(Constant.USERArray[i].getTotalScore()>winsocre){
			  winsocre=Constant.USERArray[i].getTotalScore();
			  nameandsocre[0]=Constant.USERArray[i].getUsername();
			  nameandsocre[1]=String.valueOf(Constant.USERArray[i].getTotalScore());
		  }else if(Constant.USERArray[i].getTotalScore()==winsocre){
			  nameandsocre[0]+=(","+Constant.USERArray[i].getUsername());
		  }
	  }
	  return nameandsocre;
  }
}
