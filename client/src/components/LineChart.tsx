import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchData } from '../utility';
import styles from './css/chart.module.css';

interface ResponseData {
  userCount: string;
  users_department: string;
}

export default function LineChartTab() {
const [xAxis, setXAxis] = React.useState([]);
const [yAxis, setYAxis] = React.useState([]);

React.useEffect(() => {
  getChartData();
}, []);

async function getChartData() {
  try {
      const response = await fetchData('/api/admin/chart-data', 'GET');

      if(response.status === 200) {
          const xAxisData = response.data.map((data: ResponseData) => +data.userCount);
          const yAxisData = response.data.map((data: ResponseData) => data.users_department);
          console.log(xAxisData, yAxisData);
          setXAxis(xAxisData);
          setYAxis(yAxisData);
      }

  } catch (error) {
      console.error(error);
  }
}
  return (
    <div id={styles.chartContainer}>
      <h1 id={styles.chartHeading}>Line Chart of the employees based on Departments</h1>
      <div id={styles.chart}>
    <LineChart
      xAxis={[{ data: xAxis }]}
      series={[
        {
          data: xAxis,
        },
      ]}
      width={1000}
      height={600}
    />
    </div>
    </div>
  );
}
