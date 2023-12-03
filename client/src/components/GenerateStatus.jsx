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

  const department = auth.department

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/generate-status-init?department=${department}`)
      .then((response) => {
        setData(response.data.data)
        setColumns(response.data.columns)
      })
      .catch((error) => {
        console.error(error)
        if (error.response && error.response.status === 400) {
          toast.warning(error.response.data.message)
        }
      })
  }, [])

  const goHome = () => {
    navigate("/home-view")
  }

  const yearly = () => {}

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
          <select id="monthSelect" name="month">
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

          <button className="rounded bg-gray-200 p-2 m-2" onClick={yearly}>
            Yearly
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
