import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";

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
        const nameMatch = event.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const dateMatch = !selectedDate || event.localDate === selectedDate;
        const categoryMatch =
          selectedCategory === "all" || event.category === selectedCategory;

        return nameMatch && dateMatch && categoryMatch;
      });
  }, [events, searchTerm, selectedDate, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold uppercase mb-4 text-glow animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          Enter the Concertverse
        </h1>
        <p className="text-md sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
          The next dimension of live events is here. Mint your access pass.
        </p>
        <div className="mt-8 max-w-3xl mx-auto flex flex-col gap-4 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="search"
              placeholder="Find your next experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-ui w-full px-5 py-3 text-center sm:text-left focus:ring-2 focus:ring-primary outline-none text-lg"
            />
          </div>
          <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
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
              className="glass-ui w-full sm:w-auto px-5 py-3 text-center focus:ring-2 focus:ring-primary outline-none text-base"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelectEvent={onSelectEvent}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-muted-foreground py-12">
          No events match your criteria.
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
