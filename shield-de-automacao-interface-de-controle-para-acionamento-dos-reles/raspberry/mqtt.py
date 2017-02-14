import sys
import time
import paho.mqtt.client as mqtt

import Adafruit_GPIO.MCP230xx as MCP
import Adafruit_GPIO as GPIO

broker    = "broker.iot-br.com"
port      = 8080
keppAlive = 60
topic     = 'DZ/rasp/rele/#'

mcp = MCP.MCP23017()
mcp.setup(0, GPIO.OUT)

def on_connect(client, userdata, flags, rc):
  print("[STATUS] Conectado ao Broker. Resultado de conexao: " + str(rc))

  client.subscribe(topic)

def on_message(client, userdata, msg):
  message = str(msg.payload)  # converte a mensagem recebida
  print("[MSG RECEBIDA] Topico: " + msg.topic + " / Mensagem: " + message)

  topic = str(msg.topic).split('/')
  relayName = int(topic[3])

  if message == '1':
    mcp.output(relayName, True)
  else:
    mcp.output(relayName, False)

  time.sleep(0.1)

try:
  print("[STATUS] Inicializando MQTT...")

  client            = mqtt.Client()
  client.on_connect = on_connect
  client.on_message = on_message

  client.connect(broker, port, keppAlive)
  client.loop_forever()

except KeyboardInterrupt:
  print "\nScript finalizado."
  sys.exit(0)
