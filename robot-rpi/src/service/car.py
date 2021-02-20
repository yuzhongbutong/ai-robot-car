#!/usr/bin/python
# -*- coding: utf-8 -*-

import RPi.GPIO as gpio
from threading import Timer

DIRECTION = {
    "F": [gpio.LOW, gpio.HIGH, gpio.LOW, gpio.HIGH, gpio.LOW, gpio.HIGH, gpio.LOW, gpio.HIGH],
    "B": [gpio.HIGH, gpio.LOW, gpio.HIGH, gpio.LOW, gpio.HIGH, gpio.LOW, gpio.HIGH, gpio.LOW],
    "L": [gpio.HIGH, gpio.LOW, gpio.LOW, gpio.HIGH, gpio.HIGH, gpio.LOW, gpio.LOW, gpio.HIGH],
    "R": [gpio.LOW, gpio.HIGH, gpio.HIGH, gpio.LOW, gpio.LOW, gpio.HIGH, gpio.HIGH, gpio.LOW],
    "S": [gpio.LOW, gpio.LOW, gpio.LOW, gpio.LOW, gpio.LOW, gpio.LOW, gpio.LOW, gpio.LOW]
}

timer = None
cancel = True


class Car:
    def __init__(self, gpio_car):
        self._gpio_car = gpio_car
        gpio.setmode(gpio.BCM)
        for pin in self._gpio_car:
            gpio.setup(pin, gpio.OUT)
            gpio.output(pin, gpio.LOW)

    def __set_pin(self, data):
        for i in range(len(self._gpio_car)):
            gpio.output(self._gpio_car[i], DIRECTION[data][i])

    @staticmethod
    def __cancel_timer():
        global cancel
        cancel = True
        global timer
        if timer is not None:
            timer.cancel()
            timer = None

    def __set_alert(self, my_buzzer, fun, args):
        distance = fun()
        # print(distance)
        once1 = True
        once2 = True
        if distance < 0.2:
            self.__set_pin("S")
            my_buzzer.cancel_timer()
            self.__cancel_timer()
            return
        elif distance < 1.5:
            if once1:
                once1 = False
                once2 = True
                my_buzzer.start_timer(0.1)
        else:
            if once2:
                once1 = True
                once2 = False
                my_buzzer.cancel_timer()

        if not cancel:
            global timer
            timer = Timer(0.2, self.__set_alert, (my_buzzer, fun, args))
            timer.start()

    def move_car(self, data, my_ultrasonic, my_buzzer):
        # print(data)
        self.__set_pin(data)
        my_buzzer.cancel_timer()
        self.__cancel_timer()
        global cancel
        if data == "F":
            cancel = False
            self.__set_alert(my_buzzer, my_ultrasonic.get_front_distance, None)
        elif data == "B":
            cancel = False
            self.__set_alert(my_buzzer, my_ultrasonic.get_back_distance, None)
