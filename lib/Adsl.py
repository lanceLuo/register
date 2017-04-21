# -*- coding:utf-8 -*-
import os
import time


class Adsl(object):
    name = 'asdl'
    __instance = None
    __connected = False

    # ==============================================================================
    # __init__ : name: adsl名称
    # ==============================================================================
    def __init__(self):
        pass

    def __new__(cls, *args, **kwargs):
        if Adsl.__instance is None:
            Adsl.__instance = object.__new__(cls, *args, **kwargs)
        return Adsl.__instance

    # ==============================================================================
    # set_adsl : 修改adsl设置
    # ==============================================================================
    def set_adsl(self, account):
        self.name = account["name"]
        self.username = account["username"]
        self.password = account["password"]
        return self

    # ==============================================================================
    # connect : 宽带拨号
    # ==============================================================================
    def connect(self):
        if self.__connected:
            self.disconnect()
        cmd_str = "rasdial %s %s %s" % (self.name, self.username, self.password)
        os.system(cmd_str)
        self.__connected = True
        time.sleep(5)

    # ==============================================================================
    # disconnect : 断开宽带连接
    # ==============================================================================
    def disconnect(self):
        cmd_str = "rasdial %s /disconnect" % self.name
        os.system(cmd_str)
        time.sleep(5)
        self.__connected = False

    # ==============================================================================
    # reconnect : 重新进行拨号
    # ==============================================================================
    def reconnect(self):
        self.disconnect()
        self.connect()

if __name__ == '__main__':
    adsl = Adsl()
    adsl.set_adsl({'name':'adsl', 'username': 'luohaoyan','password':121212}).connect()