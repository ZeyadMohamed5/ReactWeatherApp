import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "../style.css";
import { IoWaterOutline } from "react-icons/io5";
import { TbWind } from "react-icons/tb";
import SideBar from "./SideBar";

const Weather = () => {
  const [countryInput, setCountryInput] = useState("Egypt");
  const [countrydata, setCountryData] = useState([]);
  const [countryWeather, setCountryWeather] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [daysForecast, setDaysForecast] = useState([]);
  const originalWeather = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("C");

  const fetchWeatherData = (country) => {
    setError(null);
    setLoading(true);
    axios
      .get(
        `https://api.weatherapi.com/v1/forecast.json?key=e8b81227058143b1b5d175518242312&q=${country}&days=7&aqi=no&alerts=no`
      )
      .then((response) => {
        const data = response.data;
        setCountryData(data.location);
        setCountryWeather(data.current);
        originalWeather.current = data.current;
        setDaysForecast(data.forecast.forecastday);
        setForecast(data.forecast.forecastday[0].hour);
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to fetch weather data. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeatherData("Egypt");
  }, []);

  const convertTemp = (tempInCelsius) => {
    if (unit === "C") {
      return tempInCelsius;
    }
    return (tempInCelsius * 9) / 5 + 32;
  };

  const weatherSearch = () => {
    if (countryInput.trim() === "") return;
    fetchWeatherData(countryInput);
  };

  const handleDayClick = (day) => {
    const today = new Date().toISOString().slice(0, 10);
    if (day.date === today) {
      setForecast(day.hour);
      setCountryWeather(originalWeather.current);
    } else {
      setForecast(day.hour);
      setCountryWeather((prev) => ({
        ...prev,
        temp_c: day.day.avgtemp_c,
        humidity: day.day.avghumidity,
        wind_kph: day.day.maxwind_kph,
        feelslike_c: day.day.avgtemp_c,
        condition: day.day.condition,
      }));
    }
  };

  const forecastAvg = forecast.filter((_, index) => (index + 1) % 4 === 0);

  return (
    <>
      <div className="container">
        <div className="searchContainer">
          <input
            onChange={(e) => setCountryInput(e.target.value)}
            type="text"
            className="searchInput"
            placeholder="Enter your country / city name ..."
            value={countryInput}
          />
          <button className="searchBtn" onClick={weatherSearch} type="button">
            Search
          </button>
        </div>

        {error && <div className="errorMessage">{error}</div>}

        <div className="wrapper">
          <div className="weatherInfoContainer">
            {loading ? (
              <div className="loadingSpinner">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                <div className="weatherAppHeader">
                  <div className="countryInfo">
                    <h2>{countrydata.country}</h2>
                    <p>
                      <strong>{countrydata.name}</strong>
                    </p>
                  </div>
                  <div className="converBtnContainer">
                    <button
                      className={
                        unit === "C" ? "convertBtn active" : "convertBtn"
                      }
                      value={"C"}
                      onClick={(e) => setUnit(e.target.value)}
                    >
                      °C
                    </button>
                    <span>|</span>
                    <button
                      className={
                        unit === "F" ? "convertBtn active" : "convertBtn"
                      }
                      value={"F"}
                      onClick={(e) => setUnit(e.target.value)}
                    >
                      °F
                    </button>
                  </div>
                </div>

                <div className="weatherInfo">
                  {countryWeather?.temp_c && (
                    <>
                      <p>{Math.floor(convertTemp(countryWeather?.temp_c))}</p>
                      <span className="d-block">
                        Feels like{" "}
                        {Math.floor(convertTemp(countryWeather.feelslike_c))}°
                      </span>
                      <span>{countryWeather?.condition?.text}</span>
                      <div className="additionalWeatherInfo">
                        <ul>
                          <li>
                            <IoWaterOutline size={25} />
                            <span>{countryWeather.humidity}%</span>
                          </li>
                          <li>
                            <TbWind size={25} />
                            <span>
                              {Math.floor(countryWeather.wind_kph)} Kph
                            </span>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  {forecast && (
                    <>
                      <p>Current forecast</p>
                      <ul className="forecastContainer">
                        {forecastAvg.map((hour, index) => (
                          <li className="forecastCard" key={index}>
                            <span className="forecastTime">
                              {hour?.time.slice(11)}
                            </span>
                            <img src={hour?.condition?.icon} alt="" />
                            <span className="forecastTemp">
                              {Math.floor(convertTemp(hour?.temp_c))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          {loading ? (
            ""
          ) : (
            <SideBar
              daysForecast={daysForecast}
              onDayClick={handleDayClick}
              temp={convertTemp}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Weather;
