import { useState } from "react";

const OnThisDay = () => {
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");

  // Handle the API request based on user input
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !day) {
      setError("Please select both month and day.");
      return;
    }

    setError("");

    // Format month and day to be 0-padded
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    const apiUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${formattedMonth}/${formattedDay}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      let collectedEntries = [];

      // 1️⃣ Start with events (all years)
      if (data.events) {
        collectedEntries = data.events.slice(0, 4); // Take max 4 events
      }

      // If we have fewer than 4 entries, fetch additional data
      if (collectedEntries.length < 4) {
        const additionalResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/${formattedMonth}/${formattedDay}`
        );
        const additionalData = await additionalResponse.json();

        let remainingSlots = 4 - collectedEntries.length;

        // 2️⃣ Fill gaps with births, then deaths
        const extraEntries = [
          ...(additionalData.births || []).slice(0, remainingSlots),
          ...(additionalData.deaths || []).slice(
            0,
            remainingSlots - (additionalData.births?.length || 0)
          ),
        ];

        collectedEntries = [...collectedEntries, ...extraEntries].slice(0, 4); // Ensure only 4 total
      }

      setEntries(collectedEntries);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch events. Please try again later.");
    }
  };

  return (
    <>
      <h1>On This Day</h1>

      <form onSubmit={handleSubmit}>
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
              <li key={index}>
                <a
                  href={entry.pages?.[0]?.content_urls?.desktop?.page}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entry.text} ({entry.year})
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No historical events found for this date.</p>
        )}
      </div>
    </>
  );
};

export default OnThisDay;
