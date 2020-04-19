package com.ai.robot.service;

public interface VoiceService {

	String getTextByAudio(byte[] data);

	String getAnswerByAnalyzer(String inputText);
}
