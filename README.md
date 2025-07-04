# Reddit Market Research Scraper

A simple web application to scrape subreddits for posts containing keywords related to market research. It helps identify user pain points and business opportunities.

## Features

-   **Dynamic Subreddit Scraping:** Enter any subreddit name to start a search.
-   **Powerful Keyword Search:** Uses Reddit's search API to find relevant posts from the last year based on a list of "problem-finding" keywords.
-   **Interactive UI:** A clean, card-based layout to display results.
-   **Subreddit Pills:** Quick-access buttons for a list of suggested subreddits.
-   **Pagination:** Easily navigate through a large number of search results.

## Getting Started

### Prerequisites

-   Python 3.x
-   A Reddit account and API credentials (a "script" type app).

### Setup

1.  **Clone the repository or download the source code.**

2.  **Install Python dependencies:**
    Navigate to the project directory in your terminal and run:

    ```bash
    pip install -r requirements.txt
    ```

3.  **Create an environment file:**
    In the root of the project, create a file named `.env`. Add your Reddit API credentials to this file:
    ```
    REDDIT_CLIENT_ID="YOUR_CLIENT_ID_HERE"
    REDDIT_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"
    REDDIT_USER_AGENT="MarketResearchApp:v1.0 (by /u/YourUsername)"
    ```

## Running the Application

1.  **Start the backend server:**

    ```bash
    python app.py
    ```

2.  **View the application:**
    Open your web browser and navigate to `http://127.0.0.1:5001/`.
