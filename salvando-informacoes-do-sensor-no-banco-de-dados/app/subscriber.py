import sys
import paho.mqtt.client as mqtt # importa o pacote mqtt
import sqlite3

def insertDatabase(message):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO temperature
        (temperature, created_at)
        VALUES (?, ?)
    """, (message, '2017-02-07'))

    conn.commit()
    conn.close()

broker = "broker.iot-br.com" # define o host do broker mqtt'
port = 8080 # define a porta do broker
keppAlive = 60 # define o keepAlive da conexao
topic = 'DZ/#' # define o topico que este script assinara

# funcao on_connect sera atribuida e chamada quando a conexao for iniciada
# ela printara na tela caso tudo ocorra certo durante a tentativa de conexao
# tambem ira assina o topico que foi declarado acima
def on_connect(client, userdata, flags, rc):
    print("[STATUS] Conectado ao Broker. Resultado de conexao: "+str(rc))

    client.subscribe(topic)

# possui o mesmo cenario que o on_connect, porem, ela sera atrelada ao loop
# do script, pois toda vez que receber uma nova mensagem do topico assinado, ela sera invocada
def on_message(client, userdata, msg):

    message = str(msg.payload) # converte a mensagem recebida
    print("[MSG RECEBIDA] Topico: "+msg.topic+" / Mensagem: "+ message) # imprime no console a mensagem

    if msg.topic == 'DZ/gauge/temperature':
        insertDatabase(message)

try:
    print("[STATUS] Inicializando MQTT...")

    client = mqtt.Client() # instancia a conexao
    client.on_connect = on_connect # define o callback do evento on_connect
    client.on_message = on_message # define o callback do evento on_message

    client.connect(broker, port, keppAlive) # inicia a conexao
    client.loop_forever() # a conexao mqtt entrara em loop ou seja, ficara escutando e processando todas mensagens recebidas

except KeyboardInterrupt:
    print "\nScript finalizado."
    sys.exit(0)
