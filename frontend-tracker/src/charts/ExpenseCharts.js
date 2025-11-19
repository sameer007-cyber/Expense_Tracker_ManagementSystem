import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import API from '../api/axios';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ExpenseCharts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/expenses'); // all items for user
        setItems(res.data.expenses);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const categories = [...new Set(items.map(i => i.category || 'Other'))];
  const totals = categories.map(c => items.filter(i => i.category === c).reduce((s, it) => s + it.amount, 0));

  // monthly aggregation
  const monthly = {};
  items.forEach(i => {
    const dt = new Date(i.date);
    const key = `${dt.getFullYear()}-${('0'+(dt.getMonth()+1)).slice(-2)}`;
    monthly[key] = (monthly[key] || 0) + i.amount;
  });
  const months = Object.keys(monthly).sort();
  const monthTotals = months.map(m => monthly[m]);

  const doughData = { labels: categories, datasets: [{ data: totals, backgroundColor: ['#7c3aed','#f97316','#ef4444','#06b6d4','#a78bfa'] }] };
  const barData = { labels: months, datasets: [{ label: 'Amount', data: monthTotals, backgroundColor: '#7c3aed' }] };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="font-medium mb-2">By Category</h4>
        <Doughnut data={doughData} />
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="font-medium mb-2">Monthly</h4>
        <Bar data={barData} />
      </div>
    </div>
  );
}
