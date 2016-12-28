import RPi.GPIO as GPIO # Aqui e importado o pacote de GPIO para que assim o script teja acesso as GPIO da rpi
import time # Importa o pacto time - semelhante ao delay do arduino

GPIO.setwarnings(False) # Aqui e setado os 'warnings' como falso, para nao mostra-los no console
GPIO.setmode(GPIO.BCM) # Seta o tipo de pinagem da gpio, neste caso sera o BCM, que sao os alieases aos pinos nativos
GPIO.setup(17, GPIO.OUT) # seta a gpio 17 como saida - semelhante ao pinMode do arduino

# Aqui e criado uma funcao para ser invocada no escopo do script
def led( pin, delay ):
    GPIO.output(pin, GPIO.HIGH) # seta a gpio como HIGH - semelhante ao digitalWrite do arduino
    time.sleep(delay) # seta um delay com base no tempo passado no parametro da funcao
    GPIO.output(pin, GPIO.LOW) # coloca o nivel logico em LOW
    time.sleep(delay)

try:
# Aqui e o loop do script - semelhante ao loop() do arduino
    while True:
        led(17, 1) # invoca a funcao led passando como parametro o pino do led bem como o tempo de delay, que neste caso e 1 segundo

except KeyboardInterrupt:
    GPIO.cleanup() # resetara o status de todas gpio, assim caso fosse interrompa o script e o led estivesse acesso, essa chamada fazera com que o le seja apagado
