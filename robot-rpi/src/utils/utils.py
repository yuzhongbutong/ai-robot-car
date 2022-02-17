# !/usr/bin/python
# coding:utf-8
# @Author : Joey

import subprocess
from os import path
from configparser import ConfigParser


def run_command(command):
    chunk = subprocess.Popen(
        command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    error = str(chunk.stderr.read(), encoding='utf-8')
    if error:
        return None
    else:
        result = str(chunk.stdout.read(), encoding='utf-8')
        return result


def read_config(section, key=None):
    file_name = path.join(path.dirname(__file__), '../../files/config.cfg')
    config_parser = ConfigParser()
    config_parser.read(file_name)
    if config_parser.has_section(section):
        if key is None:
            return config_parser.items(section)
        elif key is not None and config_parser.has_option(section, key):
            return config_parser.get(section, key)
    return None


def write_config(source):
    if source is None:
        return False
    config_parser = ConfigParser()
    file_name = path.join(path.dirname(__file__), '../../files/config.cfg')
    config_parser.read(file_name)
    for section, options in source.items():
        if not config_parser.has_section(section):
            config_parser.add_section(section)
        for key, value in options.items():
            config_parser.set(section, key, str(value))
    with open(file_name, mode="w", encoding="utf-8") as config:
        config_parser.write(config)
    return True
