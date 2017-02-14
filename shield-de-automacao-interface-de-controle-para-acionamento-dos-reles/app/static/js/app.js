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

  const changeCheckboxesState = (state = true) => {
    Array.from(checkboxInput).forEach(el => {
      el.disabled = state;
    });
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

  const onMessageArrived = (message) => {
    let msg = message.payloadString;
    console.log(` ${ message.destinationName } -- ${ msg }`);
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
    message.destinationName = `DZ/rasp/${topic}`;
    mqtt.send(message);

    Materialize.toast(`${topic}:${value}`, 1000);
  };

  function sendMessage(el) {
    let topic = el.srcElement.name;
    let value = this.checked ? this.value = 1 : this.value = 0;

    createMessage(topic, value);
  }

  const createInputRele = (name = 'Rele', value = 'rele') => {

    let reles = "<div class='row'>";
    reles += "<div class='input-field col s3'>";
    reles += "<div class='switch'>";
    reles += "<label>";
    reles += name;
    reles += "<input type='checkbox' class='checkbox' name='" + value + "' disabled>";
    reles += "<span class='lever'></span>";
    reles += "</label>";
    reles += "</div>";
    reles += "</div>";
    reles += "</div>";

    return reles;

  };

  const createInputsReles = () => {
    let target   = document.getElementById('reles');
    let qtdReles = 10;
    let html     = '';

    for ( let i = 0; i < qtdReles; i++ ) {

      html += createInputRele(`Rele ${i + 1}`, `${i}`);

    }

    target.innerHTML = html;

  };

  const init = () => {
    loadConfigs();

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
