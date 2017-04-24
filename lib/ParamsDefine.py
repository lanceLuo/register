# -*- coding:utf-8 -*-
import sys
import os


class ParamsDefine:

    img_v_ruokuai_type_id = 3060  # 打码类型ID
    img_v_ruokuai_soft_id = 79933  # 打码开发者ID
    img_v_ruokuai_soft_key = '7acf98c4b8de4cb3bcd46c6e43d314c1'  # 打码开发者KEY
    img_v_time_out = 90
    platform_url = 'http://www.dobest.com'
    set_std = True
    mobile_suma_pid = 20486
    mobile_v_regist_url = 'www.eobzz.com/newUpPage/registered.html?makeUserID=weilong'
    img_v_regist_url = 'http://www.dobest.com'
    register_title = u'游卡注册助手  By：卫龙  QQ：83605654   线报群：309770518'
    register_save_path = u"{}{}".format(os.path.dirname(sys.argv[0]), u"/data/account.txt")

    def __init__(self):
        pass