(function () {

  let mqtt = null;

  const brokerInput   = document.getElementById('broker');
  const portInput     = document.getElementById('port');
  const topicInput    = document.getElementById('topic');
  const checkboxInput = document.getElementsByClassName('checkbox');

  const saveButton    = document.getElementById('save');
  const connectButton = document.getElementById('connect');

  const defaultSettings = {
    broker: 'broker.iot-br.com',
    topic : 'DZ/rasp/relay/#',
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

  const changeCheckboxesState = (state = true) => {
    Array.from(checkboxInput).forEach(el => {
      el.disabled = state;
    });
  };

  const getRelayStates = () => {
    const url = '/states';

    fetch(url)
      .then(res => res.json(res))
      .then(res => loadStateInputs(res))
      .catch(error => console.log(error));

  };

  const loadStateInputs = (states) => {

    for ( let key in states ) {
      if ( states.hasOwnProperty(key) ) {
        checkboxInput[key].checked = states[key];
      }
    }
  };

  const mqttConnect = () => {
    return new Paho.MQTT.Client(
      defaultSettings.broker,
      parseInt(defaultSettings.port),
      `DZ- ${ Date.now() }`
    );
  };

  const onConnectionLost = (responseObject) => {
    let errorMessage = responseObject.errorMessage;
    console.log(`Status: ${ errorMessage }`);
    Materialize.toast(errorMessage, 2000);

  };

  const topicToArray = (topic) => {
    topic     = topic.split('/');
    let relay = parseInt(topic[3]) + 1;

    return `${topic[0]}/${topic[1]}/${topic[2]}/${relay}`;
  };

  const changeSwitchState = (topic, msg) => {
    let relay = parseInt((topic.split('/'))[3]);

    Array.from(checkboxInput).forEach(el => {
      let name = parseInt(el.name);
      if ( name === relay ) {
        el.checked = parseInt(msg);
      }
    });
  };

  const onMessageArrived = (message) => {
    let msg   = message.payloadString;
    let topic = message.destinationName;

    console.log(` ${ topicToArray(topic) } -- ${ msg }`);
    changeSwitchState(topic, msg);

  };

  const onSuccess = () => {
    mqtt.subscribe(defaultSettings.topic, { qos: 1 });
    Materialize.toast('Conectado ao broker', 2000);

    changeCheckboxesState(false);
  };

  const onFailure = (message) => {
    console.log(`Connection failed: ${ message.errorMessage }`);
  };

  const connect = () => {
    mqtt                  = mqttConnect();
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    mqtt.connect({
      timeout  : 10,
      onSuccess: onSuccess,
      onFailure: onFailure
    });
  };

  const save = () => {
    localStorage.setItem('defaultSettings', JSON.stringify({
      broker: brokerInput.value,
      port  : portInput.value,
      topic : topicInput.value
    }));
    Materialize.toast('Configurações salvas com sucesso!', 1000);

    loadConfigs();
  };

  const createMessage = (topic, value) => {
    let message             = new Paho.MQTT.Message(value.toString());
    message.destinationName = `DZ/rasp/relay/${topic}`;
    mqtt.send(message);

    Materialize.toast(`Rele ${parseInt(topic) + 1}: ${value === 1 ? 'Ligado' : 'Desligado'}`, 1000);
  };

  const sendMessage = (el) => {
    let topic = el.srcElement.name;
    let value = el.srcElement.checked ? el.srcElement.value = 1 : el.srcElement.value = 0;

    createMessage(topic, value);
  };

  const init = () => {
    loadConfigs();
    getRelayStates();

    brokerInput.value = defaultSettings.broker;
    portInput.value   = defaultSettings.port;
    topicInput.value  = defaultSettings.topic;

    saveButton.addEventListener('click', save);
    connectButton.addEventListener('click', connect);

    Array.from(checkboxInput).forEach(link => {
      link.addEventListener('change', sendMessage);
    });

  };

  init();

})();
