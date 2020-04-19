package com.ai.robot.service.impl;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Service;

import com.ai.robot.service.VoiceService;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class IflytekVoiceServiceImpl implements VoiceService {

	private Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

	@Override
	public String getTextByAudio(byte[] data) {
		String result = null;
		try {
			Map<String, String> header = buildIATHeader();
			String audioBase64 = new String(Base64.encodeBase64(data), "UTF-8");
			result = httpIATPost(this.dotenv.get("IFLYTEK_IAT_URL"), header, "audio=" + URLEncoder.encode(audioBase64, "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return result;
	}

	private Map<String, String> buildIATHeader() throws UnsupportedEncodingException {
		String curTime = System.currentTimeMillis() / 1000L + "";
		String param = "{\"aue\":\"" + this.dotenv.get("IFLYTEK_IAT_AUE") + "\"" + ",\"engine_type\":\""
				+ this.dotenv.get("IFLYTEK_IAT_ENGINE_TYPE") + "\"" + ",\"vad_eos\":\""
				+ this.dotenv.get("IFLYTEK_IAT_VAD_EOS") + "\"}";
		String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
		String checkSum = DigestUtils.md5Hex(this.dotenv.get("IFLYTEK_IAT_API_KEY") + curTime + paramBase64);
		Map<String, String> header = new HashMap<String, String>();
		header.put("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
		header.put("X-Param", paramBase64);
		header.put("X-CurTime", curTime);
		header.put("X-CheckSum", checkSum);
		header.put("X-Appid", this.dotenv.get("IFLYTEK_IAT_APP_ID"));
		return header;
	}

	private String httpIATPost(String url, Map<String, String> header, String body) {
		String result = "";
		BufferedReader in = null;
		PrintWriter out = null;
		try {
			URL realUrl = new URL(url);
			URLConnection connection = realUrl.openConnection();
			HttpURLConnection httpURLConnection = (HttpURLConnection) connection;
			for (String key : header.keySet()) {
				httpURLConnection.setRequestProperty(key, header.get(key));
			}
			httpURLConnection.setDoOutput(true);
			httpURLConnection.setDoInput(true);
			out = new PrintWriter(httpURLConnection.getOutputStream());
			out.print(body);
			out.flush();
			if (HttpURLConnection.HTTP_OK != httpURLConnection.getResponseCode()) {
				System.out.println("HTTP request failed, status code： " + httpURLConnection.getResponseCode());
				return null;
			}
			in = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			return null;
		}
		return result;
	}

	@Override
	public String getAnswerByAnalyzer(String inputText) {
		// this.getFile(data, "audio", System.currentTimeMillis() + ".wav");
		String result = null;
		try {
			Map<String, String> header = buildAIUIHeader();
			result = httpAIUIPost(this.dotenv.get("IFLYTEK_AIUI_URL"), header, inputText.getBytes());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return result;
	}

	private Map<String, String> buildAIUIHeader() throws UnsupportedEncodingException {
		String curTime = System.currentTimeMillis() / 1000L + "";
		String param = "{\"aue\":\"" + this.dotenv.get("IFLYTEK_AIUI_AUE") + "\",\"sample_rate\":\""
				+ this.dotenv.get("IFLYTEK_AIUI_SAMPLE_RATE") + "\",\"auth_id\":\""
				+ this.dotenv.get("IFLYTEK_AIUI_AUTH_ID") + "\",\"data_type\":\""
				+ this.dotenv.get("IFLYTEK_AIUI_DATA_TYPE") + "\",\"scene\":\"" + this.dotenv.get("IFLYTEK_AIUI_SCENE")
				+ "\"}";
		String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
		String checkSum = DigestUtils.md5Hex(this.dotenv.get("IFLYTEK_AIUI_API_KEY") + curTime + paramBase64);

		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Param", paramBase64);
		header.put("X-CurTime", curTime);
		header.put("X-CheckSum", checkSum);
		header.put("X-Appid", this.dotenv.get("IFLYTEK_AIUI_APP_ID"));
		return header;
	}

	private String httpAIUIPost(String url, Map<String, String> header, byte[] body) {
		String result = "";
		BufferedReader in = null;
		OutputStream out = null;
		try {
			java.net.URL realUrl = new java.net.URL(url);
			HttpURLConnection connection = (HttpURLConnection) realUrl.openConnection();
			for (String key : header.keySet()) {
				connection.setRequestProperty(key, header.get(key));
			}
			connection.setDoOutput(true);
			connection.setDoInput(true);
			out = connection.getOutputStream();
			out.write(body);
			out.flush();
			in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public void getFile(byte[] bfile, String filePath, String fileName) {
		BufferedOutputStream bos = null;
		FileOutputStream fos = null;
		File file = null;
		try {
			File dir = new File(filePath);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			file = new File(filePath + "\\" + fileName);
			fos = new FileOutputStream(file);
			bos = new BufferedOutputStream(fos);
			bos.write(bfile);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
	}
}
