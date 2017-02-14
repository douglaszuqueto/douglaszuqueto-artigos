import sys
import time

import Adafruit_GPIO.MCP230xx as MCP
import Adafruit_GPIO as GPIO

mcp = MCP.MCP23017()
mcp.setup(0, GPIO.OUT)

relayName = 0

try:

  while(True):
    mcp.output(relayName, True)
    time.sleep(1)
    mcp.output(relayName, False)
    time.sleep(1)

except KeyboardInterrupt:
  mcp.output(relayName, False)
  print "\nScript finalizado."
  sys.exit(0)
