from os import getenv
from . import development, production

env = getenv('FLASK_ENV', 'production')
if env == 'production':
    settings = production
else:
    settings = development
