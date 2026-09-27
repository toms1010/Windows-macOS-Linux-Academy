import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ComparisonCharts() {
  const data = {
    labels: ['Performance', 'Security', 'Memory', 'Gaming', 'Programming'],
    datasets: [
      {
        label: 'Windows',
        data: [7, 6, 4, 9, 7],
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
      },
      {
        label: 'Linux',
        data: [9, 9, 8, 6, 9],
        backgroundColor: 'rgba(234, 88, 12, 0.6)',
      },
    ],
  };

  return (
    <div className="glass p-6 rounded-2xl mt-8">
      <h3 className="text-xl font-semibold mb-4">Performance Rating (1-10)</h3>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
}
