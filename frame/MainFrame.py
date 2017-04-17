# -*- coding:utf-8 -*-
import wx
import sys
from grid.AcountGrid import AccountGrid
SET_STD = True


class MainFrame(wx.Frame):
    def __init__(self, parent):
        self.title = u"注册助手"
        wx_size = (960, 600)
        wx.Frame.__init__(self, parent, wx.ID_ANY, self.title, size=wx_size)
        self.SetMaxSize(wx_size)
        self.SetMinSize(wx_size)
        self.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.grid = AccountGrid(self)
        self.create_menu_bar()
        if SET_STD:
            sys.stdout = self.tip_log
            sys.stderr = self.err_log

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
