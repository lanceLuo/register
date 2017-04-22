# -*- coding:utf-8 -*-
import sys
import hashlib
import os
import random
import urllib
from wx.lib.pubsub import pub
from lib.EvtName import EvtName
import time
import threading
import json
import urllib2
import datetime
from service.RuokuaiParam import *


class RuokuaiApiClient(object):

    def __init__(self, name=None, password=None):
        self.name = None
        self.password = None
        self.th_update_info = None

    def http_request(self, url, param_dict):
        param_dict['username'] = self.name
        param_dict['password'] = self.password
        post_content = ''
        for key in param_dict:
            post_content += '%s=%s&' % (key, param_dict[key])
        post_content = post_content[0:-1]
        req = urllib2.Request(url, data=post_content)
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())
        response = opener.open(req, post_content)
        return response.read()

    '''
    '''
    def http_upload_image(self, url, param_keys, param_dict, filebytes):
        timestr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        boundary = '------------' + hashlib.md5(timestr).hexdigest().lower()
        boundarystr = '\r\n--%s\r\n' % (boundary)

        bs = b''
        for key in param_keys:
            bs += boundarystr.encode('ascii')
            param = "Content-Disposition: form-data; name=\"%s\"\r\n\r\n%s" % (key, param_dict[key])
            bs += param.encode('utf8')
        bs += boundarystr.encode('ascii')

        header = 'Content-Disposition: form-data; name=\"image\"; filename=\"%s\"\r\nContent-Type: im' \
                 'age/gif\r\n\r\n' % ('sample')
        bs += header.encode('utf8')

        bs += filebytes
        tailer = '\r\n--%s--\r\n' % (boundary)
        bs += tailer.encode('ascii')

        import requests
        headers = {'Content-Type': 'multipart/form-data; boundary=%s' % boundary,
                   'Connection': 'Keep-Alive',
                   'Expect': '100-continue',
                   }
        response = requests.post(url, params='', data=bs, headers=headers)
        return response.text

    def login_evt_listener(self, data, extra1, extra2=None):
        self.th_update_info = threading.Thread(target=self.worker_handler, args=(data.get('name', None), data.get('password', None)), name='img_v_acount_info_worker')
        self.th_update_info.setDaemon(1)
        self.th_update_info.start()

    def worker_handler(self, name, password):
        self.name = name
        self.password = password
        result = self.get_account_info()
        if result['code'] != 200:
            pub.sendMessage(EvtName.evt_login_end, data={'type': 'img', 'is_success': False, 'msg': result['msg']},
                            extra1=u'打码账号登陆')
            print result
            return
        else:
            pub.sendMessage(EvtName.evt_login_end, data={'type': 'img', 'is_success': True, 'msg': result['msg']},
                            extra1=u'打码账号登陆')
            pass
        while True:
            time.sleep(5)
            result = self.get_account_info()
            print result

    '''
    获取账户信息
    {u'HistoryScore': u'379', u'Score': u'2121', u'TotalScore': u'379', u'TotalTopic': u'22'}}
    '''
    def get_account_info(self):
        result = self.http_request('http://api.ruokuai.com/info.json', {})
        if not result:
            return {'code': 201, 'msg': u'网络异常'}
        result = json.loads(result)
        if not isinstance(result, dict) or result.get('Error_Code', None) is not None:
            return {'code': 202, 'msg': u"网络异常" if not isinstance(result, dict) else result['Error']}
        else:
            return {'code': 200, 'msg': '', 'data': result}

    '''
    获取图片验证码
    :return {"Result":"FPSbUa","Id":"1b59cbac-5db1-4f9d-8f27-7a586be7c82e"}
    '''
    def get_img_code(self, image_path):
        param_dict = {
            'username': self.name,
            'password': self.password,
            'timeout': RuokuaiParam.time_out,
            'typeid': RuokuaiParam.type_id,
            'softid': RuokuaiParam.soft_id,
            'softkey': RuokuaiParam.soft_key,
        }
        param_keys = ['username',
                     'password',
                     'typeid',
                     'timeout',
                     'softid',
                     'softkey'
                     ]
        import Image
        img = Image.open(image_path)
        image_name = os.path.basename(image_path)
        img_dir = os.path.dirname(image_path)
        image_name = image_name[0:image_name.rfind('.')]
        gif_file_path = "{}/{}.gif".format(img_dir, image_name)
        img.save(gif_file_path, format="gif")
        result = self.http_upload_image("http://api.ruokuai.com/create.json", param_keys, param_dict, open(gif_file_path, "rb").read())
        if not result:
            return False
        else:
            return json.loads(result)

    '''
    答题报错
    '''
    def report_error(self, topic_id):
        params_dic = {
            'id': topic_id,
            'softid': RuokuaiParam.soft_id,
            'softkey': RuokuaiParam.soft_key
        }
        #  {"Error":"报错ID错误.","Error_Code":"10211","Request":""}
        #  {"Result":"报错成功/报错成功2"}
        result = self.http_request('http://api.ruokuai.com/reporterror.json', params_dic)
        return result


if __name__ == '__main__':
    name = 'justintime'
    password = 'zzz123456'
    # img_path = 'C:/Users/luo/Desktop/show_img.fcgi.jpg'
    img_path = 'C:/Users/luo/Desktop/show_img.jpg'
    o = RuokuaiApiClient(name, password)
    # r = o.get_account_info('justintime', 'zzz123456')
    # r = o.get_img_code(name, password, img_path)
    r = o.report_error('asdadasda')
    print r
