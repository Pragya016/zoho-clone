import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { fetchData } from '../utility';
import styles from './css/chart.module.css';

interface ChartData {
    value: number;
    label: string;
}

interface ResponseData {
    userCount: string;
    users_department: string;
}

export default function PieChartTab() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    getChartData();
  }, []);

  async function getChartData() {
    try {
        const response = await fetchData('/api/admin/chart-data', 'GET');

        if(response.status === 200) {
            const updatedChartData = response.data.map((data: ResponseData, index: number) => {
                return {
                    id: index,
                    value: +data.userCount,
                    label: data.users_department || 'Unknown'
                };
            });

            setChartData(updatedChartData);
        }

    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div id={styles.chartContainer}>
        <h1 id={styles.chartHeading}>Pie Chart of the employees based on Departments</h1>
        <div id={styles.chart}>
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { fade: 'global', highlight: 'item' },
      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          width={1100}
          height={600}
        />
        </div>
    </div>
  );
}
