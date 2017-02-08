(function () {

  let mqtt = null;

  const brokerInput = document.getElementById('broker');
  const portInput   = document.getElementById('port');
  const topicInput  = document.getElementById('topic');

  const saveButton    = document.getElementById('save');
  const connectButton = document.getElementById('connect');

  const defaultSettings = {
    broker: 'broker.iot-br.com',
    topic : 'DZ/gauge/temperature',
    port  : 8880
  };

  const loadConfigs = () => {
    if ( !JSON.parse(localStorage.getItem('defaultSettings')) ) {
      return;
    }

    let json = JSON.parse(localStorage.getItem('defaultSettings'));

    defaultSettings.broker = json.broker;
    defaultSettings.port   = json.port;
    defaultSettings.topic  = json.topic;
  };

  const mqttConnect = () => {
    return new Paho.MQTT.Client(
      defaultSettings.broker,
      parseInt(defaultSettings.port),
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

    if ( msg == getValueGauge() ) {
      return false;
    }

    setGaugeValue(msg);

  };

  const onSuccess = () => {
    mqtt.subscribe(defaultSettings.topic, { qos: 1 });
    Materialize.toast('Conectado ao broker', 2000);
  };

  const onFailure = (message) => {
    console.log("Connection failed: " + message.errorMessage);
  };

  const connect = () => {
    mqtt                  = mqttConnect();
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    mqtt.connect({
      timeout  : 3,
      onSuccess: onSuccess,
      onFailure: onFailure
    });
  };

  const save = () => {
    localStorage.setItem("defaultSettings", JSON.stringify({
      broker: brokerInput.value,
      port  : portInput.value,
      topic : topicInput.value
    }));
    Materialize.toast('Configurações salvas com sucesso!', 1000);

    loadConfigs();
  };

  const init = () => {
    loadConfigs();

    brokerInput.value = defaultSettings.broker;
    portInput.value   = defaultSettings.port;
    topicInput.value  = defaultSettings.topic;
  };

  init();
  saveButton.addEventListener('click', save);
  connectButton.addEventListener('click', connect);

})();