# -*- coding: utf-8 -*-
import threading
import time
import Queue
import os
import sys
from lib.ParamsDefine import ParamsDefine


class RegisterResult(threading.Thread):
    def __init__(self, result_queue):
        threading.Thread.__init__(self)
        self.stop = False
        self.result_queue = result_queue
        self.start()

    def run(self):
        while True:
            if self.stop:
                break
            if self.result_queue.empty():
                time.sleep(0.01)
                continue
            try:
                new_account = self.result_queue.get(False)
                try:
                    s = u"{}            {}            {}".format(new_account['mobile'], new_account['password'], new_account['reg_time'])
                    f = open(ParamsDefine.register_save_path, 'a+')
                    f.write(s + "\r")
                    f.close()
                except:
                    pass
            except Queue.Empty:
                time.sleep(0.01)





