package com.ai.robot.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.SocketIOServer;

@Component
@Order(value = 1)
public class RobotCommandLineRunner implements CommandLineRunner {
	
	private final SocketIOServer socketIOServer;
	
	@Autowired
	public RobotCommandLineRunner(SocketIOServer socketIOServer) {
		this.socketIOServer = socketIOServer;
	}

	@Override
	public void run(String... args) throws Exception {
		socketIOServer.start();
	}

}
