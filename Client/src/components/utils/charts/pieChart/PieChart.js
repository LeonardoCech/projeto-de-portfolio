/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { Pie } from '@antv/g2plot';


const PieChart = ({ data }) => {
    const chartContainer = useRef(null);
    const piePlotRef = useRef(null);

    useEffect(() => {
        if (!piePlotRef.current) {
            const piePlot = new Pie(chartContainer.current, {
                height: 200,
                appendPadding: 1,
                data,
                angleField: 'value',
                colorField: 'type',
                color: data.reduce((colors, obj) => { colors.push(obj.color); return colors; }, []),
                radius: .75,
                label: {
                    type: 'outer',
                    content: ({ type, percent }) => {
                        return `${type}\n${(percent * 100).toFixed(0)}%`;
                    },
                    style: {
                        fill: '#A6A6A6',
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    },
                    offset: 25,
                    layout: [
                        { type: 'line' },
                        { type: 'line' },
                    ],
                },
                legend: false,
                interactions: [{ type: 'element-active' }],
                tooltip: {
                    formatter: (datum) => {
                        return {
                            name: datum.type,
                            value: `${(datum.value * 100).toFixed(2)}%`,
                        };
                    },
                },
            });

            piePlot.render();
            piePlotRef.current = piePlot;
        }

        return () => {
            if (piePlotRef.current) {
                piePlotRef.current.destroy();
                piePlotRef.current = null;
            }
        };
    }, []);

    return <div ref={chartContainer}></div>;
};

export default PieChart;
