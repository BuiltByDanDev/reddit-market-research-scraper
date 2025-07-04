document.addEventListener("DOMContentLoaded", () => {
	const threadsContainer = document.getElementById("threads-container");

	fetch("/api/threads")
		.then(response => response.json())
		.then(threads => {
			if (threads.error) {
				threadsContainer.innerHTML = `<p class="error">${threads.error}</p>`;
				return;
			}
			if (threads.length === 0) {
				threadsContainer.innerHTML = `<p>No threads found. Run the scraper!</p>`;
				return;
			}

			threads.forEach(thread => {
				const card = document.createElement("div");
				card.className = "card";

				const cardHeader = document.createElement("div");
				cardHeader.className = "card-header";
				cardHeader.innerHTML = `
                    <h2>${thread.title}</h2>
                    <span class="score">Score: ${thread.score}</span>
                `;

				const cardBody = document.createElement("div");
				cardBody.className = "card-body";
				cardBody.innerHTML = `
                    <p>${thread.body || "No text body."}</p>
                    <a href="${
						thread.url
					}" target="_blank" rel="noopener noreferrer">View on Reddit</a>
                `;

				card.appendChild(cardHeader);
				card.appendChild(cardBody);
				threadsContainer.appendChild(card);

				// Add click event listener to the header to toggle the body
				cardHeader.addEventListener("click", () => {
					cardBody.classList.toggle("expanded");
				});
			});
		})
		.catch(error => {
			console.error("Error fetching threads:", error);
			threadsContainer.innerHTML = `<p class="error">Failed to load threads. Is the server running?</p>`;
		});
});
