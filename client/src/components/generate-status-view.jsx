import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTable, useResizeColumns } from "react-table";
import API_BASE_URL from "./config";
import { useNavigate } from "react-router-dom";

function GenerateStatus() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/generate-status-init`)
      .then((response) => {
        setData(response.data.data);
        setColumns(response.data.columns);
      })
      .catch((error) => {
        console.error(error);
		if(error.response && error.response.status === 400)
		{
			toast.warning(error.response.data.message)
		}
      });
  }, []);
  
  const goHome = () => {
	navigate("/home-view");
  };

  // Use useMemo to memoize the table instance to avoid unnecessary re-renders
	const tableInstance = useTable({ data, columns }, useResizeColumns);

	// Destructure the table instance and its properties
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		tableInstance;
  return (
    <>
	<ToastContainer />
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className={"bg-white p-6 rounded-lg shadow-md w-full text-center"}>
          <h1 className='text-3xl font-bold mb-4 text-center'>
            Data Tabularization
          </h1>

          <div className='flex flex-col justify-center'>
            <div className='overflow-x-auto'>
              <table {...getTableProps()} className='table-auto w-full'>
			  <thead className='bg-gray-200 text-gray-600 uppercase text-xs leading-normal'>
									{headerGroups.map((headerGroup) => (
										<tr {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map((column) => (
												<th
													{...column.getHeaderProps()}
													className='py-3 px-6 text-center'
												>
													{column.render("Header")}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody
									{...getTableBodyProps()}
									className='text-gray-600 text-sm font-light'
								>
									{rows.map((row) => {
										prepareRow(row);
										return (
											<tr {...row.getRowProps()}>
												{row.cells.map((cell) => {
													return (
														<td
															{...cell.getCellProps()}
															className='py-3 px-6 text-center whitespace-nowrap'
														>
															{cell.render("Cell")}
														</td>
													);
												})}
											</tr>
										);
									})}
								</tbody>
              </table>
            </div>
          </div>
		  <button
        className="mt-4 text-center mb-4 px-4 py-2 bg-zinc-700 hover:bg-gray-300 hover:text-black text-white font-semibold hover:cursor-pointer rounded-md"
        onClick={goHome}
      >
        Home
      </button>
        </div>
      </div>
    </>
  );
}

export default GenerateStatus;
