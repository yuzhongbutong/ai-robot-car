package com.ai.robot.common;

public class RobotConstant {
	public final static String WALK_FORWARD = "F";
	public final static String WALK_BACKWARD = "B";
	public final static String WALK_LEFTWARD = "L";
	public final static String WALK_RIGHTWARD = "R";

	public final static String MQTT_TOPIC_CAR = "mqtt/car";
	public final static String MQTT_TOPIC_HT = "mqtt/ht";
	public final static String MQTT_CLIENT_ID = "pc-client-1001";
	public final static int MQTT_DEFAULT_QOS = 2; // 保证消息能到达一次

	public final static String SOCKET_EVENT_HT = "ht";
	public final static String SOCKET_EVENT_CAR = "car";
	public final static String SOCKET_EVENT_AUDIO = "audio";
	public final static String SOCKET_EVENT_ANALYZER = "analyzer";
}
