package com.ai.robot;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttSecurityException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ai.robot.common.MqttPushClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner;

@SpringBootApplication
@Configuration
public class SpringbootApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootApplication.class, args);
	}

	@Bean
	public SocketIOServer socketIOServer() {
		com.corundumstudio.socketio.Configuration configuration = new com.corundumstudio.socketio.Configuration();
		configuration.setPort(8990);
		configuration.setMaxFramePayloadLength(55536 * 10);
		final SocketIOServer socketIOServer = new SocketIOServer(configuration);
		return socketIOServer;
	}

	@Bean
	public MqttPushClient getMqttPushClient() throws MqttSecurityException, MqttException {
		MqttPushClient mqttPushClient = new MqttPushClient();
		mqttPushClient.connect();
		return mqttPushClient;
	}

	@Bean
	public SpringAnnotationScanner springAnnotationScanner(SocketIOServer socketIOServer) {
		return new SpringAnnotationScanner(socketIOServer);
	}
}
