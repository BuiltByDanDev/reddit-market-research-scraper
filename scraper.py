import praw
import os
import json
from dotenv import load_dotenv

# --- Reddit API Setup ---
# It's best practice to load credentials from environment variables
# rather than hardcoding them in the script. You will need to set these
# environment variables in your terminal before running the script.

def scrape_subreddit(subreddit_name, keywords, limit=100):
    """
    Scrapes a subreddit using Reddit's search for posts containing specific keywords.
    """
    # 1. Authenticate with Reddit
    load_dotenv()
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    user_agent = os.getenv("REDDIT_USER_AGENT")

    if not all([client_id, client_secret, user_agent]):
        raise ValueError("Reddit API credentials not found in environment variables.")

    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent
    )

    subreddit = reddit.subreddit(subreddit_name)
    
    # 2. Build the search query for Reddit's API
    search_query = ' OR '.join(f'"{k}"' for k in keywords)
    
    print(f"\nSearching /r/{subreddit_name} for posts matching: {search_query}")
    print(f"Sorting by 'top' from the last 'year'. Limit: {limit} posts.")

    found_threads = []
    try:
        # 3. Execute the search, which is much more effective
        for submission in subreddit.search(search_query, sort='top', time_filter='year', limit=limit):
            found_threads.append({
                'id': submission.id,
                'title': submission.title,
                'score': submission.score,
                'url': f"https://www.reddit.com{submission.permalink}", # More reliable URL
                'body': submission.selftext
            })
            print(f"  - Found: {submission.title[:70]}...")
    except Exception as e:
        print(f"An error occurred while searching r/{subreddit_name}: {e}")
        # Return whatever we found before the error
        return found_threads

    print(f"\nSearch complete. Found {len(found_threads)} matching threads.")
    return found_threads

def save_data(data, filename="scraped_data.json"):
    """Saves the scraped data to a JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Data saved to {filename}")

def run_scraper(subreddit_name="smallbusiness"):
    """Defines parameters and runs the scraper and saves the data."""
    # 1. Define your search parameters
    target_subreddit = subreddit_name
    search_keywords = ["what do you use for", "is there a tool", "i wish there was",
    "how do you manage", "alternatives to", "need a better way to"]
    
    # 2. Scrape the data
    scraped_data = scrape_subreddit(target_subreddit, search_keywords)
    
    # 3. Save the data to a file, overwriting previous results.
    save_data(scraped_data)

    return {"status": "success", "threads_found": len(scraped_data), "subreddit": target_subreddit}

# --- Main Execution ---
if __name__ == "__main__":
    # When run directly, it uses the default subreddit "smallbusiness"
    run_scraper()
