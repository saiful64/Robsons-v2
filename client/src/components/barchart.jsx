import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import API_BASE_URL from './config';

Chart.register(...registerables);

const MyChartComponent = () => {
  const chartRef = useRef(null);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
 
//  const data1 = [
//   { group_name: 'group 1', count: 0 },
//   { group_name: 'group 2', count: 0 },
//   { group_name: 'group 3', count: 1 },
//   { group_name: 'group 4', count: 0 },
//   { group_name: 'group 5', count: 0 },
//   { group_name: 'group 6', count: 0 },
//   { group_name: 'group 7', count: 0 },
//   { group_name: 'group 8', count: 0 },
//   { group_name: 'group 9', count: 0 },
//   { group_name: 'group 10', count: 0 },
// ];

// const data2 = [
//   { group_name: 'group 1', count: 0 },
//   { group_name: 'group 2', count: 0 },
//   { group_name: 'group 3', count: 0 },
//   { group_name: 'group 4', count: 0 },
//   { group_name: 'group 5', count: 1 },
//   { group_name: 'group 6', count: 0 },
//   { group_name: 'group 7', count: 0 },
//   { group_name: 'group 8', count: 0 },
//   { group_name: 'group 9', count: 0 },
//   { group_name: 'group 10', count: 7 },
// ];

// const data3 = [
//   { group_name: 'group 1', count: 0 },
//   { group_name: 'group 2', count: 0 },
//   { group_name: 'group 3', count: 0 },
//   { group_name: 'group 4', count: 0 },
//   { group_name: 'group 5', count: 0 },
//   { group_name: 'group 6', count: 0 },
//   { group_name: 'group 7', count: 0 },
//   { group_name: 'group 8', count: 0 },
//   { group_name: 'group 9', count: 0 },
//   { group_name: 'group 10', count: 0 },
// ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/barchart`);
        setData1(response.data.data1);
        setData2(response.data.data2);
        setData3(response.data.data3);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data1.length > 0) {
      destroyChartInstance();
      createChartInstance();
    }
  }, [data1]);

  const destroyChartInstance = () => {
    if (chartRef.current) {
      const chartInstance = Chart.getChart(chartRef.current);
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
  };

  const createChartInstance = () => {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data1.map((item) => item.group_name),
        datasets: [
          {
            label: 'Jan-Mar',
            data: data1.map((item) => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Apr-Aug',
            data: data2.map((item) => item.count),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Sep-Dec',
            data: data3.map((item) => item.count),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="container mx-auto my-4 p-4 bg-white rounded-lg shadow-lg">
    <canvas id="myChart" ref={chartRef} />
    </div>
  );
};

export default MyChartComponent;
