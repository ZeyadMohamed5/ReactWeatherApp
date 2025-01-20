import React from "react";
import "./sidebarStyle.css";
const SideBar = ({ daysForecast, onDayClick, temp }) => {
  function getDayName(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long" };
    return date.toLocaleDateString("en-US", options);
  }
  return (
    <aside>
      <ul className="forecastDaysMenu">
        {daysForecast.map((day, index) => (
          <li key={index} onClick={() => onDayClick(day)}>
            <div className="col">
              <img src={day.day.condition.icon} alt="" />
              <span>{Math.floor(temp(day.day.avgtemp_c))}°</span>
            </div>
            <div className="col">
              <span className="dayName">{getDayName(day.date)}</span>
              <span>{day.day.condition.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
