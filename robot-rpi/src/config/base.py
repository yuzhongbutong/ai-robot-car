# !/usr/bin/python
# coding:utf-8
# @Author : Joey

# The SECRET_KEY must be a string of 8 characters.
SECRET_KEY = 'JoeyChou'
TOKEN_SCHEME = 'JWT'
TOKEN_EXPIRE = 1800

DB_NAME = 'robot-rpi.db'
DB_INIT_SCRIPT = 'sql/schema.sql'
SETTINGS_ITEMS_INTERNAL = 'internal'
SETTINGS_ITEMS_WATSON = 'watson'
SETTINGS_ITEMS = [SETTINGS_ITEMS_INTERNAL, SETTINGS_ITEMS_WATSON]

MQTT_CLIENT_ID = 'ai-robot-car-rpi'
MQTT_WATSON_DEVICE_TYPE = 'rpi'
MQTT_WATSON_DEVICE_ID = 'car'
MQTT_WATSON_EVENT_CONTROL = 'control'
MQTT_WATSON_EVENT_HUMITURE = 'humiture'
MQTT_WATSON_TOPIC = 'iot-2/type/' + MQTT_WATSON_DEVICE_TYPE + '/id/' + MQTT_WATSON_DEVICE_ID + '/evt/{event}/fmt/json'

SOCKET_NAMESPACE = '/car'
SOCKET_EVENT_MESSAGE = 'message'
SOCKET_TYPE_PUBLISH = 'publish'
SOCKET_TYPE_RECEIVE = 'receive'

GPIO_CAR = [18, 23, 24, 25, 12, 16, 20, 21]
GPIO_DHT11 = 4
GPIO_BUZZER = 17
GPIO_HC = [27, 22, 5, 6]