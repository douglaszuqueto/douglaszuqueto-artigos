(function () {

  const brokerInput = document.getElementById('broker');
  const portInput   = document.getElementById('port');
  const topicInput  = document.getElementById('topic');

  const saveButton    = document.getElementById('save');
  const connectButton = document.getElementById('connect');

  /* json com configuracoes iniciais de conexao */
  let json = {
    broker: 'broker.iot-br.com',
    topic: 'DZ/gauge/temperature',
    port: 8880
  };

  /* resgata as informações do localStorage caso existir */
  if ( JSON.parse(localStorage.getItem('mqtt')) ) {
    json = JSON.parse(localStorage.getItem('mqtt'));
  }

  const mqttConnect = () => {
    return new Paho.MQTT.Client(
      json.broker,
      parseInt(json.port),
      "DZ-" + Date.now()
    );
  };

  const onConnectionLost = (responseObject) => {
    let errorMessage = responseObject.errorMessage;
    console.log("Status: " + errorMessage);
    Materialize.toast(errorMessage, 2000);

  };

  const onMessageArrived = (message) => {
    let msg = message.payloadString;
    console.log(message.destinationName, ' -- ', msg);

    if ( msg > 50 ) {
      return false;
    }

    if ( msg == gauge.data.values('temperature')[0] ) {
      return false;
    }

    // metodo responsável por atualizar o Gauge
    gauge.load({
      columns: [
        ['temperature', msg]
      ]
    });

  };

  /* Instancia o paho-mqtt */
  let mqtt              = mqttConnect();
  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;


  const onSuccess = () => {
    mqtt.subscribe(json.topic, { qos: 1 }); // Assina o Tópico
    Materialize.toast('Conectado ao broker', 2000);
  };

  const onFailure = (message) => {
    console.log("Connection failed: " + message.errorMessage);
  };

  /* função de conexão */
  const connect = () => {

    /* define aos eventos de Conexão seus respectivos callbacks*/
    let options = {
      timeout: 3,
      onSuccess: onSuccess,
      onFailure: onFailure
    };

    mqtt.connect(options); // Conecta ao Broker MQTT
  };

  const save = () => {
    var broker, topic;
    broker = $('#broker').val();
    port   = $('#port').val();
    topic  = $('#topic').val();

    /* salva no localStorage os dados do formulário */
    localStorage.setItem("mqtt", JSON.stringify({ broker: broker, port: port, topic: topic }));

    return location.reload();
  };

  const init = () => {
    brokerInput.value = json.broker;
    portInput.value   = json.port;
    topicInput.value  = json.topic;
  };

  /* App */
  init();

  /* Eventos de configuração */
  saveButton.addEventListener('click', save);
  connectButton.addEventListener('click', connect);

})();