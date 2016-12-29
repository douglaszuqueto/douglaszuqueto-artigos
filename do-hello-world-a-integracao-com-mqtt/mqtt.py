import sys
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)

broker = "test.mosquitto.org"
port = 1883
keppAlive = 60
topic = 'DZ/#'

def on_connect(client, userdata, flags, rc):
    print("[STATUS] Conectado ao Broker. Resultado de conexao: "+str(rc))

    client.subscribe(topic)

def on_message(client, userdata, msg):
    message = str(msg.payload)
    print("[MSG RECEBIDA] Topico: "+msg.topic+" / Mensagem: "+message)

    if msg.topic == 'DZ/rasp/led':
        if(message == '1'):
            GPIO.output(pin, GPIO.HIGH)
        else:
            GPIO.output(pin, GPIO.LOW)

try:
    print("[STATUS] Inicializando MQTT...")

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(broker, port, keppAlive)
    client.loop_forever()
except KeyboardInterrupt:
    print "\nCtrl+C pressionado, encerrando aplicacao e saindo..."
    sys.exit(0)
