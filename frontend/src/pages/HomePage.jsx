import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import EventCard from "../components/EventCard";

const eventCategories = ["all", "show", "workshop", "culture", "esports"];

const HomePage = ({ events, onSelectEvent, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = useMemo(() => {
    return events
      .filter(
        (event) => event && typeof event.id === "number" && !isNaN(event.id)
      )
      .filter((event) => {
        const eventDate = new Date(event.date);
        const searchDate = selectedDate ? new Date(selectedDate) : null;

        const nameMatch = event.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const dateMatch =
          !searchDate ||
          (eventDate.getFullYear() === searchDate.getFullYear() &&
            eventDate.getMonth() === searchDate.getMonth() &&
            eventDate.getDate() === searchDate.getDate());
        const categoryMatch =
          selectedCategory === "all" || event.category === selectedCategory;

        return nameMatch && dateMatch && categoryMatch;
      });
  }, [events, searchTerm, selectedDate, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-extrabold uppercase mb-4 text-glow">
          Enter the Concertverse
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The next dimension of live events is here. Mint your access pass.
        </p>
        <div className="mt-8 max-w-3xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="search"
              placeholder="Find your next experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-ui w-full px-5 py-3 text-center sm:text-left focus:ring-2 focus:ring-primary outline-none text-lg"
            />
          </div>
          <div className="flex justify-center gap-2 sm:gap-4">
            {eventCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-semibold uppercase rounded-full transition-colors ${
                  selectedCategory === category
                    ? "y2k-btn"
                    : "glass-ui hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-ui w-full sm:w-auto px-5 py-3 text-center focus:ring-2 focus:ring-primary outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center text-lg text-muted-foreground">
          Loading events...
        </div>
      )}
      {!isLoading && filteredEvents.length === 0 && (
        <div className="text-center text-lg text-muted-foreground py-12">
          No events match your criteria.
        </div>
      )}

      {!isLoading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelectEvent={onSelectEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

HomePage.propTypes = {
  events: PropTypes.array.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default HomePage;
