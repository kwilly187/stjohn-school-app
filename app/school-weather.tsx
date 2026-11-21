import {loadOcalaWeather,TIME_ZONE} from './school-weather-data.mjs';
import styles from './home.module.css';
export default async function SchoolWeather(){
 const weather=await loadOcalaWeather();
 if(!weather)return null;
 const observed=new Intl.DateTimeFormat('en-US',{timeZone:TIME_ZONE,hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(weather.observedAt));
 return <a className={styles.weather} href="https://forecast.weather.gov/data/obhistory/KOCF.html" title={`National Weather Service · Ocala Airport · observed ${observed}`}>Ocala · {weather.temperature}°F · {weather.condition}<span className={styles.weatherDetail}>, observed {observed}, National Weather Service</span></a>;
}
