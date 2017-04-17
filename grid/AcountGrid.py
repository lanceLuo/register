# -*- coding:utf-8 -*-
import wx.grid


class AccountGrid(wx.grid.Grid):
    def __init__(self, parent):
        wx.grid.Grid.__init__(self, parent, -1, size=(960, 290))
        self.SetRowLabelSize(30)
        self.CreateGrid(20, 6)
        # simple cell formatting
        self.SetColSize(0, 90)
        self.SetColSize(1, 120)
        self.SetColSize(2, 200)
        self.SetColSize(3, 60)
        self.SetColSize(4, 80)
        self.SetColSize(5, 360)
        self.SetColLabelValue(0, u"帐号")
        self.SetColLabelValue(1, u"账号状态")
        self.SetColLabelValue(2, u"购票状态")
        self.SetColLabelValue(3, u"购票次数")
        self.SetColLabelValue(4, u"价格")
        self.SetColLabelValue(5, u"购票信息")
