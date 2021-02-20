#!/usr/bin/python
# -*- coding: utf-8 -*-

import RPi.GPIO as gpio
import time
from threading import Timer

ALERT_INTERVAL = 0.1

timer = None
cancel = True


class Buzzer:

    def __init__(self, gpio_buzzer):
        self._gpio_buzzer = gpio_buzzer
        gpio.setmode(gpio.BCM)
        gpio.setup(self._gpio_buzzer, gpio.OUT)
        gpio.output(self._gpio_buzzer, gpio.LOW)

    def make_alert(self, cycle=1, interval=0.2):
        if timer is None:
            for i in range(cycle):
                gpio.output(self._gpio_buzzer, gpio.HIGH)
                time.sleep(ALERT_INTERVAL)
                gpio.output(self._gpio_buzzer, gpio.LOW)
                time.sleep(interval)

    def make_once_alert(self):
        if timer is None:
            gpio.output(self._gpio_buzzer, gpio.HIGH)
            time.sleep(ALERT_INTERVAL)
            gpio.output(self._gpio_buzzer, gpio.LOW)

    @staticmethod
    def cancel_timer():
        global cancel
        cancel = True
        global timer
        if timer is not None:
            timer.cancel()
            timer = None

    def start_timer(self, interval):
        self.cancel_timer()
        global cancel
        cancel = False
        self.__start_alert(interval)

    def __start_alert(self, interval):
        gpio.output(self._gpio_buzzer, gpio.HIGH)
        time.sleep(ALERT_INTERVAL)
        gpio.output(self._gpio_buzzer, gpio.LOW)
        if not cancel:
            global timer
            timer = Timer(interval, self.__start_alert, (interval,))
            timer.start()
