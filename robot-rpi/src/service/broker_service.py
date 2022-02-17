# !/usr/bin/python
# coding:utf-8
# @Author : Joey

import logging
import time
import paho.mqtt.client as mqtt
from flask import current_app
from src.config import settings as config


def singleton(cls, *args, **kwargs):
    instances = {}

    def _singleton():
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return _singleton

@singleton
class BrokerService:
    def __init__(self):
        self.__client = None
        self.__socketio = current_app.extensions.get('socketio')

    def __on_connect(self, client, userdata, flags, rc):
        topic = config.MQTT_WATSON_TOPIC.format(
            event=config.MQTT_WATSON_EVENT_CONTROL)
        logging.debug('[on_connect]Topic=%s' % topic)
        client.subscribe(topic)

    def __on_subscribe(self, client, userdata, mid, granted_qos):
        logging.debug('[on_subscribe]qos=%d' % granted_qos)

    def __on_message(self, client, userdata, msg):
        payload = str(msg.payload.decode('utf-8'))
        logging.debug('[on_message]Topic=%s, Message=%s' %
                      (msg.topic, payload))
        client_type = client._userdata['client_type']
        data = {
            'client_type': client_type,
            'message_type': config.SOCKET_TYPE_RECEIVE,
            'topic': msg.topic,
            'payload': payload
        }
        self.__socketio.emit(config.SOCKET_EVENT_MESSAGE,
                             data, namespace=config.SOCKET_NAMESPACE)

        self.publish(config.MQTT_WATSON_TOPIC.format(event=config.MQTT_WATSON_EVENT_HUMITURE), '{"aa":1001}')

    def __on_publish(self, client, userdata, mid):
        logging.debug('[on_publish]mid=%s' % mid)

    def __on_disconnect(self, client, userdata, rc):
        logging.debug('[on_disconnect]rc=%s' % rc)

    def connect(self, host, port=1883, userName=None, password=None, client_id=None, user_data=None):
        try:
            client = mqtt.Client(client_id=client_id, userdata=user_data)
            client.username_pw_set(userName, password)
            client.on_connect = self.__on_connect
            client.on_subscribe = self.__on_subscribe
            client.on_message = self.__on_message
            client.on_publish = self.__on_publish
            client.on_disconnect = self.__on_disconnect
            if self.__client and self.__client.is_connected():
                self.__client.disconnect()
                self.__client.loop_stop()
                self.__client = None
            client.connect(host, port)
            client.loop_start()
            while True:
                time.sleep(1)
                if client.is_connected():
                    self.__client = client
                    return True
        except Exception as e:
            print(e)
            pass
        return False

    def get_client_type(self):
        if self.__client and self.__client.is_connected():
            return self.__client._userdata['client_type']
        return None

    def get_client(self):
        if self.__client and self.__client.is_connected():
            return self.__client
        return None

    def publish(self, topic, payload):
        client = self.get_client()
        if client:
            client.publish(topic, payload)
            client_type = client._userdata['client_type']
            data = {
                'client_type': client_type,
                'message_type': config.SOCKET_TYPE_PUBLISH,
                'topic': topic,
                'payload': payload
            }
            self.__socketio.emit(config.SOCKET_EVENT_MESSAGE,
                                 data, namespace=config.SOCKET_NAMESPACE)
