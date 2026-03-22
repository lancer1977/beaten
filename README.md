# Game Tracker App

**Vault Project:** `~/vaults/polyhydra/20_Projects/cc-beaten`


## Overview
Game Tracker is an **Angular** web application that takes a CSV file containing a list of beaten games and their respective systems, then organizes them into a clean and user-friendly UI. Each game entry includes a link to the How Long to Beat (HLTB) website for users to check playtime estimates.

## Features
- 📝 **CSV Parsing**: Reads a CSV file containing game titles and platforms.
- 🎮 **Organized UI**: Displays the data in an easy-to-navigate Angular-based interface.
- 🔗 **HLTB Integration**: Each game entry includes a link to its corresponding How Long to Beat page.
- 📱 **Responsive Design**: Works on both desktop and mobile devices.
- ⚙️ **Custom Sheet Configuration**: Connect to your own publicly published Google Sheet.
- 🔍 **Filter & Search**: Filter games by platform, search by title, and sort by various criteria.
- 💾 **Persisted Preferences**: Active filters and sort options automatically saved to localStorage.

## Configuration

### Setting Up Your Google Sheet

1. **Prepare Your Sheet**: Your Google Sheet should have columns for:
   - Title (game name)
   - Platform/Console
   - Genre (optional)
   - Status (optional)

2. **Publish Your Sheet**:
   - Open your Google Sheet
   - Go to **File > Share > Publish to web**
   - Select the sheet/tab you want to share
   - Click **Publish**

3. **Get Your Sheet ID**:
   - From the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - The Sheet ID is the long string between `/d/` and `/edit`

### Configuring in the App

1. Click **Settings** in the navigation menu
2. Enter a **Streamer Name** (identifier for this configuration)
3. Paste your **Google Sheet ID or full URL**
4. Click **Validate** to verify the sheet is accessible
5. Adjust **Column Mapping** if your sheet uses different column names
6. Click **Save Configuration**

Your sheet will now be available when you navigate to `/{streamerName}`.

### Switching Between Sheets

- Navigate to `/{streamerName}` to load a specific sheet
- Use the dropdown in the game list to switch between configured sheets
- Your selection persists across sessions

### Filtering & Sorting

The game list supports powerful filtering and sorting options:

**Sorting:**
- **Title (A-Z)**: Sort games alphabetically by title
- **Title (Z-A)**: Sort games in reverse alphabetical order
- **System**: Sort by platform/console name
- **Date Added**: Sort by most recently added (newest first)

**Filtering:**
- **Platform Filter**: Dropdown to filter games by console/platform
- **Search**: Type to search games by title (with 300ms debounce for performance)
- **Clear Filters**: Reset all filters to default values with one click

All filter and sort preferences are automatically saved to your browser's localStorage, so your settings persist across page reloads and sessions.

### Troubleshooting

**"Sheet not found"**: Verify the Sheet ID is correct.

**"Sheet is not publicly readable"**: Make sure you've published the sheet via File > Share > Publish to web.

**"Network error"**: Check your internet connection and the Google Sheets URL.

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



## 📖 Documentation
Detailed documentation can be found in the following sections:
- [Feature Index](./docs/features/README.md)
- [Core Capabilities](./docs/features/core-capabilities.md)
