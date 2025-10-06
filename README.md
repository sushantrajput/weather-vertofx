# Weather-VertoFx

A visually appealing weather dashboard application built with React and Tailwind CSS, showcasing current weather, forecasts, and a world map view.

## Features

* **Current Weather Details**: Displays current temperature, feels-like temperature, humidity, visibility, air quality index (AQI), and wind speed.
* **Hourly and Daily Forecasts**: Provides a 4-period hourly forecast for the current day and a 5-day daily forecast.
* **Dynamic UI**: The user interface color scheme changes based on the time of day (day, night, sunrise, sunset).
* **City Search with Suggestions**: Search for weather in different cities with auto-suggestions.
* **Responsive Layout**: The application layout adapts to different screen sizes and offers a "compact" view option.

## Getting Started

### Prerequisites

* Node.js (>=18.0.0)
* npm

### Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd weather-vertofx
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY"
    ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
