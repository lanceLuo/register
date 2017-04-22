# -*- coding: utf-8 -*-
import wx
from wx.lib.pubsub import pub
import sys
import threading
import Queue
import webbrowser
from grid.AcountGrid import *
from page.TipPage import TipPage
from service.SumaApiClient import *
from service.RuokuaiApiClient import *
from lib.EvtName import EvtName
from lib.LogOut import LogOut
SET_STD = True


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
        self.m_radio_box = wx.RadioBox(self.ip_panel, wx.ID_ANY, '', (8, 2), wx.DefaultSize,
                                       [ u"宽带拨号换IP", u"导入IP.txt"], 2, wx.RA_SPECIFY_ROWS)
        self.m_radio_box.Bind(wx.EVT_RADIOBOX, self.set_ip)
        # ===============ADSL=============
        self.label_adsl_account = wx.StaticText(self.ip_panel, wx.ID_ANY, u"宽带帐号:", (120, 15), wx.DefaultSize, 0)
        self.text_adsl_account = wx.TextCtrl(self.ip_panel, wx.ID_ANY, '', (175, 15), (75, 20), 0,)
        self.label_adsl_password = wx.StaticText(self.ip_panel, wx.ID_ANY, u"宽带密码", (120, 40), wx.DefaultSize, 0)
        self.text_adsl_password = wx.TextCtrl(self.ip_panel, wx.ID_ANY, '', (175, 40), (75, 20), 0,)

        self.btn_on_buy = wx.Button(self, wx.ID_ANY, u"开始注册", (510, 400), (60, 30), 0)
        self.btn_on_buy.Bind(wx.EVT_BUTTON, self.on_regist)
        # # 暂停购票按钮
        self.btn_off_buy = wx.Button(self, wx.ID_ANY, u"暂停注册", (580, 400), (60, 30), 0)
        # # # 保存购票成功记录
        self.btn_save_success = wx.Button(self, wx.ID_ANY, u"保存账号", (650, 400), (60, 30), 0)
        self.btn_platform_url = wx.Button(self, wx.ID_ANY, u"平台地址", (720, 400), (60, 30), 0)
        self.btn_platform_url.Bind(wx.EVT_BUTTON, self.open_platform_url)
        self.platform_url = 'http://www.dobest.com'
        self.grid = AccountGrid(self)
        # 错误信息面板
        self.notebook = wx.Notebook(self, wx.ID_ANY, (2, 300), (500, 150))
        self.notebook.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.notebook_info_tip = TipPage(self.notebook, 'tip')
        self.notebook.AddPage(self.notebook_info_tip, u"  提示信息  ")
        self.notebook_err_tip = TipPage(self.notebook, 'err')
        self.notebook.AddPage(self.notebook_err_tip, u"  错误信息  ")
        self.tip_log = LogOut(self.notebook_info_tip)
        if SET_STD:
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
        self.is_mobile_v_login_success = False
        self.is_img_v_login_success = False
        self.ip_list = []

    '''
    短信登陆按钮处理
    '''
    def mobile_v_login(self, evt):
        mobile_v_account = self.text_mobile_v_account.GetValue()
        mobile_v_password = self.text_mobile_v_password.GetValue()
        if not mobile_v_account:
            print u"短信账号未填写"
        elif not mobile_v_password:
            print u"短信密码未填写"
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
            print u"打码账号未填写"
        elif not img_v_password:
            print u"打码密码未填写"
        else:
            self.btn_img_v_login.Disable()
            pub.sendMessage(EvtName.img_v_handler_login, data={'name': img_v_account,
                                                               'password': img_v_password}, extra1='登陆打码账号')

    def set_ip(self, evt):
        i_selected = self.m_radio_box.GetSelection()
        if i_selected == 1:
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
                        self.ip_list.append(line.strip('\n'))
                    print u"导入IP名单:{}".format(u"无" if not len(self.ip_list) else ",".join(self.ip_list))
            dlg.Destroy()

    def login_end(self, data, extra1, extra2=None):
        if data['type'] == 'mobile':
            if data['is_success']:
                self.is_mobile_v_login_success = True
            else:
                self.btn_mobile_v_login.Enable()
        elif data['type'] == 'img':
            if data['is_success']:
                self.is_img_v_login_success = True
            else:
                self.btn_img_v_login.Enable()
        else:
            pass

    '''
    '''
    def on_regist(self, evt):
        if not self.is_mobile_v_login_success:
            print u"短信账号未登录"
        elif not self.is_img_v_login_success:
            print u"打码账号未登录"
        else:
            print u"开始注册中..."


    def on_open(self, evt):
        pass

    def on_view(self, evt):
        pass

    def open_platform_url(self, evt):
        webbrowser.open(self.platform_url)

    def on_close_window(self, evt):
        self.Destroy()
