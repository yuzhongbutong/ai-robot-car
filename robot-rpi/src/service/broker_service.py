import logging
import time
import paho.mqtt.client as mqtt
from flask import current_app
from src.config import settings as config


class BrokerService:    
    def on_connect(self, client, userdata, flags, rc):
        topic = config.MQTT_WATSON_TOPIC.format(event = config.MQTT_WATSON_EVENT_CONTROL)
        logging.debug('[on_connect]Topic=%s' % topic)
        client.subscribe(topic)

    def on_subscribe(self, client, userdata, mid, granted_qos):
        logging.debug('[on_subscribe]qos=%d' % granted_qos)

    def on_message(self, client, userdata, msg):
        logging.debug('[on_message]Topic=%s, Message=%s' % (msg.topic, str(msg.payload.decode('utf-8'))))

    def on_publish(self, client, userdata, mid):
        logging.debug('[on_publish]mid=%s' % mid)

    def on_disconnect(self, client, userdata, rc):
        logging.debug('[on_disconnect]rc=%s' % rc)

    def connect_settings(self, host, port = 1883, userName = None, password = None, client_id = None, user_data = None):
        try:
            client = mqtt.Client(client_id = client_id, userdata = user_data)
            client.username_pw_set(userName, password)
            client.on_connect = self.on_connect
            client.on_subscribe = self.on_subscribe
            client.on_message = self.on_message
            client.on_publish = self.on_publish
            client.on_disconnect = self.on_disconnect
            mqtt_client = current_app.extensions.get('mqtt_client')
            if mqtt_client and mqtt_client.is_connected():
                mqtt_client.disconnect()
                mqtt_client.loop_stop()
                current_app.extensions['mqtt_client'] = None
            client.connect(host, port)
            client.loop_start()
            while True:
                time.sleep(1)
                if client.is_connected():
                    current_app.extensions['mqtt_client'] = client
                    return True
        except Exception as e:
            print(e)
            pass
        return False

    def get_client_type(self):
        mqtt_client = current_app.extensions.get('mqtt_client')
        if mqtt_client and mqtt_client.is_connected():
            return mqtt_client._userdata['client_type']
        return None

    def get_client(self):
        mqtt_client = current_app.extensions.get('mqtt_client')
        if mqtt_client and mqtt_client.is_connected():
            return mqtt_client
        return None