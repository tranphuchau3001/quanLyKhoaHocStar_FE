// SelectYearRegistration.js
import React, { useState, useEffect } from "react";
import apiClient from "api/apiClient";
import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const SelectYearRegistration = ({ selectedYear, handleYearChange }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await apiClient.get("/api/v1/statistical/getAvailableUserYears");
        if (response.data.success) {
          setYears(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch years");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching years:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  const validYear = selectedYear || years[0] || new Date().getFullYear();

  if (loading) {
    return <div>Loading years...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <Select
        value={validYear}
        onChange={handleYearChange}
        displayEmpty
        sx={{
          borderRadius: "6px",
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d9e6",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5e72e4",
          },
          height: "30px",
          width: "200px",
        }}
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SelectYearRegistration.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  handleYearChange: PropTypes.func.isRequired,
};

export default SelectYearRegistration;
