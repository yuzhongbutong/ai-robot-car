package com.ai.robot.service;

public interface VoiceService {

	String getTextByAudio(byte[] data) throws Exception;

	String getAnswerByAnalyzer(String inputText);
}
