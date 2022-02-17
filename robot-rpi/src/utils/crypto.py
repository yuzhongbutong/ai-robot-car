# !/usr/bin/python
# coding:utf-8
# @Author : Joey

from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex
from src.config import settings as config


class Crypto():
    def __init__(self):
        key = self.pad(config.SECRET_KEY).encode()
        self.cryptor = AES.new(key, AES.MODE_ECB)

    def pad(self, text):
        while len(text) % 16 != 0:
            text += ' '
        return text

    def encrypt(self, plain_text):
        cipher_text = self.cryptor.encrypt(self.pad(plain_text).encode())
        return b2a_hex(cipher_text).decode()

    def decrypt(self, cipher_text):
        plain_text = self.cryptor.decrypt(a2b_hex(cipher_text.encode())).decode()
        return plain_text.rstrip()
