/* json com configuracoes iniciais de conexao */
var json = {
    broker: 'broker.iot-br.com',
    topic: 'DZ/gauge/temperature',
    port: 8880
};

/* resgata as informações do localStorage caso existir */
if (JSON.parse(localStorage.getItem('mqtt'))) {
    json = JSON.parse(localStorage.getItem('mqtt'));
}

/* Instancia o paho-mqtt */
var mqtt = new Paho.MQTT.Client(
    json.broker,
    parseInt(json.port),
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
    console.log(message.destinationName, ' -- ', msg);

    if (msg > 50) {
        return false;
    }
    if (msg == gauge.data.values('temperature')[0]) {
        return false;
    }

    // metodo responsável por atualizar o Gauge
    gauge.load({
        columns: [
            ['temperature', msg]
        ]
    });

}

/* define aos eventos de Conexão seus respectivos callbacks*/
var options = {
    timeout: 3,
    onSuccess: onSuccess,
    onFailure: onFailure
};
function onSuccess() {
    console.log("Conectado com o Broker MQTT");
    mqtt.subscribe(json.topic, {qos: 1}); // Assina o Tópico
    Materialize.toast('Conectado ao broker', 1000);
}

function onFailure(message) {
    console.log("Connection failed: " + message.errorMessage);
}

/* função de conexão */
function init() {
    mqtt.connect(options); // Conecta ao Broker MQTT
}

/* Configuracao do Gauge */
var gauge = c3.generate({
    bindto: '#gauge',
    data: {
        columns: [
            ['temperature', 0]
        ],
        type: 'gauge',
    },
    gauge: {
        label: {
            format: function (value, ratio) {
                return value + ' ºC';
            },
            show: false
        },
        min: 0,
        max: 50,
        units: ' ºC',
    },
    color: {
        pattern: ['#227EAF', '#F97600'],
        threshold: {
            unit: 'ºC',
            max: 50,
            values: [10, 30]
        }
    },
    size: {
        height: 180
    }
});

/* App */
$(document).ready(function () {
    $('#broker').val(json.broker);
    $('#port').val(json.port);
    $('#topic').val(json.topic);

    /* Eventos de configuração */
    $('#save').on('click', function () {
        var broker, topic;
        broker = $('#broker').val();
        port = $('#port').val();
        topic = $('#topic').val();

        /* salva no localStorage os dados do formulário */
        localStorage.setItem("mqtt", JSON.stringify({broker: broker, port: port, topic: topic}));

        location.reload();
        return false;
    });

    $('#connect').on('click', function () {
        init();
    });
});
