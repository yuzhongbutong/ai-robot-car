from os import getenv
from .base import *

DEBUG = True

BROKER_CONFIG = {
    'URL': 'mqtt://' + getenv('BROKER_LOCAL_HOST', '')
}
