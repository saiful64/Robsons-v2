import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import API_BASE_URL from "./config";
import axios from "axios";

const LineChartComponent = () => {
	//const [combinedData, setCombinedData] = useState({ data1: [], data2: [] });
	const [data1, setData1] = useState([]);
	const [data2, setData2] = useState([]);
	useEffect(() => {
		// Fetch data from the combined API endpoint
		const fetchCombinedData = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/api/line-chart`);
				setData1(response.data.data1);
				setData2(response.data.data2);

				console.log(response.data.data1);
				console.log(response.data.data2);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchCombinedData();
	}, []);

	const chartData = {
		labels: data1.map((item) => item.month_name),
		datasets: [
			{
				label: "Caesarean Del",
				data: data1.map((item) => item.csCount),
				borderColor: "#8884d8",
				fill: false,
			},
			{
				label: "Deliveries",
				data: data2.map((item) => item.totalCount),
				borderColor: "#82ca9d",
				fill: false,
			},
		],
	};

	const chartOptions = {
		scales: {
			x: {
				display: true,
				title: {
					display: true,
					text: "Months ----->",
				},
			},
			y: {
				display: true,
				title: {
					display: true,
					text: "Deliveries ----->",
				},
			},
		},
		plugins: {
			legend: {
				display: true,
				position: "top",
			},
		},
	};

	return (
		<div className='container mx-auto p-4'>
			<h2 className='text-xl font-bold mb-4'>
				Total Deliveries and Caesarean Deliveries
			</h2>
			<div className='bg-white rounded-lg shadow-lg p-4'>
				<Line data={chartData} options={chartOptions} />
			</div>
		</div>
	);
};

export default LineChartComponent;
