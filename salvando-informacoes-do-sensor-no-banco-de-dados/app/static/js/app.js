(function () {

  const brokerInput = document.getElementById('broker');
  const portInput   = document.getElementById('port');
  const topicInput  = document.getElementById('topic');

  const saveButton    = document.getElementById('save');
  const connectButton = document.getElementById('connect');

  let json = {
    broker: 'broker.iot-br.com',
    topic: 'DZ/gauge/temperature',
    port: 8880
  };

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

    gauge.load({
      columns: [
        ['temperature', msg]
      ]
    });

  };

  let mqtt              = mqttConnect();
  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;


  const onSuccess = () => {
    mqtt.subscribe(json.topic, { qos: 1 });
    Materialize.toast('Conectado ao broker', 2000);
  };

  const onFailure = (message) => {
    console.log("Connection failed: " + message.errorMessage);
  };

  const connect = () => {

    let options = {
      timeout: 3,
      onSuccess: onSuccess,
      onFailure: onFailure
    };

    mqtt.connect(options);
  };

  const save = () => {
    var broker, topic;
    broker = $('#broker').val();
    port   = $('#port').val();
    topic  = $('#topic').val();

    localStorage.setItem("mqtt", JSON.stringify({ broker: broker, port: port, topic: topic }));

    return location.reload();
  };

  const init = () => {
    brokerInput.value = json.broker;
    portInput.value   = json.port;
    topicInput.value  = json.topic;
  };

  init();
  saveButton.addEventListener('click', save);
  connectButton.addEventListener('click', connect);

})();