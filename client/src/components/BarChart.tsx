import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchData } from '../utility';
import styles from './css/chart.module.css';
import { ChartProps, ResponseData } from './PieChart';
import Navbar from './Navbar';
  
  export default function BarCharTab({chartType}: ChartProps) {
  const [xAxis, setXAxis] = React.useState([]);
  const [yAxis, setYAxis] = React.useState([]);
  
  React.useEffect(() => {
    getChartData();
  }, []);
  
  async function getChartData() {
    try {
        const response = await fetchData(`/api/admin/chart-data?type=${chartType}`, 'GET');
        if(response.status === 200) {
            const xAxisData = response.data.map((data: ResponseData) => +data.userCount);
            const yAxisData = response.data.map((data: ResponseData) => {
              if(chartType === 'designation') {
                return data.users_designation
              }
              if(chartType === 'department') {
                return data.users_department
              }
              if(chartType === 'date_of_joining') {
                return data.users_date_of_joining
              }

              return null;
            }).filter((data: string) => data !== null);

            setXAxis(xAxisData);
            setYAxis(yAxisData);
        } 
    } catch (error) {
        console.error(error);
    }
  }


  return (
    <div id={styles.chartContainer}>
    <Navbar heading={`Pie Chart of the employees based on ${chartType}`}/>
    <BarChart
      xAxis={[{ scaleType: 'band', data: yAxis }]}
      series={[{ data: xAxis}]}
      width={1350}
      height={800}
    />
    </div>
  );
}