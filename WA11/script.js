const API_KEY = '7b19a4698b3f410fa3b470dcbcd9362c'; 
const newsContainer = document.getElementById('newsContainer');
const statusText = document.getElementById('status');
const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

// Load saved topic from localStorage
const savedTopic = localStorage.getItem('preferredTopic');

// If there's a saved topic, show it — otherwise load default headlines
if (savedTopic) {
    topicInput.value = savedTopic;
    fetchNews(savedTopic);
} else {
    fetchTopHeadlines();
}

// Search button click
searchBtn.addEventListener('click', function() {
    const topic = topicInput.value.trim();
    if (topic !== "") {
        localStorage.setItem('preferredTopic', topic);
        fetchNews(topic);
    } else {
        statusText.textContent = "Please type a topic!";
    }
});

// Clear button click
clearBtn.addEventListener('click', function() {
    localStorage.removeItem('preferredTopic');
    topicInput.value = "";
    newsContainer.innerHTML = "";
    statusText.textContent = "Saved topic cleared. Showing default news...";
    fetchTopHeadlines();
});

// Fetch news for a specific topic (via proxy)
function fetchNews(topic) {
    statusText.textContent = "Loading news...";
    newsContainer.innerHTML = "";

    const realUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=10&apiKey=${API_KEY}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(realUrl)}`;

    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            const parsed = JSON.parse(data.contents);
            if (parsed.status === "ok" && parsed.articles.length > 0) {
                statusText.textContent = "";
                displayArticles(parsed.articles);
            } else {
                statusText.textContent = "No articles found for that topic.";
            }
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            statusText.textContent = "Error loading news. Please try again.";
        });
}

// Fetch top US headlines (default feed) via proxy
function fetchTopHeadlines() {
    statusText.textContent = "Loading top headlines...";
    newsContainer.innerHTML = "";

    const realUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(realUrl)}`;

    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            const parsed = JSON.parse(data.contents);
            if (parsed.status === "ok" && parsed.articles.length > 0) {
                statusText.textContent = "";
                displayArticles(parsed.articles);
            } else {
                statusText.textContent = "No top headlines found.";
            }
        })
        .catch(error => {
            console.error("Error fetching headlines:", error);
            statusText.textContent = "Error loading default news.";
        });
}

// Display fetched articles
function displayArticles(articles) {
    newsContainer.innerHTML = "";
    articles.forEach(function(article) {
        const div = document.createElement('div');
        div.className = "article";

        div.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(div);
    });
}
