# -*- coding:utf-8 -*-
import xml.sax
import xml.sax.handler


class XMLHandler(xml.sax.handler.ContentHandler):
    def __init__(self):
        self.buffer = ""
        self.mapping = {}

    def startElement(self, name, attributes):
        self.buffer = ""

    def characters(self, data):
        self.buffer += data

    def endElement(self, name):
        self.mapping[name] = self.buffer

    def get_dict(xml_str):
        xml_str = xml_str.encode('utf8')
        xh = XMLHandler()
        xml.sax.parseString(xml_str, xh)
        return xh.mapping