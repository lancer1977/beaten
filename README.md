# Game Tracker App

## Overview
Game Tracker is an **Angular** web application that takes a CSV file containing a list of beaten games and their respective systems, then organizes them into a clean and user-friendly UI. Each game entry includes a link to the How Long to Beat (HLTB) website for users to check playtime estimates.

## Features
- 📝 **CSV Parsing**: Reads a CSV file containing game titles and platforms.
- 🎮 **Organized UI**: Displays the data in an easy-to-navigate Angular-based interface.
- 🔗 **HLTB Integration**: Each game entry includes a link to its corresponding How Long to Beat page.
- 📱 **Responsive Design**: Works on both desktop and mobile devices.

## Current Limitations
⚠️ The application is currently hardcoded to use data from the Google Sheet associated with `Segafan001`.

✅ **Planned Improvements:**
- Support for other Google Sheets.
- Direct import from Google Sheets instead of requiring a CSV file.
- Additional filtering and sorting options for the game list.
- UI enhancements for a more polished experience.

## Getting Started

### Requirements
- **Angular CLI** installed (`npm install -g @angular/cli`)
- A CSV file with game data (title, system, and optionally a How Long to Beat URL)
- A web browser to view the application

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/game-tracker.git
   cd game-tracker
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the application:**
   ```sh
   ng serve
   ```
4. **Open your browser** and navigate to `http://localhost:4200`.

## Contributing
💡 Contributions are welcome! If you'd like to help improve support for different Google Sheets or enhance the UI, feel free to submit a pull request.

## License
📜 This project is licensed under the **MIT License**.

## Contact
For questions or suggestions, feel free to open an issue or reach out on GitHub.

