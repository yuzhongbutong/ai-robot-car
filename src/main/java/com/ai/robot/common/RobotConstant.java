package com.ai.robot.common;

public class RobotConstant {
	public final static String WALK_FORWARD = "F";
	public final static String WALK_BACKWARD = "B";
	public final static String WALK_LEFTWARD = "L";
	public final static String WALK_RIGHTWARD = "R";

	public final static String MQTT_CLIENT_TYPE_INTERNAL = "internal";
	public final static String MQTT_CLIENT_TYPE_WATSON = "watson";
	public final static String MQTT_WATSON_URI = "tcp://%s.messaging.internetofthings.ibmcloud.com";
	public final static String MQTT_WATSON_DEVICE_TYPE = "rpi";
	public final static String MQTT_WATSON_DEVICE_ID = "car";
	public final static String MQTT_WATSON_EVENT_CONTROL = "control";
	public final static String MQTT_WATSON_EVENT_HUMITURE = "humiture";
	public final static String MQTT_WATSON_TOPIC = "iot-2/type/" + MQTT_WATSON_DEVICE_TYPE + "/id/" + MQTT_WATSON_DEVICE_ID + "/evt/%s/fmt/json";
	public final static String MQTT_CLIENT_ID = "ai-robot-car-app";
	public final static int MQTT_DEFAULT_QOS = 2; // 保证消息能到达一次

	public final static String SOCKET_EVENT_HT = "ht";
	public final static String SOCKET_EVENT_CAR = "car";
	public final static String SOCKET_EVENT_AUDIO = "audio";
	public final static String SOCKET_EVENT_ANALYZER = "analyzer";
}
