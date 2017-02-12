#!/usr/bin/python

import time
import Adafruit_MCP9808.MCP9808 as MCP9808

sensor = MCP9808.MCP9808()
sensor.begin()

print('Press Ctrl-C to quit.')
while True:
    temp = sensor.readTempC()
    print('Temperature: {0:0.3F}*C'.format(temp))
    time.sleep(1.0)

