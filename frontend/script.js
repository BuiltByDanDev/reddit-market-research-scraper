document.addEventListener("DOMContentLoaded", () => {
	const threadsContainer = document.getElementById("threads-container");
	const scrapeBtn = document.getElementById("scrape-btn");
	const scrapeStatus = document.getElementById("scrape-status");
	const subredditInput = document.getElementById("subreddit-input");
	const pillContainer = document.getElementById("pill-container");
	const paginationControls = document.getElementById("pagination-controls");
	const prevPageBtn = document.getElementById("prev-page-btn");
	const nextPageBtn = document.getElementById("next-page-btn");
	const pageInfo = document.getElementById("page-info");

	const suggestedSubreddits = [
		"photographybusiness",
		"freelance",
		"videography",
		"graphic_design",
		"DesignJobs",
		"consulting",
		"creativity",
		"smallbusiness",
		"startups",
		"Entrepreneur",
		"indiebiz",
		"indiehackers",
		"sideproject",
		"teachers",
		"fitnessinstructors",
		"personaltraining",
		"onlinecourses",
		"yoga",
		"productivity",
		"AskReddit",
		"askentrepreneurs",
		"AskPhotography",
		"AskAcademia",
		"AskMarketing",
	];

	let allThreads = [];
	let currentPage = 1;
	const threadsPerPage = 10;

	// --- Function to trigger a scrape ---
	const triggerScrape = () => {
		const subreddit = subredditInput.value.trim();
		if (!subreddit) {
			scrapeStatus.textContent = "Please enter a subreddit name.";
			return;
		}

		// Clear previous results immediately and show loading state
		threadsContainer.innerHTML = `<p>Scraping r/${subreddit} for new threads...</p>`;
		paginationControls.classList.add("hidden"); // Hide pagination during scrape

		// Update pill states
		document.querySelectorAll(".pill").forEach(p => {
			p.classList.remove("selected", "loading");
			if (p.dataset.subreddit.toLowerCase() === subreddit.toLowerCase()) {
				p.classList.add("selected", "loading");
			}
		});

		scrapeBtn.disabled = true;
		subredditInput.disabled = true;
		scrapeStatus.textContent = `Scraping r/${subreddit}...`;

		fetch("/api/scrape", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ subreddit: subreddit }),
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === "success") {
					scrapeStatus.textContent = `Scrape of r/${data.subreddit} complete! Found ${data.threads_found} threads.`;
					loadThreads();
				} else {
					scrapeStatus.textContent = `Error: ${
						data.message || "Unknown error"
					}`;
					threadsContainer.innerHTML = `<p class="error">Scrape failed: ${
						data.message || "Unknown error"
					}</p>`;
				}
			})
			.catch(error => {
				console.error("Error triggering scrape:", error);
				scrapeStatus.textContent = "Scrape failed. Check server logs.";
				threadsContainer.innerHTML = `<p class="error">Scrape failed. Could not connect to the server.</p>`;
			})
			.finally(() => {
				scrapeBtn.disabled = false;
				subredditInput.disabled = false;
				document
					.querySelectorAll(".pill.loading")
					.forEach(p => p.classList.remove("loading"));
				setTimeout(() => {
					scrapeStatus.textContent = "";
				}, 5000);
			});
	};

	// --- Function to render the current page of threads ---
	const renderCurrentPage = () => {
		threadsContainer.innerHTML = "";

		const startIndex = (currentPage - 1) * threadsPerPage;
		const endIndex = startIndex + threadsPerPage;
		const pageThreads = allThreads.slice(startIndex, endIndex);

		if (pageThreads.length === 0 && allThreads.length > 0) {
			threadsContainer.innerHTML = `<p>No threads on this page.</p>`;
		} else if (allThreads.length === 0) {
			threadsContainer.innerHTML = `<p>No threads found. Try scraping a subreddit!</p>`;
		} else {
			pageThreads.forEach(thread => {
				const card = document.createElement("div");
				card.className = "card";
				const cardHeader = document.createElement("div");
				cardHeader.className = "card-header";
				cardHeader.innerHTML = `<h2>${thread.title}</h2><span class="score">Score: ${thread.score}</span>`;
				const cardBody = document.createElement("div");
				cardBody.className = "card-body";
				cardBody.innerHTML = `<p>${
					thread.body || "No text body."
				}</p><a href="${
					thread.url
				}" target="_blank" rel="noopener noreferrer">View on Reddit</a>`;
				card.appendChild(cardHeader);
				card.appendChild(cardBody);
				threadsContainer.appendChild(card);
				cardHeader.addEventListener("click", () =>
					cardBody.classList.toggle("expanded")
				);
			});
		}

		updatePaginationControls();
	};

	// --- Function to update pagination buttons and info ---
	const updatePaginationControls = () => {
		const totalPages = Math.ceil(allThreads.length / threadsPerPage);

		if (totalPages <= 1) {
			paginationControls.classList.add("hidden");
			return;
		}

		paginationControls.classList.remove("hidden");
		pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
		prevPageBtn.disabled = currentPage === 1;
		nextPageBtn.disabled = currentPage >= totalPages;
	};

	// --- Function to fetch and display threads ---
	const loadThreads = () => {
		threadsContainer.innerHTML = "<p>Loading threads...</p>";
		fetch("/api/threads", { cache: "no-cache" })
			.then(response => response.json())
			.then(threads => {
				if (threads.error) {
					threadsContainer.innerHTML = `<p class="error">${threads.error}</p>`;
					allThreads = [];
				} else {
					allThreads = threads;
				}
				currentPage = 1;
				renderCurrentPage();
			})
			.catch(error => {
				console.error("Error loading threads:", error);
				threadsContainer.innerHTML = `<p class="error">Could not load threads. Is the server running?</p>`;
				allThreads = [];
				renderCurrentPage();
			});
	};

	// --- Initializer Function ---
	const init = () => {
		// Generate pills
		suggestedSubreddits.forEach(sub => {
			const pill = document.createElement("div");
			pill.className = "pill";
			pill.textContent = sub;
			pill.dataset.subreddit = sub;
			// Add a slight random rotation for visual flair
			const rotation = (Math.random() - 0.5) * 4; // between -2 and 2 degrees
			pill.style.transform = `rotate(${rotation}deg)`;
			pillContainer.appendChild(pill);
		});

		// Listener for pill clicks
		pillContainer.addEventListener("click", e => {
			if (e.target.classList.contains("pill")) {
				subredditInput.value = e.target.dataset.subreddit;
				triggerScrape();
			}
		});

		// Listener for the main scrape button
		scrapeBtn.addEventListener("click", triggerScrape);

		// Initial load of threads
		loadThreads();

		prevPageBtn.addEventListener("click", () => {
			if (currentPage > 1) {
				currentPage--;
				renderCurrentPage();
			}
		});

		nextPageBtn.addEventListener("click", () => {
			const totalPages = Math.ceil(allThreads.length / threadsPerPage);
			if (currentPage < totalPages) {
				currentPage++;
				renderCurrentPage();
			}
		});
	};

	init();
});
