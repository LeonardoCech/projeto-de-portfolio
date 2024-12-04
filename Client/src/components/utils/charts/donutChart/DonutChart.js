import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Pie } from '@antv/g2plot';

// Utils
import { percentageFormatter } from 'utils/formatters';


const DonutChart = (props) => {

    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {

        if (props.data && chartContainerRef.current) {
            if (!chartInstanceRef.current) {

                chartInstanceRef.current = new Pie(chartContainerRef.current, {
                    width: props.canvasWidth || 300,
                    height: props.canvasHeight || 200,
                    data: props.data,
                    angleField: 'value',
                    colorField: 'type',
                    padding: 'auto',
                    radius: .8,
                    innerRadius: .6,
                    legend: false,
                    stroke: null,
                    tooltip: {
                        formatter: (item) => ({
                            name: item.type,
                            value: percentageFormatter({ v: item.value, positiveSignal: false }),
                        }),
                    },
                    statistic: {
                        title: false,
                        content: {
                            formatter: () => '',
                        },
                    },
                    label: {
                        formatter: (item) => item.type,
                        style: {
                            fontWeight: 'bold', // Define o peso da fonte para negrito
                        }
                    },
                    pieStyle: {
                        stroke: null, // Define a cor da borda dos segmentos como nula
                        lineWidth: 0, // Define a largura da linha da borda dos segmentos como 0
                    },
                    appear: {
                        animation: 'clipingWithData',
                    },
                    color: ['#2653A4', '#2F64C6', '#497AD4', '#6A92DC', '#8BAAE4'],
                });

                chartInstanceRef.current.render();
            } else {
                /*
                chartInstanceRef.current.update({
                    data: props.data,
                });
                */
                chartInstanceRef.current.changeData(props.data);
            }
        }
    }, [props.data, props.canvasHeight, props.canvasWidth]);

    return <div ref={chartContainerRef}></div>;
};


DonutChart.propTypes = {
    canvasHeight: PropTypes.number,
    canvasWidth: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
    })),
};


export default DonutChart;
