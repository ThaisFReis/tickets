# Research: Assigned Seating Feature

## Smart Contract Seat State Management

- **Decision**: Use a mapping `(uint256 => mapping(uint256 => address))` to store the owner of each seat for a given concert. The first key will be the concert ID, the second will be a unique seat identifier.
- **Rationale**: This approach is gas-efficient for checking the status of a single seat and for assigning ownership. It avoids iterating over large arrays.
- **Alternatives considered**:
    - **Array of structs**: Less efficient for lookups and updates.
    - **Bitmaps**: More complex to implement and manage.

## Interactive Venue Map Libraries

- **Decision**: Use a custom React component with SVG for rendering the venue map.
- **Rationale**: This gives us full control over the appearance and behavior of the map without adding a new dependency. SVG is well-suited for this purpose and can be easily manipulated with React.
- **Alternatives considered**:
    - **Existing libraries (e.g., react-seat-picker)**: These libraries might not be flexible enough for our specific needs and could add unnecessary bloat.

## Venue Map JSON Structure

- **Decision**:
  ```json
  {
    "venueName": "Example Arena",
    "sections": [
      {
        "sectionName": "Floor",
        "rows": [
          {
            "rowName": "A",
            "seats": [
              {"seatNumber": "1", "x": 10, "y": 10},
              {"seatNumber": "2", "x": 20, "y": 10}
            ]
          }
        ]
      }
    ]
  }
  ```
- **Rationale**: This structure is simple, hierarchical, and easy to parse and render in the frontend. The `x` and `y` coordinates will be used for positioning the seats in the SVG.
