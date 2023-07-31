import React, { useState, useEffect,useRef } from 'react';
import { Line ,Bar} from 'react-chartjs-2';
import API_BASE_URL from './config';
import axios from 'axios';



const MultiGraphComponent = () => {

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
    useEffect(() => {
        // Fetch data from the combined API endpoint
        const fetchCombinedData = async () => {
            
          try {
            const response = await axios.get(`${API_BASE_URL}/api/dashboard`);
             setData1(response.data.data1);
             setData2(response.data.data2);
             setData3(response.data.data3);
             setData4(response.data.data4);
             setData5(response.data.data5);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchCombinedData();
      }, []);

 
   // Total Delivery and Cesarean Delivery 
  const chartData = {
    labels: data1.map((item) => item.month_name),
    datasets: [
      {
        label: 'Caesarean Del',
        data: data1.map((item) => item.csCount),
        borderColor: '#8884d8',
        fill: false,
      },
      {
        label: 'Total Deliveries',
        data: data2.map((item) => item.totalCount),
        borderColor: '#82ca9d',
        fill: false,
      },
    ],
  };

  const chartOptions1 = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Months ----->',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Deliveries ----->',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  // Three month and more than three month Delivery with groups
   const barChart = {
        labels: data3.map((item) => item.group_name),
        datasets: [
          {
            label: 'Jan-Mar',
            data: data3.map((item) => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Apr-Aug',
            data: data4.map((item) => item.count),
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Sep-Dec',
            data: data5.map((item) => item.count),
            backgroundColor: 'rgba(0,255,0, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    
      const chartOptions2 = {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Groups ----->',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Deliveries ----->',
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      };

  const lineChartData3 = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [
      {
        label: 'Line Chart Data 3',
        data: [30, 25, 20, 15],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const lineChartData4 = {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [
      {
        label: 'Line Chart Data 4',
        data: [40, 20, 30, 10],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First row */}
        <div className="w-full  md:w-auto">
        <h2 className="text-sm font-bold mb-4">Total Deliveries and Caesarean Deliveries</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
          <Line data={chartData} options={chartOptions1} />
          </div>
        </div>
        <div className="w-full md:w-auto">
        <h2 className="text-sm font-bold mb-4">Contribution To Overall Cesarean rate</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
          <Bar data={barChart} options={chartOptions2} />
          </div>
        </div>

        {/* Second row */}
        <div className="w-full md:w-auto">
        <h2 className="text-sm font-bold mb-4">To be updated</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Line data={lineChartData3} />
          </div>
        </div>
        <div className="w-full md:w-auto">
        <h2 className="text-sm font-bold mb-4">To be updated</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Line data={lineChartData4} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiGraphComponent;
