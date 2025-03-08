import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchData } from '../utility';
import styles from './css/chart.module.css';

export default function LineChartTab() {
const [xAxis, setXAxis] = React.useState([]);
const [yAxis, setYAxis] = React.useState([]);

React.useEffect(() => {
  getChartData();
}, []);

  async function getChartData() {
  try {
      const response = await fetchData(`/api/admin/chart-data?type=${chartType}`, 'GET');
      if(response.status === 200) {
          const updatedChartData = response.data.map((data: ResponseData, index: number) => {
              let label: string = '';

              if (chartType === 'department' && data.users_department) {
                  label = data.users_department;
              }

              if (chartType === 'designation' && data.users_designation) {
                  label = data.users_designation;
              }

              if (chartType === 'date_of_joining' && data.users_date_of_joining) {
                  label = data.users_date_of_joining;
              }

              return label ? {
                  id: index,
                  value: +data.userCount,
                  label: label
              } : null;
          }).filter((item: ResponseData) => item !== null);

          setChartData(updatedChartData);
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
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      width={1000}
      height={600}
    />
    </div>
    </div>
  );
}
