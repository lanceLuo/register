# -*- coding:utf-8 -*-
import wx.grid


class AccountGrid(wx.grid.Grid):
    def __init__(self, parent):
        wx.grid.Grid.__init__(self, parent, -1, size=(500, 290))
        self.SetRowLabelSize(30)
        self.CreateGrid(30, 3)
        # simple cell formatting
        self.SetColSize(0, 150)
        self.SetColSize(1, 150)
        self.SetColSize(2, 150)
        self.SetColLabelValue(0, u"注册手机")
        self.SetColLabelValue(1, u"密码")
        self.SetColLabelValue(2, u"注册时间")
