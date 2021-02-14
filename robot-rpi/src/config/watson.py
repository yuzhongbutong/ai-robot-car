from os import getenv
from .base import *

DEBUG = False

BROKER_CONFIG = {
    'ORG_ID': getenv('BROKER_WATSON_ORG_ID', ''),
    'USER_NAME': getenv('BROKER_WATSON_USER', ''),
    'PASSWORD': getenv('BROKER_WATSON_PWD', '')
}
