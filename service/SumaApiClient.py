# -*- coding:utf-8 -*-
import threading
import wx
import time
from wx.lib.pubsub import pub
from lib.EvtName import EvtName
from lib.Download import Download
from lib.ParamsDefine import ParamsDefine

class SumaApiClient(Download):
    err_tip = {
        'login_error': u"用户名密码错误",
        'account_is_locked': u"账号被锁定",
        'account_is_stoped': u"账号被停用",
        'account_is_question_locked': u"账号已关闭",
        'account_is_ip_stoped': u"账号ip锁定",
        'account_is_FreezeUser': u"账号被冻结",
        'unknow_error': u"未知错误,再次请求就会正确返回",
        'parameter_error': u"传入参数错误",
        'not_found_project': u"没有找到项目,项目ID不正确",
        'max_count_disable': u"已经达到了当前等级可以获取手机号的最大数量，请先处理完您手上的号码再获取新的号码",  # 处理方式：能用的号码就获取验证码，不能用的号码就加黑
        'not_found_moblie': u"没有找到手机号",
        'not_found_project': u"没有找到项目,项目ID不正确",
        'not_receive': u"还没有接收到验证码,请让程序等待几秒后再次尝试"

    }

    def __init__(self):
        Download.__init__(self, None, None)
        self.name = None
        self.password = None
        self.token = None
        self.pid = ParamsDefine.mobile_suma_pid
        self.th_update_info = None

    def set_pid(self, pid):
        self.pid = pid

    '''
    '''
    def login_evt_listener(self, data, extra1, extra2=None):
        if not isinstance(data, dict):
            data = {}
        self.th_update_info = threading.Thread(target=self.worker_handler, args=(data.get('name', None), data.get('password')), name='mobile_v_account_info_worker')
        self.th_update_info.setDaemon(1)
        self.th_update_info.start()

    def worker_handler(self, name, password):
        result = self.login(name, password)
        if result['code'] == 200:
            wx.CallAfter(pub.sendMessage, EvtName.evt_login_end,
                         data={'type': 'mobile', 'is_success': True, 'msg': result['msg']},
                         extra1=u'短信账号登陆')
        else:
            wx.CallAfter(pub.sendMessage, EvtName.evt_login_end,
                         data={'type': 'mobile', 'is_success': False, 'msg': result['msg']},
                         extra1=u'短信账号登陆')
            return
        # while True:
        #     result = self.get_user_info()
        #     time.sleep(5)


    '''
    '''
    def login(self, name, password, is_retry=True):
        url = u"http://api.eobzz.com/httpApi.do?action=loginIn&uid={}&pwd={}".format(name, password)
        status, data = self.get(url, 1)
        if not status or not isinstance(data, str):
            return {'code': 500, 'msg': u"网络异常"}
        flag = data.find('|')
        if flag == -1:
            return {"code": 201, 'msg': self.err_tip[data]}
        if data.find("message") != -1:
            if is_retry:
                time.sleep(0.08)
                return self.login(name, password)
            else:
                return {"code": 500, 'msg': u"请稍后再试"}

        self.token = data[flag+1:]
        self.name = name
        self.password = password
        return {"code": 200, 'msg': u"登陆成功", 'token': data[flag+1:]}

    '''
    '''
    def get_user_info(self, is_retry=True):
        url = u"http://api.eobzz.com/httpApi.do?action=getUserInfos&uid={}&token={}".format(self.name, self.token)
        status, data = self.get(url, 1)
        if not status or not isinstance(data, str):
            return {'code': 500, 'msg': u"网络异常"}
        if data.find("message") != -1 or data.find("unknow_error") != -1:
            if is_retry:
                time.sleep(0.08)
                return self.get_user_info(False)
            else:
                return {"code": 500, 'msg': u"请稍后再试"}
        if data.find(";") == -1:
            return {'code': 201, 'msg': self.err_tip[data]}
        data = data.split(';')
        return {'code': 200, 'msg': u"获取成功", 'data': {
            'name': data[0],
            'score': data[1],
            'account': data[2],
            'phone_num':data[3]
        }}

    '''
    '''
    def get_mobile_num(self, size=1, province='', phone_type='', is_retry=True):
        url = u"http://api.eobzz.com/httpApi.do?action=getMobilenum&pid={}&uid={}&token={}&mobile=&size={}" \
              u"&province={}&phoneType={}".format(self.pid, self.name, self.token, size, province, phone_type)
        status, data = self.get(url)
        if not status or not isinstance(data, str):
            return {'code': 500, 'msg': u"网络异常"}
        if data.find(u"速度过快，请稍后再试") != -1 or data.find('unknow_error') != -1:
            if is_retry:
                time.sleep(0.08)
                return self.get_mobile_num(size=size, province=province, phone_type=phone_type,
                                           is_retry=False)
            else:
                return {'code': 500, 'msg': u"稍后重试"}
        if data.find(u"可使用余额不足") != -1:
            return {'code': 501, 'msg': u"可使用余额不足"}
        if data.find('|') == -1:
            return {'code': 500, 'msg': self.err_tip[data]}
        phone_list = data.split('|')[0].split(';')
        return {'code': 200, 'msg': u"获取成功", 'phone_list': phone_list}

    '''
    获取验证码并不再使用本号
    :return dict
    '''
    def get_vcode_and_release_mobile(self, mobile, author='', is_retry=True):
        url = u"http://api.eobzz.com/httpApi.do?action=getVcodeAndReleaseMobile&uid={}&token={}&mobile={}&author_uid={}".format(self.name, self.token, str(mobile), author)
        status, data = self.get(url)
        if not status or not isinstance(data, str) or data.find('please') != -1:  # please try again later
            if is_retry:
                time.sleep(0.08)
                return self.get_vcode_and_release_mobile(mobile, author, False)
            else:
                return {"code": 500, "msg": u"网络异常"}
        if data.find('|') != -1:
            if data.find('message') != -1:
                return {'code': 501, 'msg': u"帐户余额不足"}
            else:
                return {'code': 200, 'msg': u"获取成功", 'vcode': unicode(data.split('|')[1], 'utf8')}
        else:
            return {'code': 500, 'msg': self.err_tip[data], 'errcode': data}

    def add_ignore_list(self, name, token, phone_list, pid):
        url = u"http://api.eobzz.com/httpApi.do?action=addIgnoreList&uid={}&token={}&mobiles={}&pid={}".format(name, token, ",".join([str(i) for i in phone_list]), pid)
        status, data = self.get(url)
        
if __name__ == '__main__':
    token = '4e480361357f4a655adae694ad02444a'
    obj = SumaApiClient()
    r = obj.login("zabcd", 'b123321')
    if r['code'] == 200:
        obj.set_pid(20486)
    # # 13084621303
    # r = obj.get_mobile_num()
    # r = obj.get_vcode_and_release_mobile(13005178809)
    print r
    # r = obj.get_user_info(name, token)
    # r = obj.get_vcode_and_release_mobile(name, token, 13040866252)
    # print r
