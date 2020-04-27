/**
 * Created by hao.cheng on 2017/5/5.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

let xAxisData = [];
let data = [];
for (let i = 0; i < 50; i++) {
    xAxisData.push(i);
    data.push(Math.random() * 20000 + 1000);
}

const option = {
    title: {
        text: '最近50天订单数',
        left: 'center',
        textStyle: {
            color: '#ccc',
            fontSize: 14
        }
    },
    backgroundColor: '#08263a',
    xAxis: [{
        show: true,
        data: xAxisData,
        axisLabel: {
            textStyle: {
                color: '#ccc'
            }
        }
    }, {
        show: false,
        data: xAxisData
    }],
    tooltip: {},
    visualMap: {
        show: false,
        min: 0,
        max: 50,
        dimension: 0,
        inRange: {
            color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
        }
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#ccc'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#08263f'
            }
        },
        axisTick: {
            show: false
        }
    },
    series: [
        {
        name: 'Simulate Shadow',
        type: 'line',
        data: data,
        z: 2,
        showSymbol: false,
        animationDelay: 0,
        animationEasing: 'linear',
        animationDuration: 1200,
        lineStyle: {
            normal: {
                color: 'transparent'
            }
        },
        areaStyle: {
            normal: {
                color: '#08263a',
                shadowBlur: 50,
                shadowColor: '#000'
            }
        }
    }, {
        name: '订单数',
        type: 'bar',
        data: data,
        xAxisIndex: 1,
        z: 3,
        itemStyle: {
            normal: {
                barBorderRadius: 5
            }
        }
    }],
    animationEasing: 'elasticOut',
    animationEasingUpdate: 'elasticOut',
    animationDelay: function (idx: number) {
        return idx * 20;
    },
    animationDelayUpdate: function (idx: number) {
        return idx * 20;
    }
};
const EchartsProjects = () => (
    <ReactEcharts
        option={option}
        style={{height: '212px', width: '100%'}}
        className={'react_for_echarts'}
    />
);

export default EchartsProjects;