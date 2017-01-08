/* json com configuracoes iniciais de conexao */
var json = {
  broker: 'test.mosquitto.org',
  topic: 'DZ/rasp/led'
};

/* resgata as informações do localStorage caso existir */
if( JSON.parse(localStorage.getItem('mqtt'))){
  json = JSON.parse(localStorage.getItem('mqtt'));
}

/* Instancia o paho-mqtt */
var mqtt = new Paho.MQTT.Client(
  json.broker,
  8080,
  "DZ-" + Date.now()
);

/* define aos eventos seus respectivos callbacks*/
mqtt.onConnectionLost = onConnectionLost;
mqtt.onMessageArrived = onMessageArrived;

function onConnectionLost(responseObject) {
  return console.log("Status: " + responseObject.errorMessage);
}
function onMessageArrived(message) {
  var msg = message.payloadString;
  if(msg === '1'){
    Materialize.toast('Objeto ligado', 2000);
  }else{
    Materialize.toast('Objeto desligado', 2000);
  }
  return console.log(message.destinationName, ' -- ', msg);
}

/* define aos eventos de Conexão seus respectivos callbacks*/
var options = {
  timeout: 3,
  onSuccess: onSuccess,
  onFailure: onFailure
};
function onSuccess() {
  console.log("Conectado com o Broker MQTT");
  mqtt.subscribe(json.topic, {qos: 1}); // Assina o Tópico led/1
  $(".container .btn-led").removeAttr('disabled');
}

function onFailure(message) {
  console.log("Connection failed: " + message.errorMessage);
}

/* função de conexão */
function init() {
  mqtt.connect(options); // Conecta ao Broker MQTT
}

/* função auxiliar para ligar/desligar o objeto conectado */
function led(value) { // Evento do Botão Desligar
  message = new Paho.MQTT.Message(value); // Cria uma nova mensagem
  message.destinationName = json.topic; // Define o tópico a ser enviado, neste caso: led/1
  mqtt.send(message); // Envia a mensagem
}

$(document).ready(function () {
  $('#broker').val(json.broker);
  $('#topic').val(json.topic);

  /* Eventos de configuração */
  $('#save').on('click', function () {
    var broker, topic;
    broker = $('#broker').val();
    topic = $('#topic').val();

    /* salva no localStorage os dados do formulário */
    localStorage.setItem("mqtt", JSON.stringify({broker: broker, topic: topic}));

    location.reload();
    return false;
  });

  $('#connect').on('click', function(){
    init();
  });

  /* Eventos Liga / Desliga objeto conectado */
  $('#btn-on').on('click', function () {
    led("1");
  });
  $('#btn-off').on('click', function () {
    led("0");
  });

});
