# -*- coding: utf-8 -*-
import wx
from wx.lib.pubsub import pub
import sys
import threading
import Queue
from grid.AcountGrid import *
from page.TipPage import TipPage
from service.SumaApiClient import *
from service.RuokuaiApiClient import *
from lib.EvtName import EvtName
SET_STD = False


class MainFrame(wx.Frame):

    def __init__(self, parent):
        self.title = u"注册助手"
        wx.Frame.__init__(self, parent, wx.ID_ANY, self.title, size=(960, 600))
        self.SetMaxSize((960, 600))
        self.SetMinSize((960, 600))
        # 设置背景颜色
        self.SetBackgroundColour(wx.Colour(236, 233, 216))
        # ===============以下为手机短信验证码账号信息=========
        self.label_mobile_v_account = wx.StaticText( self, wx.ID_ANY, u"帐号：", (520,10), wx.DefaultSize, 0)
        self.text_mobile_v_account = wx.TextCtrl(self, wx.ID_ANY, '', (560, 10), (100, 20), 0,)
        self.text_mobile_v_account.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.label_mobile_v_password = wx.StaticText(self, wx.ID_ANY, u"密码：", (670, 10), wx.DefaultSize, 0)
        self.text_mobile_v_password = wx.TextCtrl(self, wx.ID_ANY, '', (710, 10), (100, 20), wx.TE_PASSWORD)
        self.text_mobile_v_password.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.m_mobile_v_handler = SumaApiClient()
        pub.subscribe(self.m_mobile_v_handler.login_evt_listener, EvtName.mobile_v_handler_login)  # 注册监听登陆事件
        # ===============以下为图片识别账号信息=========
        self.label_img_v_account = wx.StaticText( self, wx.ID_ANY, u"帐号：", (520,130), wx.DefaultSize, 0)
        self.text_img_v_account = wx.TextCtrl(self, wx.ID_ANY, '', (560, 130), (100, 20), 0,)
        self.text_img_v_account.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.label_img_v_password = wx.StaticText(self, wx.ID_ANY, u"密码：", (670, 130), wx.DefaultSize, 0)
        self.text_img_v_password = wx.TextCtrl(self, wx.ID_ANY, '', (710, 130), (100, 20), wx.TE_PASSWORD)
        self.text_img_v_password.SetBackgroundColour(wx.Colour(245, 245, 245))
        self.m_img_v_handler = RuokuaiApiClient()
        pub.subscribe(self.m_img_v_handler.login_evt_listener, EvtName.img_v_handler_login)  # 注册监听登陆事件


        self.btn_on_buy = wx.Button(self, wx.ID_ANY, u"开始注册", (760, 320), (80, 30), 0)
        self.btn_on_buy.Bind(wx.EVT_BUTTON, self.on_regist)
        # 暂停购票按钮
        self.btn_off_buy = wx.Button(self, wx.ID_ANY, u"暂停注册", (860, 320), (80, 30), 0)
        # 保存购票成功记录
        self.btn_save_success = wx.Button(self, wx.ID_ANY, u"保存帐户", (860, 380), (80, 30), 0)
        self.grid = AccountGrid(self)
        self.create_menu_bar()
        # if SET_STD:
        #     sys.stdout = self.tip_log
        #     sys.stderr = self.err_log
        # 错误信息面板
        self.notebook = wx.Notebook(self, wx.ID_ANY, (2, 300), (750, 240), 0 | wx.NO_BORDER)
        self.notebook.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.notebook_info_tip = TipPage(self.notebook, 'tip')
        self.notebook.AddPage(self.notebook_info_tip, u"  提示信息  ")
        self.notebook_err_tip = TipPage(self.notebook, 'err')
        self.notebook.AddPage(self.notebook_err_tip, u"  错误信息  ")

        # pub.subscribe(self.mobile_v_handler_login, 'update')
        # pub.sendMessage("update", data='2323', extra1='asdasd')

    def on_regist(self, evt):
        mobile_v_account = self.text_mobile_v_account.GetValue()
        mobile_v_password = self.text_mobile_v_password.GetValue()
        if not mobile_v_account:
            print u"手机验证码账号未填写"
        elif not mobile_v_password:
            print u"手机验证码密码未填写"
        else:
            data = {'name': mobile_v_account, 'password': mobile_v_password}
            pub.sendMessage(EvtName.mobile_v_handler_login, data=data, extra1='登陆手机验证码账号')

        img_v_account = self.text_img_v_account.GetValue()
        img_v_password = self.text_img_v_password.GetValue()
        if not img_v_account:
            print u"图片识别账号未填写"
        elif not img_v_password:
            print u"图片识别密码未填写"
        else:
            pub.sendMessage(EvtName.img_v_handler_login, data={'name':img_v_account, 'password': img_v_account}, extra1='登陆手机验证码账号')

    '''
    创建菜单栏
    '''
    def create_menu_bar(self):
        menu_bar = wx.MenuBar()
        for menu_data in self.menu_data():
            menu_label = menu_data[0]
            menu_item = menu_data[1]
            menu = self.create_menu(menu_item)
            menu_bar.Append(menu, menu_label)
        self.SetMenuBar(menu_bar)

    '''
    创建菜单
    '''
    def create_menu(self, menu_data):
        menu = wx.Menu()
        for each_item in menu_data:
            if len(each_item) == 2:
                label = each_item[0]
                sub_menu = self.create_menu(each_item[1])
                menu.AppendMenu(wx.NewId(), label, sub_menu)  # 递归创建菜单项
            else:
                self.create_menu_item(menu, *each_item)
        return menu

    '''
    '''
    def create_menu_item(self, menu, label, status, handler, kind=wx.ITEM_NORMAL):
        if not label:
            menu.AppendSeparator()
            return
        menu_item = menu.Append(-1, label, status, kind)
        self.Bind(wx.EVT_MENU, handler,menu_item)

    '''
    菜单数据
    '''
    def menu_data(self):
        # 格式：菜单数据的格式现在是(标签, (项目))，其中：项目组成为：标签, 描术文字, 处理器, 可选的kind
        # 标签长度为2，项目的长度是3或4
        return [(u"&文件", (             # 一级菜单项
                           (u"&设置代理", u"设置代理", self.on_open),             # 二级菜单项
                           (u"&导出账号", u"导出账号", self.on_view),
                           ("", "", ""),                                       # 分隔线
                           (u"&退出", "Quit", self.on_close_window)))
       ]

    def on_open(self, evt):
        pass

    def on_view(self, evt):
        pass

    def on_close_window(self):
        self.Destroy()
