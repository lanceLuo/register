# -*- coding:utf-8 -*-
import time
import wx
import os
import hashlib
import sys
import re
import json
import random
import threading
import Queue
from service.RuokuaiApiClient import *
from service.SumaApiClient import *
from lib.Download import Download
from lib.funcs import *
from wx.lib.pubsub import pub
from lib.EvtName import EvtName


class Youka(threading.Thread):
    reg_url = 'http://register.dobest.com'  #  注册页地址
    reg_page_url = 'http://register.dobest.com/register/index?appId=299&tabIndex=username'
    back_url = 'http://www.yokagames.com/'
    reguser_url = 'http://reguser.dobest.com'
    cas_url = 'http://cas.dobest.com'

    def __init__(self, mobile_v_handler, img_v_handler, register_queue, result_queue):
        threading.Thread.__init__(self)
        self.file_dir = None
        self.cookie_file_path = None
        self.m_mobile_v_code_handler = mobile_v_handler
        self.m_img_v_code_handler = img_v_handler
        self.proxy = None
        self.register_queue = register_queue
        self.result_queue = result_queue
        self.start()

    def run(self):
        register_queue = self.register_queue
        while True:
            if register_queue.empty():
                break
            try:
                register = register_queue.get(False)
                if not register['mobile']:
                    mobile_result = self.m_mobile_v_code_handler.get_mobile_num()
                    if mobile_result['code'] != 200:
                        if mobile_result['code'] != 501:
                            time.sleep(1)
                            register_queue.put(register, False)
                        else:
                            time.sleep(1)
                        print mobile_result['msg']
                        continue
                    register['mobile'] = mobile_result['phone_list'][0]

                result = self.do_register(register['mobile'], proxy=register['ip'], password=register['password'])
                if result['code'] != 200:
                    print result['msg']
                    time.sleep(1)
                    register_queue.put(register, False)
                    continue
                new_account = {
                    'mobile': register['mobile'],
                    'password': register['password'],
                    'reg_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
                wx.CallAfter(pub.sendMessage, EvtName.evt_register_success, data=new_account, extra1=u'注册成功')
                self.result_queue.put(new_account, False)
            except Queue.Empty:
                time.sleep(0.01)


    '''
    请求发送验证码
    '''
    def send_phone_code(self, img_v_code, session_key, app_id, area_id, mobile):
        params = {
            'callback': 'jQuery18206468372203419672_{}'.format(str(get_millis_time())),
            'appId': app_id,
            'areaId': area_id,
            'mobile': mobile,
            'productId': 12,
            'sessionKey': session_key,
            'validateCode': img_v_code,
            'password': '',  # 密码，无需填
            'backUrl': self.back_url,
            '_': str(get_millis_time()+random.randint(20, 100))
        }
        url = u'{}/user/register/confirm-needed-mobile.jsonp?{}'.format(self.reguser_url, dict_to_query_str(params))
        status, jsonp = self.download(self.reg_page_url).get(url)
        if not status:
            return False
        else:
            return jsonp_to_dict(jsonp)
        # GET请求返回格式:jQuery18209259049265584332_1492604185042({"status":0,"message":"success","validateType":"MT","requestId":"RSC9AA582F329001543938D39877CE41B63"})

    '''
    检测验证码是否正确
    :return {"return_code":0,"return_message":"success","requestId":"RSCCD6BC15DDEA72D4094C3B9FA2817B7E3"}
    '''
    def check_img_v_code(self, img_v_code, session_key, app_id, area_id):
        params = {
            'callback': 'jQuery18206468372203419672_{}'.format(str(get_millis_time())),
            'checkCode': img_v_code,  # 验证码
            'sessionKey': session_key,  # 获取图片地址返回的sessionKey
            'appId': app_id,
            'areaId': area_id,
            '_': str(get_millis_time()+random.randint(20, 100))
        }
        url = u'{}/user/register/checkcode-intime.jsonp?{}'.format(self.reguser_url, dict_to_query_str(params))
        status, jsonp = self.download(self.reg_page_url).get(url)
        if not status:
            return False
        else:
            return jsonp_to_dict(jsonp)

    '''
    获取验证码图像
    '''
    def get_img(self, app_id, area_id, retry_num=2):
        params = {
            'callback': 'jQuery18206468372203419672_{}'.format(str(get_millis_time())),
            'appId': app_id,
            'areaId': area_id,
            'backUrl': self.back_url,
            '_': str(get_millis_time()+random.randint(20, 100))
        }
        url = u'{}/user/validate-code.jsonp?{}'.format(self.reguser_url, dict_to_query_str(params))
        status, jsonp = self.download(self.reg_page_url).get(url)
        if status:
            # 响应格式:jQuery18201616519245079695_1492604137596({"status":0,"message":"success",
            # "requestId":"RSCE8CD59CA5D0C744BA9420D781607B7AA","isNeedValidateCode":true,
            # "sessionKey":"gUFI1c3pSfuICkRg","imgSrc":"http://captcha2.dobest.com/fcgi-bin/show_img.fcgi?business_id=128&session_key=gUFI1c3pSfuICkRg&gameid=299&areaid=0"})
            return jsonp_to_dict(jsonp)
        else:
            if retry_num > 0:
                time.sleep(0.5)
                return self.get_img(app_id, area_id, retry_num-1)
            else:
                return False

    '''
    检测帐户是否可用
    '''
    def check_account(self, app_id, area_id, mobile, retry_num=2):
        params = {
            'callback': 'jQuery18206468372203419672_{}'.format(str(get_millis_time())),
            'serviceUrl': self.reg_url,
            'appId': app_id,
            'areaId': area_id,
            'authenSource': '2',
            'inputUserId': mobile,
            'locale': 'zh_CN',
            'productId': '1',
            'productVersion': '1.7',
            'version': '21',
            '_': str(get_millis_time()+random.randint(20, 100))
        }
        url = u'{}/authen/checkAccountType.jsonp?{}'.format(self.cas_url, dict_to_query_str(params))
        # 响应格式：checkAccountType_JSONPMethod({ "return_code": 0, "return_message": "", "data": { "displayPushMessage": 0, "existing": 0, "fromWoa": 0,
        # "hasCheckCodeLoginRecord": 0,"hasMobileLoginRecord": 0, "hasPushMessageLoginRecord": 0, "hasPwdLoginRecord": 0, "level": 0,
        #  "mobileMask": "130****6254", "recommendLoginType": 10, "resultCode": 0, "type": 1 } })
        status, jsonp = self.download(self.reg_page_url).get(url)
        if status:
            return jsonp_to_dict(jsonp)
        else:
            if retry_num > 0:
                time.sleep(0.5)
                return self.check_account(app_id, area_id, mobile, retry_num-1)
            else:
                return False

    '''
    获取cookie保存地址
    '''
    def set_cookie_path_by_mobile(self, mobile):
        file_dir = os.path.dirname(sys.argv[0]) + '{}data{}{}{}'.format(os.sep, os.sep, mobile, os.sep)
        if not os.path.exists(file_dir):
            os.makedirs(file_dir)

        self.file_dir = file_dir
        md5 = hashlib.md5()
        md5.update(mobile)
        f_path = md5.hexdigest()
        f_path = file_dir + f_path + '.txt'

        return f_path

    def set_img_v_code_handler(self, handler):
        self.m_img_v_code_handler = handler

    def set_mobile_v_code_handler(self, handler):
        self.m_mobile_v_code_handler = handler

    def download(self, refferer):
        return Download(self.cookie_file_path, refferer, self.proxy)

    '''
    执行注册
    '''
    def do_register(self, mobile, proxy=None, password=None):
        mobile = str(mobile)
        self.set_cookie_path_by_mobile(mobile)
        self.proxy = proxy
        status, register_page_html = self.download('http://www.yokagames.com/').get(self.reg_page_url)
        if not status:
            return {'code': 500, 'msg': u"网络异常-注册页面无法预览"}

        s1 = register_page_html.find('defaultAppId:')
        app_id = register_page_html[s1+13:register_page_html.find(',', s1)]
        s2 = register_page_html.find('defaultAreaId:')
        area_id = register_page_html[s2+14:register_page_html.find(',', s2)]
        # 获取验证码图片
        result = self.get_img(area_id, area_id)
        if not result:
            return {'code': 501, 'msg': u'网络错误-获取验证码图片失败'}
        if result.get('status') != 0 or not result.get('imgSrc', None):
            return {'code': 501, 'msg': u'获取验证码图片失败'}

        img_url = result['imgSrc']
        session_key = result.get('sessionKey', None)
        img_save_path = self.file_dir + '/{}.jpg'.format(mobile)
        urllib.urlretrieve(img_url, img_save_path)
        # 检测手机号是否可用
        check_result = self.check_account(app_id, area_id, mobile)
        if not check_result:
            return {'code': 502, 'msg': u'网络错误-手机号检测失败'}
        if check_result.get("return_code", None) != 0 or not isinstance(check_result.get('data', None), dict) or \
                check_result['data'].get('resultCode', None) != 0:
            return {'code': 502, 'msg': u'手机号检测失败'}
        if check_result['data'].get('existing', None) != 0:
            return {'code': 201, 'msg': u'手机号已注册过'}

        result = self.m_img_v_code_handler.get_img_code(img_save_path)
        if not result or not result.get('Result', None):
            return {"code": 502, 'msg': u'验证码识别失败'}

        img_v_code = result['Result']
        result = self.check_img_v_code(img_v_code, session_key, app_id, area_id)
        if not result:
            return {'code': 503, 'msg': u"网络错误-验证码校验失败"}
        if result.get('return_code', None) != 0:
            print u'当前验证码为{}'.format(str(img_v_code))
            return {'code': 503, 'msg': u'验证码校验不匹配'}

        result = self.send_phone_code(img_v_code, session_key, app_id, area_id, mobile)
        if not result:
            return {'code': 504, 'msg': u"网络错误-发送手机验证码失败"}
        if result.get('status', None) != 0:
            return {'code': 504, 'msg': u"发送手机验证码失败"}

        last_request_id = result.get('requestId', None)
        mobile_v_code = None
        for i in range(20):
            time.sleep(2)
            # 获取短信验证码
            result = self.m_mobile_v_code_handler.get_vcode_and_release_mobile(mobile)
            if result['code'] == 200:
                mobile_v_code = re.findall(r'\D+(\d+)', result['vcode'])[0]
                break
        if not mobile_v_code:
            return {'code': 505, 'msg': u"获取手机验证码失败"}
        params = {
            'callback': 'jQuery18206468372203419672_{}'.format(str(get_millis_time())),
            'appId': app_id,
            'areaId': area_id,
            'advfrom': '',
            'password': password,
            'mobile': mobile,
            'preRequestId': last_request_id,
            'validateCode': mobile_v_code,
            'backUrl': self.back_url,
            'isInner': 1,
            '_': str(get_millis_time()+random.randint(20, 100))

        }
        url = u"{}/user/register/confirm-needed-mobile/validation.jsonp?{}".format(self.reguser_url,
                                                                                   dict_to_query_str(params))
        status, result = self.download(self.reg_page_url).get(url)
        if not status:
            return {'code': 505, 'msg': u'请求注册失败'}
        else:
            result = jsonp_to_dict(result)
            if result.get('status', None) != 0:
                return {'code': 505, 'msg': u'请求注册失败:{}'.format(result.get('message', u'无message'))}
            else:
                return {'code': 200, 'msg': u"注册成功", 'mobile': mobile, 'password': password}

if __name__ == '__main__':
    youka = Youka()
    youka.set_img_v_code_handler(RuokuaiApiClient('justintime', 'zzz123456'))
    m = SumaApiClient("zabcd", 'b123321')
    m.login_in()
    youka.set_mobile_v_code_handler(m)
    print youka.do_register('13005178809', 'zzz11223322')

