import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchData } from '../utility';
import styles from './css/chart.module.css';

interface ResponseData {
    userCount: string;
    users_department: string;
  }
  
  export default function BarCharTab() {
  const [xAxis, setXAxis] = React.useState([]);
  const [yAxis, setYAxis] = React.useState([]);
  
  React.useEffect(() => {
    getChartData();
  }, []);
  
  async function getChartData() {
    try {
        const response = await fetchData('/api/admin/chart-data', 'GET');
  
        if(response.status === 200) {
            const xAxisData = response.data.map((data: ResponseData) => {
                if(data){
                    return +data.userCount;
                }
            });
            const yAxisData = response.data.map((data: ResponseData) => {
                if(data){
                    return data.users_department;
                }
            });

            setXAxis(xAxisData);
            setYAxis(yAxisData);
        }
  
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div id={styles.chartContainer}>
        <h1 id={styles.chartHeading}>Bar Chart of the employees based on Departments</h1>
    <BarChart
      xAxis={[{ scaleType: 'band', data: yAxis }]}
      series={[{ data: xAxis}]}
      width={1200}
      height={800}
    />
    </div>
  );
}