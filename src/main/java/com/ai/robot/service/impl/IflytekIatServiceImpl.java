package com.ai.robot.service.impl;

import com.ai.robot.service.VoiceService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.github.cdimascio.dotenv.Dotenv;
import okhttp3.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CountDownLatch;

/**
 * @author Joey
 * @version v1.0.0
 * @ClassName IflytekIatServiceImpl
 * @since 2022/2/25 21:11
 **/
@Service
public class IflytekIatServiceImpl implements VoiceService {

    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private static final Gson gson = new Gson();
    private static final int StatusFirstFrame = 0;
    private static final int StatusContinueFrame = 1;
    private static final int StatusLastFrame = 2;
    private Decoder decoder = new Decoder();

    @Override
    public String getTextByAudio(byte[] data) throws MalformedURLException, NoSuchAlgorithmException, InvalidKeyException, InterruptedException {
        String hostUrl = this.dotenv.get("IFLYTEK_IAT_URL");
        String apiKey = this.dotenv.get("IFLYTEK_IAT_API_KEY");
        String apiSecret = this.dotenv.get("IFLYTEK_IAT_API_SECRET");
        String appId = this.dotenv.get("IFLYTEK_IAT_APP_ID");
        String authUrl = getAuthUrl(hostUrl, apiKey, apiSecret);
        OkHttpClient client = new OkHttpClient.Builder().build();
        Request request = new Request.Builder().url(authUrl).build();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        final String[] result = new String[1];
        WebSocket webSocket = client.newWebSocket(request, new WebSocketListener() {
            @Override
            public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
                super.onOpen(webSocket, response);
                if (data != null) {
                    int frameSize = 10240;
                    int interval = 40;
                    int status = 0;
                    byte[] buffer = new byte[frameSize];
                    try (InputStream input = new ByteArrayInputStream(data)) {
                        end:
                        while (true) {
                            int len = input.read(buffer);
                            if (len == -1) {
                                status = StatusLastFrame;
                            }
                            switch (status) {
                                case StatusFirstFrame:
                                    JsonObject frame = new JsonObject();
                                    JsonObject business = new JsonObject();
                                    JsonObject common = new JsonObject();
                                    JsonObject data = new JsonObject();

                                    common.addProperty("app_id", appId);
                                    business.addProperty("language", "en_us");
                                    business.addProperty("language", "zh_cn");
                                    business.addProperty("domain", "iat");
                                    business.addProperty("dwa", "wpgs");
                                    data.addProperty("status", StatusFirstFrame);
                                    data.addProperty("format", "audio/L16;rate=16000");
                                    data.addProperty("encoding", "raw");
                                    data.addProperty("audio", java.util.Base64.getEncoder().encodeToString(Arrays.copyOf(buffer, len)));
                                    frame.add("common", common);
                                    frame.add("business", business);
                                    frame.add("data", data);
                                    webSocket.send(frame.toString());
                                    status = StatusContinueFrame;
                                    break;
                                case StatusContinueFrame:
                                    JsonObject frame1 = new JsonObject();
                                    JsonObject data1 = new JsonObject();
                                    data1.addProperty("status", StatusContinueFrame);
                                    data1.addProperty("format", "audio/L16;rate=16000");
                                    data1.addProperty("encoding", "raw");
                                    data1.addProperty("audio", java.util.Base64.getEncoder().encodeToString(Arrays.copyOf(buffer, len)));
                                    frame1.add("data", data1);
                                    webSocket.send(frame1.toString());
                                    break;
                                case StatusLastFrame:
                                    JsonObject frame2 = new JsonObject();
                                    JsonObject data2 = new JsonObject();
                                    data2.addProperty("status", StatusLastFrame);
                                    data2.addProperty("audio", "");
                                    data2.addProperty("format", "audio/L16;rate=16000");
                                    data2.addProperty("encoding", "raw");
                                    frame2.add("data", data2);
                                    webSocket.send(frame2.toString());
                                    break end;
                            }
                            Thread.sleep(interval);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
                super.onMessage(webSocket, text);
                ResponseData response = gson.fromJson(text, ResponseData.class);
                JsonObject jsonResult = new JsonObject();
                if (response != null) {
                    if (response.getCode() != 0) {
                        JsonObject errorEntity = new JsonObject();
                        int code = response.getCode();
                        errorEntity.addProperty("ErrorCode", code);
                        errorEntity.addProperty("ErrorMessage", response.getMessage());
                        jsonResult.addProperty("error", errorEntity.toString());
                    }
                    if (response.getData() != null) {
                        if (response.getData().getResult() != null) {
                            Text te = response.getData().getResult().getText();
                            decoder.decode(te);
                        }
                        if (response.getData().getStatus() == 2) {
                            jsonResult.addProperty("data", decoder.toString());
                            result[0] = jsonResult.toString();
                            decoder.discard();
                            countDownLatch.countDown();
                        }
                    }
                }
            }

            @Override
            public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @Nullable Response response) {
                super.onFailure(webSocket, t, response);
                JsonObject error = new JsonObject();
                if (response != null) {
                    JsonObject errorEntity = new JsonObject();
                    int code = response.code();
                    errorEntity.addProperty("ErrorCode", code);
                    errorEntity.addProperty("ErrorMessage", response.message());
                    error.addProperty("error", errorEntity.toString());
                } else {
                    error.addProperty("error", "[!!!System Error!!!]");
                }
                result[0] = error.toString();
                countDownLatch.countDown();
            }
        });
        countDownLatch.await();
        webSocket.close(1000, null);
        return result[0];
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

    private String getAuthUrl(String hostUrl, String apiKey, String apiSecret) throws MalformedURLException, NoSuchAlgorithmException, InvalidKeyException {
        URL url = new URL(hostUrl);
        SimpleDateFormat format = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);
        format.setTimeZone(TimeZone.getTimeZone("GMT"));
        String date = format.format(new Date());
        StringBuilder builder = new StringBuilder("host: ")
                .append(url.getHost())
                .append("\n").append("date: ")
                .append(date).append("\n").append("GET ")
                .append(url.getPath()).append(" HTTP/1.1");
        Charset charset = Charset.forName("UTF-8");
        Mac mac = Mac.getInstance("hmacsha256");
        SecretKeySpec spec = new SecretKeySpec(apiSecret.getBytes(charset), "hmacsha256");
        mac.init(spec);
        byte[] hexDigits = mac.doFinal(builder.toString().getBytes(charset));
        String sha = java.util.Base64.getEncoder().encodeToString(hexDigits);
        String authorization = "api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"";
        authorization = String.format(authorization, apiKey, "hmac-sha256", "host date request-line", sha);
        authorization = java.util.Base64.getEncoder().encodeToString(authorization.getBytes(charset));
        HttpUrl httpUrl = HttpUrl.parse("https://" + url.getHost() + url.getPath())
                .newBuilder()
                .addQueryParameter("authorization", authorization)
                .addQueryParameter("date", date)
                .addQueryParameter("host", url.getHost())
                .build();
        String result = httpUrl.toString()
                .replace("http://", "ws://")
                .replace("https://", "wss://");
        return result;
    }

    private Map<String, String> buildAIUIHeader() throws UnsupportedEncodingException {
        String curTime = System.currentTimeMillis() / 1000L + "";
        String param = "{\"aue\":\"raw\",\"sample_rate\":\"16000\",\"auth_id\":\""
                + this.dotenv.get("IFLYTEK_AIUI_AUTH_ID") + "\",\"data_type\":\"text\",\"scene\":\""
                + this.dotenv.get("IFLYTEK_AIUI_SCENE") + "\"}";
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

    // For test
    private void getFile(byte[] bfile, String filePath, String fileName) {
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

    private static class ResponseData {
        private int code;
        private String message;
        private String sid;
        private Data data;

        public int getCode() {
            return code;
        }

        public String getMessage() {
            return this.message;
        }

        public String getSid() {
            return sid;
        }

        public Data getData() {
            return data;
        }
    }

    private static class Data {
        private int status;
        private Result result;

        public int getStatus() {
            return status;
        }

        public Result getResult() {
            return result;
        }
    }

    private static class Result {
        int bg;
        int ed;
        String pgs;
        int[] rg;
        int sn;
        Ws[] ws;
        boolean ls;
        JsonObject vad;

        public Text getText() {
            Text text = new Text();
            StringBuilder sb = new StringBuilder();
            for (Ws ws : this.ws) {
                sb.append(ws.cw[0].w);
            }
            text.sn = this.sn;
            text.text = sb.toString();
            text.sn = this.sn;
            text.rg = this.rg;
            text.pgs = this.pgs;
            text.bg = this.bg;
            text.ed = this.ed;
            text.ls = this.ls;
            text.vad = this.vad == null ? null : this.vad;
            return text;
        }
    }

    private static class Ws {
        Cw[] cw;
        int bg;
        int ed;
    }

    private static class Cw {
        int sc;
        String w;
    }

    private static class Text {
        int sn;
        int bg;
        int ed;
        String text;
        String pgs;
        int[] rg;
        boolean deleted;
        boolean ls;
        JsonObject vad;

        @Override
        public String toString() {
            return "Text{" +
                    "bg=" + bg +
                    ", ed=" + ed +
                    ", ls=" + ls +
                    ", sn=" + sn +
                    ", text='" + text + '\'' +
                    ", pgs=" + pgs +
                    ", rg=" + Arrays.toString(rg) +
                    ", deleted=" + deleted +
                    ", vad=" + (vad == null ? "null" : vad.getAsJsonArray("ws").toString()) +
                    '}';
        }
    }

    private static class Decoder {
        private Text[] texts;
        private int defc = 10;

        public Decoder() {
            this.texts = new Text[this.defc];
        }

        public synchronized void decode(Text text) {
            if (text.sn >= this.defc) {
                this.resize();
            }
            if ("rpl".equals(text.pgs)) {
                for (int i = text.rg[0]; i <= text.rg[1]; i++) {
                    this.texts[i].deleted = true;
                }
            }
            this.texts[text.sn] = text;
        }

        public String toString() {
            StringBuilder sb = new StringBuilder();
            for (Text t : this.texts) {
                if (t != null && !t.deleted) {
                    sb.append(t.text);
                }
            }
            return sb.toString();
        }

        public void resize() {
            int oc = this.defc;
            this.defc <<= 1;
            Text[] old = this.texts;
            this.texts = new Text[this.defc];
            for (int i = 0; i < oc; i++) {
                this.texts[i] = old[i];
            }
        }

        public void discard() {
            for (int i = 0; i < this.texts.length; i++) {
                this.texts[i] = null;
            }
        }
    }
}
