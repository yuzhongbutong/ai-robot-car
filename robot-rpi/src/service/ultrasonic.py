#!/usr/bin/python
# -*- coding: utf-8 -*-

import RPi.GPIO as gpio
import time


class Ultrasonic:

    def __init__(self, gpio_hc):
        self._gpio_hc = gpio_hc
        gpio.setmode(gpio.BCM)
        gpio.setup(self._gpio_hc[0], gpio.OUT, initial=gpio.LOW)
        gpio.setup(self._gpio_hc[1], gpio.IN)
        gpio.setup(self._gpio_hc[2], gpio.OUT, initial=gpio.LOW)
        gpio.setup(self._gpio_hc[3], gpio.IN)

    def get_front_distance(self):
        gpio.output(self._gpio_hc[0], gpio.HIGH)
        time.sleep(0.000015)
        gpio.output(self._gpio_hc[0], gpio.LOW)
        while not gpio.input(self._gpio_hc[1]):
            pass
        t1 = time.time()
        while gpio.input(self._gpio_hc[1]):
            pass
        t2 = time.time()

        return (t2 - t1) * 340 / 2

    def get_back_distance(self):
        gpio.output(self._gpio_hc[2], gpio.HIGH)
        time.sleep(0.000015)
        gpio.output(self._gpio_hc[2], gpio.LOW)
        while not gpio.input(self._gpio_hc[3]):
            pass
        t1 = time.time()
        while gpio.input(self._gpio_hc[3]):
            pass
        t2 = time.time()

        return (t2 - t1) * 340 / 2
