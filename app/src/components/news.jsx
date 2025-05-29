import { useState } from 'react';
import './news.css';

const WIKIPEDIA_ONTHISDAY_BASE_URL = 'https://en.wikipedia.org/api/rest_v1/feed/onthisday';

const OnThisDay = () => {
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !day) {
      setError('Please select both month and day.');
      return;
    }

    setError('');

    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    try {
      // First API call: Fetch initial "events" for the selected date.
      const eventsApiUrl = `${WIKIPEDIA_ONTHISDAY_BASE_URL}/events/${formattedMonth}/${formattedDay}`;
      const eventsResponse = await fetch(eventsApiUrl);
      const eventsData = await eventsResponse.json();

      let collectedEntries = eventsData.events?.slice(0, 4) || [];

      // Condition for second API call: If the number of events fetched is less than 4,
      // make another call to fetch births and deaths to fill the remaining slots.
      if (collectedEntries.length < 4) {
        const allTypesApiUrl = `${WIKIPEDIA_ONTHISDAY_BASE_URL}/all/${formattedMonth}/${formattedDay}`; // Corrected endpoint to fetch all types
        const allTypesResponse = await fetch(allTypesApiUrl);
        const allTypesData = await allTypesResponse.json();

        let remainingSlots = 4 - collectedEntries.length;
        
        // Extract births and deaths, ensuring not to exceed remaining slots for each type individually yet.
        const birthsEntries = (allTypesData.births || []).slice(0, remainingSlots);
        // Calculate slots remaining after adding births for deaths.
        const slotsAfterBirths = remainingSlots - birthsEntries.length;
        const deathsEntries = (allTypesData.deaths || []).slice(0, slotsAfterBirths);

        // How data is merged and limited:
        // Combine the initially fetched events with the newly fetched births and deaths.
        // Then, ensure the total number of entries does not exceed 4.
        const additionalEntries = [...birthsEntries, ...deathsEntries];
        collectedEntries = [...collectedEntries, ...additionalEntries].slice(0, 4);
      }

      setEntries(collectedEntries);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch events. Please try again later.');
    }
  };

  return (
    <div className='news-container'>
      <h1 className='news-title'>On This Day</h1>

      <form className='news-form' onSubmit={handleSubmit}>
        <label htmlFor='month'>Month:</label>
        <input
          type='number'
          id='month'
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min='1'
          max='12'
          placeholder='Enter month (1-12)'
        />

        <label htmlFor='day'>Day:</label>
        <input
          type='number'
          id='day'
          value={day}
          onChange={(e) => setDay(e.target.value)}
          min='1'
          max='31'
          placeholder='Enter day (1-31)'
        />

        <button type='submit'>Get Events</button>
      </form>

      {error && <p className='error'>{error}</p>}

      <div className='entries-container'>
        {entries.length > 0 ? (
          <ul>
            {entries.map((entry, index) => (
              <li key={index} className='news-entry'>
                <a
                  href={entry.pages?.[0]?.content_urls?.desktop?.page}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='news-link'
                >
                  {entry.text} ({entry.year})
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className='no-events'>No historical events found for this date.</p>
        )}
      </div>
    </div>
  );
};

export default OnThisDay;
