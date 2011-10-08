package com.bowling.websocket;

import org.json.JSONException;
import org.json.JSONObject;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String str="{\"action\":\"action\"}";
		try {
			JSONObject a=new JSONObject(str);
			System.out.print(a.getString("action"));
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
