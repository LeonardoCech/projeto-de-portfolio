import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Line } from '@antv/g2plot';

// Utils
import { percentageFormatter } from 'utils/formatters';

// eslint-disable-next-line react/prop-types
const LineChart = (props) => {

    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (props.data && chartContainerRef.current) {
            if (!chartInstanceRef.current) {

                chartInstanceRef.current = new Line(chartContainerRef.current, {
                    width: props.canvasWidth || 600,
                    height: props.canvasHeigth || 75,
                    data: props.data,
                    xField: 'date',
                    yField: 'value',
                    padding: 'auto',
                    yAxis: {
                        line: null,
                        label: null,
                        tickLine: null,
                        grid: null,
                    },
                    xAxis: {
                        line: null,
                        tickLine: null,
                        label: null,
                    },
                    lineStyle: (d) => {
                        if (d.type === 'target') {
                            return {
                                lineDash: [2, 7],
                            };
                        }
                        return {
                            lineWidth: 2,
                        };
                    },
                    area: {
                        style: (d) => {
                            // Você pode ajustar a opacidade ou a cor conforme necessário
                            if (d.type === 'target') {
                                return {
                                    fillOpacity: 0
                                };
                            }
                            return {
                                fillOpacity: .25,
                            };
                        },
                    },
                    tooltip: {
                        formatter: (d) => ({
                            name: d.type,
                            value: percentageFormatter({v: d.value, multiply: false}),
                        }),
                    },
                    legend: false,
                    seriesField: 'type',
                    color: [props.colorPnL, props.colorTarget],
                });
            } else {
                chartInstanceRef.current.update({
                    data: props.data,
                });
            }
        }
    }, [props.data, props.threshold]);

    return <div ref={chartContainerRef}></div>;
};


LineChart.propTypes = {
    canvasHeigth: PropTypes.number,
    canvasWidth: PropTypes.number,
    colorPnL: PropTypes.string,
    colorTarget: PropTypes.string,
    data: PropTypes.array,
    threshold: PropTypes.number,
};


export default LineChart;
