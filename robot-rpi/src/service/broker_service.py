# !/usr/bin/python
# coding:utf-8
# @Author : Joey

import json
import logging
import random
import threading
import time
from os import getenv
import paho.mqtt.client as mqtt
from flask import current_app
from src.config import settings as config

####################
is_rpi_device = getenv('RPI_DEVICE') != 'false'
if is_rpi_device:
    from src.components.car import Car
    from src.components.buzzer import Buzzer
    from src.components.humiture import Humiture
    from src.components.ultrasonic import Ultrasonic
####################


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

        ####################
        if is_rpi_device:
            self.__my_car = Car(config.GPIO_CAR)
            self.__my_humiture = Humiture(config.GPIO_DHT11)
            self.__my_buzzer = Buzzer(config.GPIO_BUZZER)
            self.__my_ultrasonic = Ultrasonic(config.GPIO_HC)
        ####################

    def __on_connect(self, client, userdata, flags, rc):
        topic = config.MQTT_WATSON_TOPIC.format(
            event=config.MQTT_WATSON_EVENT_CONTROL)
        logging.debug('[on_connect]Topic=%s' % topic)
        client.subscribe(topic)

    def __on_subscribe(self, client, userdata, mid, granted_qos):
        logging.debug('[on_subscribe]qos=%d' % granted_qos)

    def __on_message(self, client, userdata, msg):
        payload = msg.payload.decode('utf-8')
        logging.debug('[on_message]Topic=%s, Message=%s' %
                      (msg.topic, payload))

        ####################
        if is_rpi_device:
            data = json.loads(payload)
            if 'car' in data:
                self.__my_car.move_car(data['car']['direction'], self.__my_ultrasonic, self.__my_buzzer)
        ####################

        client_type = client._userdata['client_type']
        data = {
            'client_type': client_type,
            'message_type': config.SOCKET_TYPE_RECEIVE,
            'topic': msg.topic,
            'payload': payload
        }
        self.__socketio.emit(config.SOCKET_EVENT_MESSAGE,
                             data, namespace=config.SOCKET_NAMESPACE)

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
                    self.__collect_humiture()
                    return True
        except Exception as e:
            print(e)
            pass
        return False

    def __collect_humiture(self):
        def test_humiture():
            temperature = random.randint(15, 35)
            humidity = random.randint(35, 90)
            return {'temp': temperature, 'humi': humidity}
            
        def execute_collect():
            ####################
            if is_rpi_device:
                ht_data = self.__my_humiture.get_humiture()
            ####################
            
            ####################
            if not is_rpi_device:
                ht_data = test_humiture()
            ####################
            if ht_data is not None:
                topic = config.MQTT_WATSON_TOPIC.format(event=config.MQTT_WATSON_EVENT_HUMITURE)
                self.publish(topic, json.dumps(ht_data))
                timer = threading.Timer(5, execute_collect)
                timer.start()
        global timer
        timer = threading.Timer(5, execute_collect)
        timer.start()

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
