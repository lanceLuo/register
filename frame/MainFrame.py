# -*- coding: utf-8 -*-
import wx
from wx.lib.pubsub import pub
import sys
import threading
import time
import Queue
import webbrowser
from grid.AcountGrid import *
from page.TipPage import TipPage
from service.SumaApiClient import *
from service.RuokuaiApiClient import *
from lib.EvtName import EvtName
from lib.LogOut import LogOut
from lib.ParamsDefine import ParamsDefine
from service.Youka import Youka
from lib.funcs import *


class MainFrame(wx.Frame):

    def __init__(self, parent):
        self.title = u"注册助手"
        frame_size = (830, 490)
        wx.Frame.__init__(self, parent, wx.ID_ANY, self.title, size=frame_size)
        self.SetMaxSize(frame_size)
        self.SetMinSize(frame_size)
        # 设置背景颜色
        self.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.m_mobile_v_handler = SumaApiClient()
        self.m_img_v_handler = RuokuaiApiClient()
        # ===============以下为手机短信验证码账号信息=========
        self.m_phone_v_panel = wx.Panel(self, wx.ID_ANY, pos=(510, 5), size=(290, 70), style=wx.BORDER_THEME)
        self.label_mobile_v_account = wx.StaticText(self.m_phone_v_panel, wx.ID_ANY, u"帐号:", (5, 5), wx.DefaultSize, 0)
        self.text_mobile_v_account = wx.TextCtrl(self.m_phone_v_panel, wx.ID_ANY, '', (34, 5), (80, 20), 0,)
        self.text_mobile_v_account.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.label_mobile_v_password = wx.StaticText(self.m_phone_v_panel, wx.ID_ANY, u"密码:", (115, 5), wx.DefaultSize, 0)
        self.text_mobile_v_password = wx.TextCtrl(self.m_phone_v_panel, wx.ID_ANY, '', (145, 5), (80, 20), wx.TE_PASSWORD)
        self.text_mobile_v_password.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.btn_mobile_v_login = wx.Button(self.m_phone_v_panel, wx.ID_ANY, u"短信登陆", (225, 5), (60, 20), 0)
        self.btn_mobile_v_login.Bind(wx.EVT_BUTTON, self.mobile_v_login)

        # ===============以下为图片识别账号信息=========
        self.m_img_v_panel = wx.Panel(self, wx.ID_ANY, pos=(510, 80), size=(290, 70), style=wx.BORDER_THEME)
        self.label_img_v_account = wx.StaticText(self.m_img_v_panel, wx.ID_ANY, u"帐号:", (5, 5), wx.DefaultSize, 0)
        self.text_img_v_account = wx.TextCtrl(self.m_img_v_panel, wx.ID_ANY, '', (34, 5), (80, 20), 0,)
        self.text_img_v_account.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.label_img_v_password = wx.StaticText(self.m_img_v_panel, wx.ID_ANY, u"密码:", (115, 5), wx.DefaultSize, 0)
        self.text_img_v_password = wx.TextCtrl(self.m_img_v_panel, wx.ID_ANY, '', (145, 5), (80, 20), wx.TE_PASSWORD)
        self.text_img_v_password.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.btn_img_v_login = wx.Button(self.m_img_v_panel, wx.ID_ANY, u"打码登陆", (225, 5), (60, 20), 0)
        self.btn_img_v_login.Bind(wx.EVT_BUTTON, self.img_v_login)
        # ===============网络选择=========
        self.ip_panel = wx.Panel(self, wx.ID_ANY, pos=(510, 155), size=(290, 100), style=wx.BORDER_THEME)
        self.m_radio_box = wx.RadioBox(self.ip_panel, wx.ID_ANY, '', (2, -5), wx.DefaultSize,
                                       [u"本地", u"宽带拨号换IP", u"导入IP.txt"], 3, wx.RA_SPECIFY_ROWS)
        self.m_radio_box.Bind(wx.EVT_RADIOBOX, self.set_ip)
        # ===============ADSL=============
        self.label_adsl_account = wx.StaticText(self.ip_panel, wx.ID_ANY, u"宽带帐号:", (120, 15), wx.DefaultSize, 0)
        self.text_adsl_account = wx.TextCtrl(self.ip_panel, wx.ID_ANY, '', (175, 15), (75, 20), 0)
        self.label_adsl_password = wx.StaticText(self.ip_panel, wx.ID_ANY, u"宽带密码", (120, 40), wx.DefaultSize, 0)
        self.text_adsl_password = wx.TextCtrl(self.ip_panel, wx.ID_ANY, '', (175, 40), (75, 20), 0)

        self.m_setting_panel = wx.Panel(self, wx.ID_ANY, pos=(510, 260), size=(290, 100), style=wx.BORDER_THEME)
        self.m_label_setting_worker_num = wx.StaticText(self.m_setting_panel, wx.ID_ANY, u"线程数:", pos=(5, 5),
                                                        size=wx.DefaultSize, style=0)
        self.m_text_setting_worker_num = wx.TextCtrl(self.m_setting_panel, wx.ID_ANY, u"5", (45, 5), (30, 20), 0)
        self.m_label_setting_ip_num_1 = wx.StaticText(self.m_setting_panel, wx.ID_ANY, u"每", pos=(100, 5),
                                                      size=wx.DefaultSize, style=0)
        self.m_text_setting_ip_num = wx.TextCtrl(self.m_setting_panel, wx.ID_ANY, u"1", (115, 5), (25, 20), 0)
        self.m_label_setting_ip_num_1 = wx.StaticText(self.m_setting_panel, wx.ID_ANY, u"个换IP", pos=(140, 5),
                                                      size=wx.DefaultSize, style=0)
        self.m_label_setting_register_num = wx.StaticText(self.m_setting_panel, wx.ID_ANY, u"注册数量:", pos=(5, 35),
                                                          size=wx.DefaultSize, style=0)
        self.m_text_setting_register_num = wx.TextCtrl(self.m_setting_panel, wx.ID_ANY, u"10", (60, 35), (40, 20), 0)
        self.m_label_setting_register_suc_num = wx.StaticText(self.m_setting_panel, wx.ID_ANY, u"已成功:", pos=(110, 35),
                                                              size=wx.DefaultSize, style=0)
        self.m_text_setting_register_suc_num = wx.TextCtrl(self.m_setting_panel, wx.ID_ANY, u"0", (150, 35), (40, 20), 0)
        self.m_text_setting_register_suc_num.Disable()
        self.m_label_setting_register_password = wx.StaticText(self.m_setting_panel, wx.ID_ANY, u"注册密码:", pos=(5, 65),
                                                          size=wx.DefaultSize, style=0)
        self.m_text_setting_register_password = wx.TextCtrl(self.m_setting_panel, wx.ID_ANY, u"fff11101", (60, 65),
                                                            (80, 20), 0)
        self.m_check_password_type = wx.CheckBox(self.m_setting_panel, wx.ID_ANY, u'取随机', pos=(150, 65), size=(55, -1))
        self.m_text_password_length = wx.TextCtrl(self.m_setting_panel, wx.ID_ANY, u"8", (210, 65),
                                                  (20, 20), 0)

        self.btn_on_register = wx.Button(self, wx.ID_ANY, u"开始注册", (510, 400), (60, 30), 0)
        self.btn_on_register.Bind(wx.EVT_BUTTON, self.on_regist)
        # # 暂停购票按钮
        self.btn_off_buy = wx.Button(self, wx.ID_ANY, u"暂停注册", (580, 400), (60, 30), 0)
        # # # 保存购票成功记录
        self.btn_save_success = wx.Button(self, wx.ID_ANY, u"保存账号", (650, 400), (60, 30), 0)
        self.btn_platform_url = wx.Button(self, wx.ID_ANY, u"平台地址", (720, 400), (60, 30), 0)
        self.btn_platform_url.Bind(wx.EVT_BUTTON, self.open_platform_url)
        self.grid = AccountGrid(self)
        # 错误信息面板
        self.notebook = wx.Notebook(self, wx.ID_ANY, (2, 300), (500, 150))
        self.notebook.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.notebook_info_tip = TipPage(self.notebook, 'tip')
        self.notebook.AddPage(self.notebook_info_tip, u"  提示信息  ")
        self.notebook_err_tip = TipPage(self.notebook, 'err')
        self.notebook.AddPage(self.notebook_err_tip, u"  错误信息  ")
        self.tip_log = LogOut(self.notebook_info_tip)
        if ParamsDefine.set_std:
            sys.stdout = self.tip_log
            # sys.stderr = self.err_log
        self.log_thread = []
        for i in range(1):
            if i == 0:
                t = threading.Thread(target=self.tip_log.output, name="S_" + str(i))
            else:
                t = threading.Thread(target=self.err_log.output, name="S_" + str(i))
            t.setDaemon(1)
            t.start()
            self.log_thread.append(t)

        pub.subscribe(self.m_mobile_v_handler.login_evt_listener, EvtName.mobile_v_handler_login)  # 注册监听登陆事件
        pub.subscribe(self.m_img_v_handler.login_evt_listener, EvtName.img_v_handler_login)  # 注册登陆监听事件
        pub.subscribe(self.login_end, EvtName.evt_login_end)  # 注册登陆成功监听事件
        pub.subscribe(self.update_register_success, EvtName.evt_register_success) # 开启注册成功监听
        self.is_mobile_v_login_success = False
        self.is_img_v_login_success = False
        self.ip_list = []
        self.register_queue = Queue.Queue()

    def update_register_success(self, data, extra1, extra2=None):
        self.m_text_setting_register_suc_num.SetValue(str(int(self.m_text_setting_register_suc_num.GetValue()) + 1))


    '''
    短信登陆按钮处理
    '''
    def mobile_v_login(self, evt):
        mobile_v_account = self.text_mobile_v_account.GetValue()
        mobile_v_password = self.text_mobile_v_password.GetValue()
        if not mobile_v_account:
            print u"登陆提示 -- 短信账号未填写"
        elif not mobile_v_password:
            print u"登陆提示 -- 短信密码未填写"
        else:
            self.btn_mobile_v_login.Disable()
            pub.sendMessage(EvtName.mobile_v_handler_login, data={'name': mobile_v_account,
                                                                  'password': mobile_v_password}, extra1='登陆短信验证账号')

    '''
    打码登陆
    '''
    def img_v_login(self, evt):
        img_v_account = self.text_img_v_account.GetValue()
        img_v_password = self.text_img_v_password.GetValue()
        if not img_v_account:
            print u"登陆提示 -- 打码账号未填写"
        elif not img_v_password:
            print u"登陆提示 -- 打码密码未填写"
        else:
            self.btn_img_v_login.Disable()
            pub.sendMessage(EvtName.img_v_handler_login, data={'name': img_v_account,
                                                               'password': img_v_password}, extra1='登陆打码账号')

    def set_ip(self, evt):
        i_selected = self.m_radio_box.GetSelection()
        if i_selected == 2:
            file_wildcard = u"IP(*.txt)|*.txt|All files(*.*)|*.*"
            dlg = wx.FileDialog(self, u'请选择',
                                os.getcwd(),
                                style=wx.OPEN,
                                wildcard=file_wildcard)
            if dlg.ShowModal() == wx.ID_OK:
                file_path = dlg.GetPath()
                self.ip_list = []

                with open(file_path) as f:
                    for line in f:
                        if not line.strip('\n'):
                            continue
                        self.ip_list.append({'ip': line.strip('\n'), 'reg_num': 0})
                    print u"导入IP:{}".format(u"无IP信息" if not len(self.ip_list) else u"{}个".format(len(self.ip_list)))
            dlg.Destroy()

    def login_end(self, data, extra1, extra2=None):
        if data['type'] == 'mobile':
            if data['is_success']:
                self.is_mobile_v_login_success = True
                self.btn_mobile_v_login.SetLabelText(u"已登陆")
                self.text_mobile_v_account.Disable()
                self.text_mobile_v_password.Disable()
            else:
                self.btn_mobile_v_login.Enable()
                print u"登陆提示 -- 短信{}".format(data['msg'])
        elif data['type'] == 'img':
            if data['is_success']:
                self.is_img_v_login_success = True
                self.btn_img_v_login.SetLabelText(u"已登陆")
                self.text_img_v_account.Disable()
                self.text_img_v_password.Disable()
            else:
                self.btn_img_v_login.Enable()
                print u"登陆提示 -- 打码{}".format(data['msg'])
        else:
            pass

    '''
    '''
    def on_regist(self, evt):
        # self.is_mobile_v_login_success = True
        # self.is_img_v_login_success = True
        if not self.is_mobile_v_login_success:
            print u"注册提示 -- 短信账号未登录"
            return
        elif not self.is_img_v_login_success:
            print u"注册提示 -- 打码账号未登录"
            return

        ip_type = self.m_radio_box.GetSelection()
        adsl_account = None
        if ip_type == 1:  # 宽带拨号
            adsl_account = {
                'name': 'adsl',
                'username': self.text_adsl_account.GetValue(),
                'password': self.text_adsl_password.GetValue()
            }
            if not adsl_account['username']:
                print u"宽带账号未填写"
                return
            if not adsl_account['password']:
                print u"宽带密码未填写"
                return

        worker_num = self.m_text_setting_worker_num.GetValue()
        register_num = self.m_text_setting_register_num.GetValue()
        ip_num = self.m_text_setting_ip_num.GetValue()
        if not worker_num.isdigit():
            print u"线程数非数值"
            return
        if int(worker_num) > 100:
            print u"线程数大于100"
            return
        if not register_num.isdigit():
            print u"注册数量非数值"
            return
        if not ip_num.isdigit():
            print u"注册数量非数值"
            return
        if self.m_check_password_type.IsChecked():
            password = None
            password_length = self.m_text_password_length.GetValue()
            if not password_length.isdigit():
                print u"注册密码长度非数值"
                return
            password_length = int(password_length)
            if password_length < 8:
                print u"注册密码长度最少8位"
                return
        else:
            password = self.m_text_setting_register_password.GetValue()
            password_length = 0
        worker_num = abs(int(worker_num))
        register_num = abs(int(register_num))
        ip_num = abs(int(ip_num))
        proxy_num = 0
        register_list = []
        for i in range(register_num):
            ip = None
            if ip_type == 2:  # 使用代理IP
                for j in range(len(self.ip_list)):
                    if self.ip_list[j]['reg_num'] < ip_num:
                        ip = self.ip_list[j]['ip']
                        self.ip_list[j]['reg_num'] += 1
                        proxy_num += 1
                        break
                if not ip:  # 无可用IP
                    break
            item = {
                'mobile': None,
                'ip': ip,
                'password': password if password is not None else random_str(password_length),
                'create_time': time.time()
            }
            register_list.append(item)
        if ip_type == 2:
            if proxy_num == 0:
                print u"注册失败 -- 无IP可用"
                return
            if proxy_num < register_num:
                print u"当前IP数量能注册{}个账号".format(str(proxy_num))

        self.btn_on_register.Disable()
        self.btn_on_register.SetLabelText(u"注册中...")
        t = threading.Thread(target=self.th_worker, args=(register_list, worker_num, adsl_account))
        t.setDaemon(1)
        t.start()

    '''
    '''
    def th_worker(self, register_list, worker_num, adsl_account):
        if adsl_account:  # 开启ADSL
            from lib.Adsl import Adsl
            adsl = Adsl()
            adsl.set_adsl(adsl_account)
            adsl.connect()

        for item in register_list:
            self.register_queue.put(item, False)

        worker_list = []
        result_queue = Queue.Queue()
        from lib.RegisterResult import RegisterResult
        t_register_result = RegisterResult(result_queue)

        for i in range(worker_num):
            worker_list.append(Youka(self.m_mobile_v_handler, self.m_img_v_handler, self.register_queue, result_queue))

        for item in worker_list:
            item.join()

        while True:
            if result_queue.empty():
                t_register_result.stop = True
                break
            else:
                time.sleep(0.2)

        self.btn_on_register.SetLabelText(u"开始注册")
        self.btn_on_register.Enable()

    '''
    '''
    @staticmethod
    def open_platform_url(evt):
        webbrowser.open(ParamsDefine.platform_url)

    def on_close_window(self, evt):
        self.Destroy()
