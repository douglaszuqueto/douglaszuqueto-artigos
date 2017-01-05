var topic = 'DZ/rasp/led';
var mqtt = new Paho.MQTT.Client(
    "test.mosquitto.org",
    8080,
    "DZ"
);

mqtt.onConnectionLost = onConnectionLost;
mqtt.onMessageArrived = onMessageArrived;

function onConnectionLost(responseObject) {
    return console.log("Status: " + responseObject.errorMessage);
}
function onMessageArrived(message) {
    return console.log(message.destinationName, ' -- ', message.payloadString);
}

// MQTT
var options = {
    timeout: 3,
    onSuccess: onSuccess,
    onFailure: onFailure
};
function onSuccess() {
    console.log("Conectado com o Broker MQTT");
    mqtt.subscribe(topic, {qos: 1}); // Assina o Tópico led/1
    $(".container a").removeClass('disabled');
}

function onFailure(message) {
    console.log("Connection failed: " + message.errorMessage);
}

// APP
function init() {
    mqtt.connect(options); // Conecta ao Broker MQTT
}
function led(value) { // Evento do Botão Desligar
    message = new Paho.MQTT.Message(value); // Cria uma nova mensagem
    message.destinationName = topic; // Define o tópico a ser enviado, neste caso: led/1
    mqtt.send(message); // Envia a mensagem
}

$(document).ready(function () {

    $('#save').on('click', function () {
        var broker, topic;

        broker = $('#broker').val();
        topic = $('#topic').val();

        console.log(broker, topic);

        return false;
    });
    $('#btn-on').click(function () {
        led("1");
    });
    $('#btn-off').click(function () {
        led("0");
    });

});
init();
