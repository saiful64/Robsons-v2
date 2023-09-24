import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import API_BASE_URL from "./config";

Chart.register(...registerables);

const MyChartComponent = () => {
	const chartRef = useRef(null);
	const [chartInstance, setChartInstance] = useState(null);
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/api/barchart`);
				const { data1, data2, data3 } = response.data;

				setChartData({
					labels: data1.map((item) => item.group_name),
					datasets: [
						{
							label: "Jan-Mar",
							data: data1.map((item) => item.count),
							backgroundColor: "rgba(75, 192, 192, 0.6)",
							borderColor: "rgba(75, 192, 192, 1)",
							borderWidth: 1,
						},
						{
							label: "Apr-Aug",
							data: data2.map((item) => item.count),
							backgroundColor: "rgba(255, 0, 0, 0.6)",
							borderColor: "rgba(255, 99, 132, 1)",
							borderWidth: 1,
						},
						{
							label: "Sep-Dec",
							data: data3.map((item) => item.count),
							backgroundColor: "rgba(0,255,0, 0.6)",
							borderColor: "rgba(54, 162, 235, 1)",
							borderWidth: 1,
						},
					],
				});
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (chartRef.current) {
			if (chartInstance) {
				chartInstance.destroy();
			}

			const ctx = chartRef.current.getContext("2d");
			const newChartInstance = new Chart(ctx, {
				type: "bar",
				data: chartData,
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});

			setChartInstance(newChartInstance);
		}
	}, [chartData]);

	return (
		<div className='container mx-auto my-4 p-4 bg-white rounded-lg shadow-lg'>
			<canvas id='myChart' ref={chartRef} />
		</div>
	);
};

export default MyChartComponent;
