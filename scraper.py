import praw
import os
import json

# --- Reddit API Setup ---
# It's best practice to load credentials from environment variables
# rather than hardcoding them in the script. You will need to set these
# environment variables in your terminal before running the script.
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent="MarketResearchScraper/0.1 by u/YourUsername"  # TODO: Replace with your Reddit username
)

print("Successfully connected to Reddit API")

def scrape_subreddit(subreddit_name, keywords, limit=100):
    """
    Scrapes a subreddit for posts containing specific keywords in the title or body.

    Args:
        subreddit_name (str): The name of the subreddit to scrape.
        keywords (list): A list of keywords to search for.
        limit (int): The maximum number of posts from 'hot' to check.

    Returns:
        list: A list of dictionaries, each representing a found thread.
    """
    print(f"\nScraping r/{subreddit_name} for keywords: {keywords}...")
    subreddit = reddit.subreddit(subreddit_name)
    found_threads = []
    keywords_lower = [k.lower() for k in keywords]

    for submission in subreddit.hot(limit=limit):
        # Combine title and body for searching, handle potential None for body
        search_text = submission.title.lower() + " " + (submission.selftext.lower() or "")
        
        if any(keyword in search_text for keyword in keywords_lower):
            thread_data = {
                "id": submission.id,
                "title": submission.title,
                "score": submission.score,
                "url": f"https://www.reddit.com{submission.permalink}",
                "body": submission.selftext
            }
            found_threads.append(thread_data)
            print(f"  - Found match: {submission.title[:60]}...")

    print(f"\nScraping complete. Found {len(found_threads)} matching threads.")
    return found_threads

def save_data(data, filename="scraped_data.json"):
    """Saves the scraped data to a JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Data saved to {filename}")

# --- Main Execution ---
if __name__ == "__main__":
    # 1. Define your search parameters
    target_subreddit = "smallbusiness"
    search_keywords = ["problem", "pain point", "frustrated", "wish there was", "solution for"]
    
    # 2. Scrape the data
    scraped_data = scrape_subreddit(target_subreddit, search_keywords)
    
    # 3. Save the data to a file
    if scraped_data:
        save_data(scraped_data)
