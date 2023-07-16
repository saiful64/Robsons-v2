import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import API_BASE_URL from './config';

Chart.register(...registerables);

const MyChartComponent = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dateRange = [{ startDate: new Date(), endDate: new Date() }]; // Replace with your date range

        const response = await axios.get(`${API_BASE_URL}/api/barchart`, {
          params: {
            startDate: moment(dateRange[0].startDate).format("YYYY-MM-DD"),
            endDate: moment(dateRange[0].endDate).format("YYYY-MM-DD"),
          }
        });

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      destroyChartInstance();
      createChartInstance();
    }
  }, [data]);

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
        labels: data.map(item => item.group_name),
        datasets: [
          {
            label: 'Data',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <canvas id="myChart" ref={chartRef} />
  );
};

export default MyChartComponent;
