import sys
import time
import paho.mqtt.client as mqtt
import Adafruit_MCP9808.MCP9808 as MCP9808

broker = "broker.iot-br.com"
port = 8080
keppAlive = 60
topic = 'DZ/gauge/temperature'

sensor = MCP9808.MCP9808()
sensor.begin()

def on_connect(client, userdata, flags, rc):
  print("[STATUS] Conectado ao Broker. Resultado de conexao: " + str(rc))

  client.subscribe(topic)

try:
  print("[STATUS] Inicializando MQTT...")

  client = mqtt.Client()
  client.on_connect = on_connect

  client.connect(broker, port, keppAlive)

  while(True):
    temp = sensor.readTempC()
    temp = '{0:0.2F}'.format(temp)
    print("Temperature: " + temp + "*C")

    client.publish(topic, temp)

    time.sleep(1.0)

except KeyboardInterrupt:
  print "\nScript finalizado."
  sys.exit(0)
