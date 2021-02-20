#!/usr/bin/python
# -*- coding: utf-8 -*-

import RPi.GPIO as gpio
import time


class Humiture:
    def __init__(self, gpio_dht11):
        self._channel = gpio_dht11
        gpio.setmode(gpio.BCM)

    def get_humiture(self):
        data = []
        j = 0

        time.sleep(1)
        gpio.setup(self._channel, gpio.OUT)
        gpio.output(self._channel, gpio.LOW)
        time.sleep(0.02)
        gpio.output(self._channel, gpio.HIGH)
        gpio.setup(self._channel, gpio.IN)

        while gpio.input(self._channel) == gpio.LOW:
            continue
        while gpio.input(self._channel) == gpio.HIGH:
            continue

        while j < 40:
            k = 0
            while gpio.input(self._channel) == gpio.LOW:
                continue
            while gpio.input(self._channel) == gpio.HIGH:
                k += 1
                if k > 100:
                    break
            if k < 8:
                data.append(0)
            else:
                data.append(1)

            j += 1

        # print "sensor is working."
        # print data

        humidity_bit = data[0:8]
        humidity_point_bit = data[8:16]
        temperature_bit = data[16:24]
        temperature_point_bit = data[24:32]
        check_bit = data[32:40]

        humidity = 0
        humidity_point = 0
        temperature = 0
        temperature_point = 0
        check = 0

        for i in range(8):
            humidity += humidity_bit[i] * 2 ** (7 - i)
            humidity_point += humidity_point_bit[i] * 2 ** (7 - i)
            temperature += temperature_bit[i] * 2 ** (7 - i)
            temperature_point += temperature_point_bit[i] * 2 ** (7 - i)
            check += check_bit[i] * 2 ** (7 - i)

        tmp = humidity + humidity_point + temperature + temperature_point

        result = {}
        if check == tmp:
            # print "temperature :", temperature, "*C, humidity :", humidity, "%"
            result['temp'] = temperature
            result['humi'] = humidity
            return result
        else:
            # print "wrong"
            # print "temperature :", temperature, "*C, humidity :", humidity, "% check :", check, ", tmp :", tmp
            return None
