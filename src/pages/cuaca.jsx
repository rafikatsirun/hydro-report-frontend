import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import '../style/style-cuaca.css';

const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const apiKey = '5f8f9fdae8dd8cc6cbadcaf0c6937b21'; // Ganti jika invalid
  const lat = -7.9907;
  const lon = 110.6169;

  useEffect(() => {
    const getWeather = async () => {
      try {
        // Fetch cuaca saat ini
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        );
        if (!currentRes.ok) throw new Error('Gagal memuat cuaca saat ini');
        const currentData = await currentRes.json();

        setWeather({
          temp: Math.round(currentData.main.temp),
          desc: currentData.weather[0].description,
          icon: currentData.weather[0].icon,
          humidity: currentData.main.humidity,
          wind: currentData.wind.speed,
          sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('id-ID'),
          sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('id-ID'),
        });

        // Fetch prakiraan cuaca
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        );
        if (!forecastRes.ok) throw new Error('Gagal memuat prakiraan cuaca');
        const forecastData = await forecastRes.json();

        const dailyForecast = forecastData.list.filter(item =>
          item.dt_txt.includes("12:00:00")
        );

        setForecast(dailyForecast);
      } catch (err) {
        console.error(err);
        setError('Tidak dapat memuat data cuaca.');
      }
    };

    getWeather();
  }, [lat, lon]); // ✅ Tambahkan ke dependency array

  return (
    <>
      <Navbar />
      <div className="weatherWrapper">
        <div className="weatherCard">
          <h2>Cuaca Saat Ini</h2>
          {error ? (
            <div className="description">{error}</div>
          ) : weather ? (
            <>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="icon cuaca"
              />
              <div className="temp">{weather.temp}°C</div>
              <div className="description">{weather.desc}</div>
              <div className="details">
                Kelembaban: {weather.humidity}% | Angin: {weather.wind} m/s
              </div>
              <div className="details">
                Matahari Terbit: {weather.sunrise} | Terbenam: {weather.sunset}
              </div>
            </>
          ) : (
            <div className="description">Memuat...</div>
          )}
        </div>

        {forecast.length > 0 && (
          <div className="forecastWrapper">
            <h3>Prakiraan 5 Hari Mendatang</h3>
            <div className="forecastGrid">
              {forecast.map((day, index) => (
                <div key={index} className="forecastCard">
                  <div>
                    {new Date(day.dt_txt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                  <div>{Math.round(day.main.temp)}°C</div>
                  <div className="description">{day.weather[0].description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherPage;
