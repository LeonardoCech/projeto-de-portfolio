/* eslint-disable react/prop-types */
import React from 'react';


function TradesPanel({ data }) {

    return (
        <table>
            <thead>
                <tr>
                    {data.header.map((item, index) => {
                        return <th key={index}>{item}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {data.body.map((row, index) => {
                    return <tr key={index}>{
                        row.map((item, index) => {
                            return <td key={index}>{item}</td>;
                        })
                    }</tr>;
                })}
            </tbody>
        </table>
    );
}

export default TradesPanel;
