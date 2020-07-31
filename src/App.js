import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl,Select } from '@material-ui/core'


function App() {

  const [countries, setCountries] = useState([])
  const [country, setcountry] = useState('worldwide')
  useEffect(() => {
    
    const getCountries = async () => {
      let countries = await fetch('https://disease.sh/v3/covid-19/countries');
      let countriesData = await countries.json();
      const country = countriesData.map((country) => {
         return {
          name: country.country,
          value: country.countryInfo.iso2
        }
      })
      setCountries(country)
    }
    getCountries()
  }, [])
  const onCountryChange = (e) => {
    setcountry(e.target.value)
  } 
  return (
    <div className="app">
      <div className="app_header">  
        <h1>Covid 19 Tracker</h1>
        <FormControl className="app_dropdown">
          <Select
            onChange={onCountryChange}
            variant="outlined"
            value={country}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            { countries.map((country,i) => {
              return <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
            }) }
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
