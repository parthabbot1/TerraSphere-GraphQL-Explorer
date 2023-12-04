import React, { useState } from "react";
import { LIST_COUNTRIES } from "../query";
import "./Table.css";
import "./Table2.css";
import { Pagination } from "@heathmont/moon-core-tw";
import { useQuery } from "@apollo/client";
interface Country {
  code: string;
  name: string;
}

interface CountriesData {
  countries: Country[];
}

const makeData = (countries: Country[]) => {
  return countries.map((country) => ({
    code: country.code,
    name: country.name,
  }));
};

export const TableView = () => {
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toggle, setToggle] = useState(true);
  const itemsPerPage = 10;

  const { loading, error, data } = useQuery<CountriesData>(LIST_COUNTRIES, {
    variables: {
      page: currentPage,
      perPage: itemsPerPage,
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredCountries = data
    ? data.countries.filter((country) =>
        country.code.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedCountries = filteredCountries.slice(startIndex, endIndex);
  const tableData = makeData(slicedCountries);

  console.log("Data:", data);

  return (
    <div className="container">
      <div className="centered">
        <label htmlFor="countryCode" className="label">
          Filter by Country Code:
        </label>
        <input
          type="text"
          id="countryCode"
          placeholder="Country Code"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input"
          data-testid="input-view"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {data && (
        <>
          <table
            data-testid="table-view"
            className={toggle ? "custom-table" : "react-table"}
          >
            <thead>
              <tr>
                <th>Country Code</th>
                <th>Country Name</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination" data-testid="pagiantion-view">
            <Pagination
              totalPages={Math.ceil(filteredCountries.length / itemsPerPage)}
              currentPage={currentPage}
              setCurrentPage={handlePageChange}
            >
              <Pagination.PrevButton>Previous</Pagination.PrevButton>
              <Pagination.Pages />
              <Pagination.NextButton>Next</Pagination.NextButton>
            </Pagination>
          </div>
          <div></div>
        </>
      )}
      <button
        data-testid="button-view"
        className="toggle-button"
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? "Normal" : "Interactive"}
      </button>
    </div>
  );
};
