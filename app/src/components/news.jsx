import { useState } from "react";
import "./news.css";

const OnThisDay = () => {
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !day) {
      setError("Please select both month and day.");
      return;
    }

    setError("");

    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${formattedMonth}/${formattedDay}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      let collectedEntries = data.events?.slice(0, 4) || [];
      if (collectedEntries.length < 4) {
        const additionalResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/${formattedMonth}/${formattedDay}`
        );
        const additionalData = await additionalResponse.json();

        let remainingSlots = 4 - collectedEntries.length;
        const extraEntries = [
          ...(additionalData.births || []).slice(0, remainingSlots),
          ...(additionalData.deaths || []).slice(
            0,
            remainingSlots - (additionalData.births?.length || 0)
          ),
        ];

        collectedEntries = [...collectedEntries, ...extraEntries].slice(0, 4);
      }

      setEntries(collectedEntries);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch events. Please try again later.");
    }
  };

  return (
    <div className="news-container">
      <h1 className="news-title">On This Day</h1>

      <form className="news-form" onSubmit={handleSubmit}>
        <label htmlFor="month">Month:</label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
          placeholder="Enter month (1-12)"
        />

        <label htmlFor="day">Day:</label>
        <input
          type="number"
          id="day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          min="1"
          max="31"
          placeholder="Enter day (1-31)"
        />

        <button type="submit">Get Events</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="entries-container">
        {entries.length > 0 ? (
          <ul>
            {entries.map((entry, index) => (
              <li key={index} className="news-entry">
                <a
                  href={entry.pages?.[0]?.content_urls?.desktop?.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  {entry.text} ({entry.year})
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">No historical events found for this date.</p>
        )}
      </div>
    </div>
  );
};

export default OnThisDay;
