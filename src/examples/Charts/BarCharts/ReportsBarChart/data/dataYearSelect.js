// YearSelect.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const YearSelect = ({ selectedYear, handleYearChange }) => {
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/v1/enrollment/years");
        console.log("Data năm", response.data);
        setYears(response.data);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <Select
        value={selectedYear}
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

YearSelect.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  handleYearChange: PropTypes.func.isRequired,
};

export default YearSelect;
