# -*- coding:utf-8 -*-
import time
import json
import re

def get_millis_time():
    return int(round(time.time() * 1000))


def dict_to_query_str(param_dict):
    s = ''
    for key in param_dict:
        s += "{}={}&".format(key, param_dict[key])
    return s[0:-1]


def jsonp_to_dict(jsonp):
    if isinstance(jsonp, str):
        match = re.findall(r'.+\((.+)\)', jsonp)
        if len(match) == 0:
            return False
        try:
            d = json.loads(match[0])
        except:
            return False
        finally:
            if isinstance(d, dict):
                return d
    return False