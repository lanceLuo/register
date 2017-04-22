# -*- coding:utf-8 -*-
import wx.grid
from wx.lib.pubsub import pub
from lib.EvtName import EvtName


class AccountGrid(wx.grid.Grid):
    def __init__(self, parent):
        wx.grid.Grid.__init__(self, parent, -1, size=(500, 290), style=wx.BORDER_THEME)
        self.SetRowLabelSize(30)
        self.CreateGrid(30, 3)
        # simple cell formatting
        self.SetColSize(0, 149)
        self.SetColSize(1, 149)
        self.SetColSize(2, 149)
        self.SetColLabelValue(0, u"手机号")
        self.SetColLabelValue(1, u"密码")
        self.SetColLabelValue(2, u"注册时间")
        self.current_row = 0
        # 开启注册成功监听
        pub.subscribe(self.add_new_account, EvtName.evt_register_success)

    def add_new_account(self, data, extra1, extra2=None):
        self.SetCellValue(row=self.current_row, col=0, s=data.get('mobile', ''))
        self.SetCellValue(row=self.current_row, col=1, s=data.get('password', ''))
        self.SetCellValue(row=self.current_row, col=2, s=data.get('reg_time', ''))
        self.current_row += 1
        if self.current_row >= self.GetNumberRows():
            self.AppendRows(10)
