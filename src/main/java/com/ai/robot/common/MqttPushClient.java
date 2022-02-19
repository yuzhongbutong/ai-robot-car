package com.ai.robot.common;

import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.eclipse.paho.client.mqttv3.MqttSecurityException;
import org.eclipse.paho.client.mqttv3.MqttTopic;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.stereotype.Component;

import io.github.cdimascio.dotenv.Dotenv;

@Component
public class MqttPushClient {

	private Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
	private static MqttClient client;

	public MqttClient getClient() {
		return client;
	}

	public static void setClient(MqttClient client) {
		MqttPushClient.client = client;
	}

	public void connect() throws MqttSecurityException, MqttException {
		String uri = null;
		String userName = null;
		String password = null;
		String clientId = null;
		String clientType = this.dotenv.get("MQTT_CLIENT_TYPE", RobotConstant.MQTT_CLIENT_TYPE_INTERNAL);
		if (RobotConstant.MQTT_CLIENT_TYPE_INTERNAL.equals(clientType)) {
			uri = this.dotenv.get("MQTT_INTERNAL_ADDRESS");
			userName = this.dotenv.get("MQTT_INTERNAL_USERNAME");
			password = this.dotenv.get("MQTT_INTERNAL_PASSWORD", "");
			clientId = RobotConstant.MQTT_CLIENT_ID;
		} else if (RobotConstant.MQTT_CLIENT_TYPE_WATSON.equals(clientType)) {
			String orgId = this.dotenv.get("MQTT_WATSON_ORG_ID");
			uri = String.format(RobotConstant.MQTT_WATSON_URI, orgId);
			userName = "a-" + orgId + "-" + this.dotenv.get("MQTT_WATSON_USERNAME");
			password = this.dotenv.get("MQTT_WATSON_PASSWORD", "");
			clientId = "a:" + orgId + ":" + RobotConstant.MQTT_CLIENT_ID;
		}
		MqttClient client = new MqttClient(uri, clientId, new MemoryPersistence());
		setClient(client);
		MqttConnectOptions options = new MqttConnectOptions();
		options.setCleanSession(true);
		options.setUserName(userName);
		options.setPassword(password.toCharArray());
		options.setConnectionTimeout(1000);
		options.setKeepAliveInterval(2000);
		client.connect(options);
	}

	public void publish(String strTopic, String pushMessage) throws MqttPersistenceException, MqttException {
		publish(RobotConstant.MQTT_DEFAULT_QOS, false, strTopic, pushMessage);
	}

	public void publish(int qos, boolean retained, String strTopic, String pushMessage)
			throws MqttPersistenceException, MqttException {
		MqttMessage message = new MqttMessage();
		message.setQos(qos);
		message.setRetained(retained);
		message.setPayload(pushMessage.getBytes());
		MqttTopic topic = client.getTopic(strTopic);
		MqttDeliveryToken token = topic.publish(message);
		token.waitForCompletion();
	}

	public void subscribe(String strTopic, MqttCallback callback) throws MqttException {
		subscribe(strTopic, RobotConstant.MQTT_DEFAULT_QOS, callback);
	}

	public void subscribe(String strTopic, int qos, MqttCallback callback) throws MqttException {
		client.setCallback(callback);
		client.subscribe(strTopic, qos);
	}
}
