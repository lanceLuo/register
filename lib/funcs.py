# -*- coding:utf-8 -*-
import sys
import os
import time
import json
import re
import random


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


def random_str(length, no_repeat=False):
    if length > 18:
        length = 18
    s = '1234567890qwertyuiopasdfghjklzxcvbnm'
    ls = len(s)
    t = []
    while True:
        j = s[random.randint(0, ls-1)]
        if no_repeat:
            if j not in t:
                t.append(j)
        else:
            t.append(j)
        if len(t) >= length:
            break

    return "".join(t)


def main_is_frozen():
    """Return ''True'' if we're running from a frozen program."""
    import imp
    return (
        # new py2exe
        hasattr(sys, "frozen") or
        # tools/freeze
        imp.is_frozen("__main__"))


def get_main_dir():
    """Return the script directory - whether we're frozen or not."""
    if main_is_frozen():
        return os.path.abspath(os.path.dirname(sys.executable))
    return os.path.abspath(os.path.dirname(sys.argv[0]))

