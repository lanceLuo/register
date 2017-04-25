#coding=utf-8
from distutils.core import setup
import py2exe
import glob
#
libRootPath = r'D:\Python27'

data_files = [
        # 'D:/buy.ico',
          ]

setup(
    windows=[
        {
            "script": 'D:/code/python/register/RegisterApp.py',
            # "icon_resources": [(1, "buy.ico")]
        }],
    options={
        'py2exe': {
                       'dll_excludes':['MSVCP90.dll',
                                       # 'numpy-atlas.dll'
                                        "w9xpopen.exe",
                                       'libcurl.dll'
                                       ],
                       'packages': ['wx.lib.pubsub'],
                       "bundle_files": 1,
                       "optimize": 2,
                       "compressed": 1,
            "ascii": 1,
                        "includes": ['pycurl'],
                        # "excludes":['pycurl']
                       # 'excludes': ['_gtkagg', '_tkagg', '_agg2', '_cairo', '_cocoaagg', '_fltkagg', '_gtk', '_gtkcairo', ]
                   },
    },
    zipfile=None,
    version="0.0.1.0",
    data_files=data_files
)
