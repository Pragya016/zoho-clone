import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { fetchData } from "../utility";
import styles from "./css/chart.module.css";
import Navbar from "./Navbar";
import { toast, ToastContainer } from "react-toastify";

export interface ChartData {
  value: number;
  label: string;
}

export interface ResponseData {
  userCount: string;
  users_department?: string;
  users_designation?: string;
  users_date_of_joining: string;
}

export interface ChartProps {
  chartType: string;
}

export default function PieChartTab({ chartType }: ChartProps) {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    getChartData();
  }, []);

  async function getChartData() {
    try {
      const token = localStorage.getItem("idToken");

      if (!token) {
        toast.error("Something went wrong");
        return;
      }

      const response = await fetchData(
        `/api/admin/chart-data?type=${chartType}`,
        "GET",
        null,
        token
      );
      if (response.status === 200) {
        const updatedChartData = response.data
          .map((data: ResponseData, index: number) => {
            let label: string = "";

            if (chartType === "department" && data.users_department) {
              label = data.users_department;
            }

            if (chartType === "designation" && data.users_designation) {
              label = data.users_designation;
            }

            if (chartType === "date_of_joining" && data.users_date_of_joining) {
              label = data.users_date_of_joining;
            }

            return label
              ? {
                  id: index,
                  value: +data.userCount,
                  label: label,
                }
              : null;
          })
          .filter((item: ResponseData) => item !== null);

        setChartData(updatedChartData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div id={styles.chartContainer}>
        <Navbar heading={`Pie Chart of the employees based on ${chartType}`} />
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          width={1000}
          height={600}
        />
      </div>
      {/* <ToastContainer closeOnClick={true} /> */}
    </>
  );
}
