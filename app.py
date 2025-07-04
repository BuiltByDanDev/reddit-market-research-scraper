from flask import Flask, jsonify, send_from_directory, request
import json
import os
# Import the scraper function
from scraper import run_scraper

app = Flask(__name__, static_folder='frontend', static_url_path='')

@app.route('/api/scrape', methods=['POST'])
def trigger_scrape():
    """API endpoint to trigger the Reddit scraper for a specific subreddit."""
    data = request.get_json()
    if not data or not data.get('subreddit') or not data['subreddit'].strip():
        return jsonify({"status": "error", "message": "Subreddit name is required."}), 400

    subreddit = data['subreddit'].strip()
    print(f"Scrape request received for r/{subreddit}. Running scraper...")
    try:
        result = run_scraper(subreddit_name=subreddit)
        print(f"Scrape finished. Result: {result}")
        return jsonify(result)
    except Exception as e:
        print(f"An error occurred during scraping: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/threads')
def get_threads():
    """API endpoint to serve the scraped Reddit data."""
    try:
        with open('scraped_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "scraped_data.json not found. Run scraper.py first."}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding scraped_data.json. The file might be empty or corrupt."}), 500

@app.route('/')
def serve_index():
    """Serves the main HTML file of the frontend."""
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Use port 5001 to avoid potential conflicts with other services
    app.run(debug=True, port=5001)
