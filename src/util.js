import { Circle, Popup } from 'react-leaflet'
import numeral from 'numeral'

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 100,
    },
    recovered: {
        hex: "#7DD71D",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 200,
    },
    deaths: {
        hex: "#FB4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 1600,
    },
};

export const sortData = (data) => {

    const sortedData = [...data];
    return sortedData.sort((a,b) => a.cases > b.cases ? -1 : 1);
}

export const showDataOnMap = (data, casesType) => (
    data.map((country) => (
        <Circle center={[country.countryInfo.lat, country.countryInfo.long]} 
                fillOpacity={0.4} 
                color={casesTypeColors[casesType].hex} 
                fillColor={casesTypeColors[casesType].hex} 
                radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        > 

        <Popup>
            <div className='info__container'>
                <div className='info__flag' style={{backgroundImage: `url(${country.countryInfo.flag})`}} >
                    {/* <img src={country.countryInfo.flag} alt="" srcset="" /> */}
                </div>
                <div className='info__name'>{country.country}</div>
                <div className='info__confirmed'>Cases: {numeral(country.cases).format("0,0")}</div>
                <div className='info__recovered'>Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className='info__deaths'>Deaths: {numeral(country.deaths).format("0,0")}</div>
            </div>
        </Popup>
        
        </Circle>
    ))
);

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0"
