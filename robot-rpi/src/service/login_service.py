
# from crypt import crypt
from hmac import compare_digest as compare_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from src.config import settings
from src.utils.utils import run_command


class LoginService:
    def generate_token(self, user_id):
        serializer = Serializer(settings.SECRET_KEY,
                                expires_in=settings.TOKEN_EXPIRE)
        token = serializer.dumps({'id': user_id}).decode('ascii')
        return settings.TOKEN_SCHEME + ' ' + token

    def verify_auth(self, username, cleartext):
        # result = run_command('sudo cat /etc/shadow | grep -w ' + username)
        # if result:
        #     cryptedpasswd = result.split(':')[1]
        #     is_correct = compare_hash(crypt(
        #         cleartext, cryptedpasswd), cryptedpasswd)
        #     if is_correct:
                return True

        # return False
