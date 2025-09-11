// This file contains the seating layout and capacity data for each venue.
// This data should be kept in sync with the `eventLocations` object in `backend/scripts/deploy.js`.

export const eventLocations = [
  {
    name: "Starlight Amphitheater",
    seating: {
      "General Admission Flor": { capacity: 700, type: "standing" },
      "Premium Floor": { capacity: 500, type: "standing" },
      "Mezzanine 1": { capacity: 800, type: "seated" },
      "Mezzanine 2": { capacity: 900, type: "seated" },
      "VIP Box": { capacity: 100, type: "seated" },
      "General Admission Lawn": { capacity: 1000, type: "seated" },
    },
  },
  {
    name: "Neo-Kyoto Convention Center",
    seating: {
      "Workshop Pass": { capacity: 50, type: "standing" },
      "Auditorium Seat": { capacity: 300, type: "seated" },
    },
  },
  {
    name: "The Grand Theatre",
    seating: {
      Orchestra: { capacity: 400, type: "seated" },
      Mezzanine: { capacity: 300, type: "seated" },
      Balcony: { capacity: 250, type: "seated" },
    },
  },
];