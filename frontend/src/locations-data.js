// This file contains the layout and capacity for each venue location.
export const eventLocations = [
  {
    name: "Starlight Amphitheater",
    seating: {
      "General Admission Floor": { type: 'standing', capacity: 700 },
      "Premium Floor": { type: 'standing', capacity: 500 },
      "Mezzanine 1": { type: 'seated', capacity: 800, layout: { rows: 20, seatsPerRow: 40 } },
      "Mezzanine 2": { type: 'seated', capacity: 900, layout: { rows: 25, seatsPerRow: 36 } },
      "VIP Box": { type: 'seated', capacity: 100, layout: { rows: 10, seatsPerRow: 10 } },
      "General Admission Lawn": { type: 'standing', capacity: 1000 },
    }
  },
  {
    name: "The Velvet Note",
    seating: {
      "Standard": { type: 'seated', capacity: 150, layout: { rows: 10, seatsPerRow: 15 } },
      "Balcony": { type: 'seated', capacity: 50, layout: { rows: 5, seatsPerRow: 10 } },
    }
  },
  {
    name: "Sector 7G",
    seating: {
      "General Admission": { type: 'standing', capacity: 2000 },
    }
  },
  {
    name: "Neo-Kyoto Convention Center",
    seating: {
      "Workshop Pass": { type: 'standing', capacity: 50 },
      "Auditorium Seat": { type: 'seated', capacity: 300, layout: { rows: 15, seatsPerRow: 20 } },
    }
  },
  {
    name: "The Grand Theatre",
    seating: {
      "Orchestra": { type: 'seated', capacity: 400, layout: { rows: 20, seatsPerRow: 20 } },
      "Mezzanine": { type: 'seated', capacity: 300, layout: { rows: 15, seatsPerRow: 20 } },
      "Balcony": { type: 'seated', capacity: 250, layout: { rows: 10, seatsPerRow: 25 } },
    }
  }
];
