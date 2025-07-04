# Reddit Market Research Scraper

This is a simple full-stack web application designed to scrape subreddits for posts related to specific keywords, helping to identify pain points and problems for market research. The backend is built with Python (PRAW for scraping, Flask for the API), and the frontend is built with vanilla HTML, CSS, and JavaScript.

## Features

-   Scrapes specified subreddits for posts containing keywords in the title or body.
-   Saves scraped data to a local `scraped_data.json` file.
-   A Flask API serves the scraped data.
-   A clean, card-based frontend displays the threads.
-   Cards are expandable to show the full post body and include a link to the original Reddit thread.

## Project Structure

```
/reddit-market-research-scraper
|-- /frontend
|   |-- index.html      # Main HTML page
|   |-- style.css       # Styles for the frontend
|   `-- script.js       # JS to fetch data and build UI
|-- venv/               # Python virtual environment
|-- app.py              # Flask web server and API
|-- scraper.py          # Python script to scrape Reddit
|-- scraped_data.json   # Output file for scraped data (auto-generated)
|-- requirements.txt    # Python package dependencies
`-- README.md           # This file
```

## Setup and Installation

Follow these steps to get the application running on your local machine.

### 1. Clone the Repository

(Or download the files into a local directory).

### 2. Set Up Reddit API Credentials

-   Go to [Reddit's App Preferences](https://www.reddit.com/prefs/apps) and click "are you a developer? create an app...".
-   Create a new app with the type "script".
-   Use `http://localhost:8080` for the redirect uri.
-   Once created, you will get a **client ID** (a string of characters under the app name) and a **client secret**.

### 3. Configure the Environment

-   **Create and Activate Virtual Environment:**
    Navigate to the project directory and run:

    ```bash
    # Create the virtual environment
    python3 -m venv venv

    # Activate it (on macOS/Linux)
    source venv/bin/activate
    ```

-   **Install Dependencies:**
    With the virtual environment active, install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

-   **Set Environment Variables:**
    In your terminal, set the following environment variables using the credentials from Step 2. **These are only set for the current terminal session.**

    ```bash
    export REDDIT_CLIENT_ID="YOUR_CLIENT_ID_HERE"
    export REDDIT_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
    ```

-   **Update User Agent:**
    Open `scraper.py` and change the `user_agent` string to include your own Reddit username.

## How to Run

### Step 1: Run the Scraper

First, you need to generate the data file. You can customize the `target_subreddit` and `search_keywords` in the `if __name__ == "__main__":` block at the bottom of `scraper.py`.

Run the scraper from your terminal (make sure your venv is active and environment variables are set):

```bash
python scraper.py
```

This will create/update the `scraped_data.json` file.

### Step 2: Run the Web App

In the same terminal, start the Flask server:

```bash
python app.py
```

### Step 3: View in Browser

Open your web browser and navigate to:

[http://127.0.0.1:5001/](http://127.0.0.1:5001/)

You should see the web application with the data you scraped.
