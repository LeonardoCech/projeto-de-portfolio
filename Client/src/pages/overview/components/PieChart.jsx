import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Pie } from '@antv/g2plot';


const PieChart = (props) => {
    
    const{ data, currencyFormatter, showValues, t } = props;

    useEffect(() => {
        const piePlot = new Pie('pie-container', {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'category',
            radius: 1,
            innerRadius: .75,
            meta: {
                value: { formatter: (v) => showValues ? currencyFormatter(v) : '--' }
            },
            legend: {
                itemName: { formatter: (text) => t(text) }
            },
            label: null,
            statistic: {
                title: {
                    offsetY: -4,
                    customHtml: (container, view, datum) => {
                        const text = datum ? t(datum.category) : t('Total');
                        return `<div style="
                            width: 6rem;
                            font-size: .8rem;
                            text-align: center;
                            white-space: normal;
                            word-wrap: break-word;
                            word-break: normal;
                            line-height: 1.2rem;
                            overflow: hidden;
                        "><p>${text}</p></div>`;
                    },
                },
                content: {
                    offsetY: 4,
                    customHtml: (container, view, datum, data) => {
                        const total = data.reduce((r, d) => r + d.value, 0);
                        const text = showValues
                            ? (datum
                                ? `${currencyFormatter(datum.value)}`
                                : `${currencyFormatter(total)}`)
                            : '--';
                        return `<div style="
                            width: 8rem;
                            font-size: 1rem;
                            text-align: center;
                            white-space: normal;
                            word-wrap: break-word;
                            word-break: normal;
                            line-height: 1.2rem;
                            overflow: hidden;
                        "><p>${text}</p></div>`;
                    },
                },
            },
            interactions: [{ type: 'pie-statistic-active' }]
        });

        piePlot.render();

        return () => piePlot.destroy();
    }, [data, currencyFormatter, showValues, t]);

    return <div id="pie-container" style={{ height: 200 }}></div>;
};


PieChart.propTypes = {
    data: PropTypes.array,
    currencyFormatter: PropTypes.func,
    showValues: PropTypes.bool,
    t: PropTypes.func
};


export default PieChart;
