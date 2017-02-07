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
      format: (value, ratio) => {
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