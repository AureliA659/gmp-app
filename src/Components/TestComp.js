import React from "react";
import { useState, useEffect } from "react";

function TestComp() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const sortedCountries = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sortedCountries);
    };
    fetchCountries();
  }, []);

  return (
    <select>
      {countries.map((country, index) => (
        <option key={index} value={country.name.common}>
          {country.name.common}
        </option>
      ))}
    </select>
  );
}

export default TestComp