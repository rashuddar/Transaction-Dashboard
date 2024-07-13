import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import './index.css';

export default function StatsChart({ itemPriceRange, monthName }) {
  let list = Object.keys(itemPriceRange).map((each) => ({
    name: each,
    Items: itemPriceRange[each],
  }));

  return (
    <div className="chart-container">
      <h1>
        <u>Bar Charts Stats</u> - <i style={{ color: 'rgb(237, 46, 78)' }}>{monthName}</i>
      </h1>
      <ResponsiveContainer className='repcontainer' height={500}>
        <BarChart
          data={list}
          margin={{
            top: 35,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis interval={1} tickCount={10} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Items" fill="rgb(237, 46, 78)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
