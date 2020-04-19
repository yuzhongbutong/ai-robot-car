package com.ai.robot.controller;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.boot.configurationprocessor.json.JSONTokener;
import org.springframework.stereotype.Component;

import com.ai.robot.common.MqttPushClient;
import com.ai.robot.common.RobotConstant;
import com.ai.robot.service.VoiceService;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;

@Component
public class SocketHandlerController {

	@Autowired
	private MqttPushClient mqttPushClient;

	@Autowired
	@Qualifier("iflytekVoiceServiceImpl")
	private VoiceService voiceService;

	private static List<SocketIOClient> clients = new ArrayList<SocketIOClient>();

	@OnConnect
	public void onConnect(SocketIOClient socketIOClient) throws MqttException {
		clients.add(socketIOClient);
		mqttPushClient.subscribe(RobotConstant.MQTT_TOPIC_HT, new MqttCallback() {

			@Override
			public void messageArrived(String topic, MqttMessage message) throws Exception {
				clients.removeIf(client -> !client.isChannelOpen());
				clients.forEach(client -> {
					client.sendEvent(RobotConstant.SOCKET_EVENT_HT, new String(message.getPayload()));
				});
			}

			@Override
			public void deliveryComplete(IMqttDeliveryToken token) {
				System.out.println("Delivery completed.");
			}

			@Override
			public void connectionLost(Throwable cause) {
				System.out.println("Connection lost.");
			}
		});
	}

	@OnDisconnect
	public void onDisconnect(SocketIOClient socketIOClient) {
		clients.remove(socketIOClient);
	}

	@OnEvent(value = RobotConstant.SOCKET_EVENT_CAR)
	public void onEventCar(SocketIOClient socketIOClient, AckRequest ackRequest, String data)
			throws MqttPersistenceException, MqttException {
		mqttPushClient.publish(RobotConstant.MQTT_TOPIC_CAR, data);
	}

	@OnEvent(value = RobotConstant.SOCKET_EVENT_AUDIO)
	public void onEventAudio(SocketIOClient socketIOClient, AckRequest ackRequest, byte[] data) throws JSONException {
		String strResult = this.voiceService.getTextByAudio(data);
		JSONObject result = new JSONObject(strResult);
		String text = result.getString("data");
		JSONObject payload = new JSONObject();
		if (text == null || "".equals(text)) {
			payload.put("statusCode", 500);
			payload.put("error", result.getString("desc"));
		} else {
			payload.put("statusCode", 200);
			payload.put("text", text);
		}
		socketIOClient.sendEvent(RobotConstant.SOCKET_EVENT_AUDIO, payload.toString());
	}

	@OnEvent(value = RobotConstant.SOCKET_EVENT_ANALYZER)
	public void onEventAnalyzer(SocketIOClient socketIOClient, AckRequest ackRequest, String inputText)
			throws JSONException {
		JSONObject analyzer = new JSONObject();
		JSONObject command = new JSONObject();
		analyzer.put("command", command);
		String strResult = this.voiceService.getAnswerByAnalyzer(inputText);
		if (strResult != null && !strResult.isEmpty()) {
			JSONObject result = new JSONObject(strResult);
			JSONArray dataArray = result.getJSONArray("data");
			if (dataArray != null && !dataArray.isNull(0)) {
				JSONObject data = dataArray.getJSONObject(0);
				if (data != null && !data.isNull("intent")) {
					JSONObject intent = data.getJSONObject("intent");
					if (intent != null) {
						if (!intent.isNull("answer")) {
							JSONObject answer = intent.getJSONObject("answer");
							if (answer != null && !answer.isNull("text")) {
								analyzer.put("text", answer.getString("text"));
							}
						}
						if (!intent.isNull("semantic")) {
							String strSemantic = intent.getString("semantic");
							Object objSemantic = new JSONTokener(strSemantic).nextValue();
							if (objSemantic instanceof JSONObject) {
								JSONObject semantic = (JSONObject) objSemantic;
								if (semantic != null && !semantic.isNull("slots")) {
									JSONObject slots = semantic.getJSONObject("slots");
									if (slots != null && !slots.isNull("attrValue")) {
										command.put("music", slots.getString("attrValue"));
									}
								}
							}
						}
					}
				}
			}
		}
		socketIOClient.sendEvent(RobotConstant.SOCKET_EVENT_ANALYZER, analyzer.toString());
	}
}
