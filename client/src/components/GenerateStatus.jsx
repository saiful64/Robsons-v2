import React, { useState, useEffect } from "react"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTable, useResizeColumns } from "react-table"
import API_BASE_URL from "../config"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/auth"

function GenerateStatus() {
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const auth = useAuth()
  const [startMonth, setStartMonth] = useState("")
  const [endMonth, setEndMonth] = useState("")

  const department = auth.department

  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/api/generate-status-init`, {
        params: {
          department: department,
          startMonth: `${startMonth}`,
          endMonth: `${endMonth}`,
        },
      })
      .then((response) => {
        setData(response.data.data)
        setColumns(response.data.columns)
      })
      .catch((error) => {
        setData([])
        setColumns([])
        console.error(error)
        if (error.response && error.response.status === 400) {
          toast.warning(error.response.data.message)
        }
      })
  }

  const handleStartMonthChange = (event) => {
    const newStartMonth = event.target.value
    // If endMonth is smaller than newStartMonth, reset endMonth to newStartMonth
    if (endMonth < newStartMonth) {
      setEndMonth(newStartMonth)
    }
    setStartMonth(newStartMonth)
  }

  const handleEndMonthChange = (event) => {
    const newEndMonth = event.target.value
    if (startMonth > newEndMonth) {
      setStartMonth(newEndMonth)
    }
    setEndMonth(newEndMonth)
  }

  const goHome = () => {
    navigate("/home-view")
  }

  const tableInstance = useTable({ data, columns }, useResizeColumns)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Data Tabularization
          </h1>
          <div className="flex space-x-4 justify-center">
            <div className="flex space-x-4 items-center mb-4">
              <label htmlFor="startMonth" className="text-sm font-semibold">
                Starting Month:
              </label>
              <select
                id="startMonth"
                name="month"
                value={startMonth}
                onChange={handleStartMonthChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              >
                <option disabled value="">
                  Select Starting Month
                </option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="flex space-x-4 items-center mb-4">
              <label htmlFor="endMonth" className="text-sm font-semibold">
                Ending Month:
              </label>
              <select
                id="endMonth"
                name="month"
                value={endMonth}
                onChange={handleEndMonthChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              >
                <option disabled value="">
                  Select Ending Month
                </option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Search
          </button>

          <div className="flex flex-col justify-center">
            <div className="overflow-x-auto">
              <table {...getTableProps()} className="table-auto w-full">
                <thead className="bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          className="py-3 px-6 text-center"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="text-gray-600 text-sm font-light"
                >
                  {rows.map((row) => {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="py-3 px-6 text-center whitespace-nowrap"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    )
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
  )
}

export default GenerateStatus
