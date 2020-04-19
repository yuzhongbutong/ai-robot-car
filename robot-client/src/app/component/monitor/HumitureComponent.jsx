import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';
import 'echarts/theme/macarons';

class HumitureComponent extends Component {

  componentDidMount() {
    this.temperatureChart = echarts.init(document.getElementById('temperature'), 'macarons');
    this.humidityChart = echarts.init(document.getElementById('humidity'), 'macarons');
    window.onresize = () => {
      this.temperatureChart.resize();
      this.humidityChart.resize();
    };
    this.temperatureChart.setOption({
      tooltip: {
        formatter: (obj) => {
          return obj.seriesName + '<br>' + obj.value + '℃ / ' + (obj.value * 1.8 + 32) + '℉';
        }
      },
      series: [
        {
          name: 'Temperature',
          type: 'gauge',
          radius: '90%',
          min: -40,
          max: 60,
          endAngle: 0,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 8
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto'
            }
          },
          splitLine: {
            length: 15,
            lineStyle: {
              color: 'auto'
            }
          },
          pointer: {
            width: 5
          },
          title: {
            offsetCenter: [0, '-20%'],
          },
          detail: {
            fontWeight: 'bolder'
          },
          data: [{value: 0, name: '℃ / ℉'}]
        },
        {
          type: 'gauge',
          radius: '65%',
          min: -40,
          max: 140,
          endAngle: 0,
          splitNumber: 9,
          axisLine: {
            lineStyle: {
              width: 5
            }
          },
          axisTick: {
            length: 8,
            lineStyle: {
              color: 'auto'
            }
          },
          splitLine: {
            length: 10,
            lineStyle: {
              color: 'auto'
            }
          },
          pointer: {
            show: false
          },
          detail: {
            show: false
          },
        }
      ]
    });
    this.humidityChart.setOption({
      tooltip: {
        formatter: (obj) => {
          return obj.seriesName + '<br>' + obj.value + '%RH';
        }
      },
      series: [
        {
          name: 'Humidity',
          type: 'gauge',
          radius: '90%',
          min: 0,
          max: 100,
          endAngle: -45,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 8
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto'
            }
          },
          splitLine: {
            length: 15,
            lineStyle: {
              color: 'auto'
            }
          },
          pointer: {
            width: 5
          },
          title: {
            offsetCenter: [0, '-20%'],
          },
          detail: {
            fontWeight: 'bolder'
          },
          data: [{value: 0, name: '%RH'}]
        }
      ]
    });
  }

  componentDidUpdate() {
    const {temp, humi} = this.props.humiture;
    const temperatureOption = this.temperatureChart.getOption();
    temperatureOption.series[0].data[0].value = temp;
    this.temperatureChart.setOption(temperatureOption);

    const humidityOption = this.humidityChart.getOption();
    humidityOption.series[0].data[0].value = humi;
    this.humidityChart.setOption(humidityOption);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <div id="temperature" style={{width: '100%', height: 300}}></div>
          </div>
          <div className="col-sm-6 col-xs-12">
            <div id="humidity" style={{width: '100%', height: 300}}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default HumitureComponent;