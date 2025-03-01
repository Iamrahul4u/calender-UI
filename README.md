# Calendar UI Documentation

## Overview

The **Calendar UI** is a React-based application that allows users to select available dates on an interactive calendar. The component displays pre-defined holidays, calculates remaining available days per month by subtracting holidays, weekends, and user-selected dates, and submits the selected dates to a backend API. This tool is ideal for scheduling, booking, or resource management applications.

## Features

- **Interactive Calendar**: Select available dates via an intuitive calendar interface.
- **Holiday Highlighting**: Pre-defined holidays are shown and cannot be selected.
- **Dynamic Calculations**: Automatically computes remaining available days per month.
- **Backend Integration**: Submits selected dates to a configurable API endpoint.
- **Responsive Design**: Styled using modern CSS practices for responsiveness and accessibility.
- **Toast Notifications**: Uses `sonner` to provide real-time user feedback.

## Setup Instructions

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **Yarn**
- A Vite-based React project (or similar) that supports environment variables.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Iamrahul4u/calender-UI.git
   cd calender-UI
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   or if using Yarn:

   ```bash
   yarn install
   ```

3. **Configure the API Endpoint:**
   Create a `.env` file in the root directory (if it doesn't exist) and add:

   ```env
   VITE_ENDPOINT_URL=https://your-api-endpoint.com/submit-dates
   ```

   Replace `https://your-api-endpoint.com/submit-dates` with the URL of your backend API.

### Running the Application

1. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

2. **Open in Browser:**
   The app will typically be available at [http://localhost:3000](http://localhost:3000).

## File Structure

```
/src
 ├── /components
 │   └── CalendarPage.tsx   # Main Calendar UI component
 ├── /styles
 │   └── calender.css       # Calendar-specific styles
 ├── App.tsx                # Application entry point
 ├── main.tsx               # Main rendering file (for Vite)
.env                       # Environment variables configuration
package.json               # Project dependencies and scripts
```

## Backend Integration Instructions

The app submits the selected available dates to a backend API using the `fetch` function. The API endpoint is configured via the `VITE_ENDPOINT_URL` environment variable.

### Key Points

- **API Endpoint Configuration:**
  Update the `.env` file:

  ```env
  VITE_ENDPOINT_URL=https://your-api-endpoint.com/submit-dates
  ```

- **Backend Requirements:**
  Ensure your backend is set up to receive a POST request with a JSON payload that includes `UserID`, `RecID`, `Action`, and `selectedAvailableDates`.

## Dependencies

- **React**: For building the UI.
- **react-day-picker**: For the calendar component.
- **date-fns**: For date manipulation and formatting.
- **sonner**: For displaying toast notifications.
- **Tailwind CSS** (or custom CSS): For responsive design and styling.
- **Vite**: For fast development and bundling.

## Customization

- **Calendar Data:**
  Modify the `calendarData` object in `CalendarPage.tsx` to update the calendar start/end dates, holidays, and previously selected dates.
- **Styling:**
  Customize the look and feel by editing `calender.css` or integrating with your preferred CSS framework.
- **Toast Notifications:**
  Adjust notification styles or behavior via the `sonner` library configuration.

## Troubleshooting

- **API Endpoint Issues:**
  Ensure the `VITE_ENDPOINT_URL` is correctly set in your `.env` file and that your backend is running and accessible.
- **Date Selection Problems:**
  Verify that holidays are correctly parsed as `Date` objects and that the formatting is consistent.
- **UI/Styling Glitches:**
  Check that the CSS file is correctly imported and that your build process handles CSS as expected.

## Contributing

If you’d like to contribute to this project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request detailing your changes.

```

```
