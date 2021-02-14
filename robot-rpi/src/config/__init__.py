from os import getenv
from . import local, watson

mode = getenv('ENV_MODE')
if mode == 'watson':
    settings = watson
else:
    settings = local