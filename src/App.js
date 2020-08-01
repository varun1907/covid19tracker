import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl,Select, Card, CardContent } from '@material-ui/core'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData } from './util'
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([])
  const [country, setcountry] = useState('worldwide')
  const [countryInfo, setcountryInfo] = useState({})
  const [tableData, settableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  useEffect(() =>  {
    async function fetchwwData()
    {
      let response = await fetch('https://disease.sh/v3/covid-19/all')
      let wwData = await response.json()
      setcountryInfo(wwData)
    }
    fetchwwData()
  }, [])

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
      const sortedData = sortData(countriesData)
      settableData(sortedData)
      setCountries(country)
    }
    getCountries()
  }, [])
  const onCountryChange = async (e) => {
    const cCode = e.target.value
    setcountry(e.target.value)
    const url = cCode == 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${cCode}`
    let response = await fetch(url)
    let data = await response.json()
    setcountryInfo(data)
  } 

  return (
    <div className="app">
      <div className="app_left">
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

        <div className="app_stats">
          <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div> 

        <Map 
          casesType={casesType}
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom} 
        />
      </div>

      <div className="app_right">
        <Card>
          <CardContent>
            <h3>Live Cases</h3>
            <Table countries={tableData}/>
            <h3>worldwide New cases</h3>
            <LineGraph />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
