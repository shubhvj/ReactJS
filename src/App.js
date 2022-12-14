import React from 'react'
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import { useEffect, useState } from 'react';
import './App.css';
import Map from './Map';
import InfoBox from './InfoBox';
import Table from './Table';
import { sortData, prettyPrintStat } from './util'
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [countryInfo, setCountryInfo] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {
      setCountryInfo(data);
    })
  }, []) 

  useEffect(() => {
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => {
          return {
            name: country.country,
            value: country.countryInfo.iso2 
          }
        });
        
        setMapCountries(data);
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
  }, [])
  
  const onCountryChange = async (event) => {
    
    const countryCode = event.target.value;
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    await fetch(url).then(response => response.json()).then(data => {
      setCountryInfo(data);
      setCountry(countryCode);
      countryCode === "worldwide" ? setMapCenter([34.80746, -40.4796]) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      countryCode === "worldwide" ? setMapZoom(3) : setMapZoom(4);
      
    });
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} name="selectedCountry" onChange={onCountryChange}>
              {/* Loop through country list amd show dropdown */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => {
                  return <MenuItem value={country.value}>{country.name}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox isRed active={casesType === 'cases'} onClick={(e) => setCasesType("cases") } title="Coronovirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total = {prettyPrintStat(countryInfo.cases)} />
          <InfoBox active={casesType === 'recovered'} onClick={(e) => setCasesType("recovered") } title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total = {prettyPrintStat(countryInfo.recovered)} />
          <InfoBox isRed active={casesType === 'deaths'} onClick={(e) => setCasesType("deaths") } title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total = {prettyPrintStat(countryInfo.deaths)} />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
