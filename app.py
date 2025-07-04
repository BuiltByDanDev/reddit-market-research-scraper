from flask import Flask, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='frontend', static_url_path='')

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
