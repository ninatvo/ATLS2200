let API_KEY = localStorage.getItem('newsApiKey');

if (!API_KEY) {
    API_KEY = prompt('Enter your NewsAPI key.\nGet one free at: https://newsapi.org/register');
    if (API_KEY) {
        localStorage.setItem('newsApiKey', API_KEY);
        alert('API key saved! Refresh to load news.');
    }
}

const newsContainer = document.getElementById('newsContainer');
const statusText = document.getElementById('status');
const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

// load saved topic from localStorage
const savedTopic = localStorage.getItem('preferredTopic');

// if there's a saved topic, show it 
if (savedTopic) {
    topicInput.value = savedTopic;
    fetchNews(savedTopic);
} else { // otherwise show default feed
    fetchTopHeadlines();
}

// search button click
searchBtn.addEventListener('click', function() {
    const topic = topicInput.value.trim();
    if (topic !== "") {
        localStorage.setItem('preferredTopic', topic);
        fetchNews(topic);
    } else {
        statusText.textContent = "Please type a topic!";
    }
});

// clear button click
clearBtn.addEventListener('click', function() {
    localStorage.removeItem('preferredTopic');
    topicInput.value = "";
    newsContainer.innerHTML = "";
    statusText.textContent = "Saved topic cleared. Showing default news...";
    fetchTopHeadlines();
});

// fetch news for a specific topic
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

// fetch default feed
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

// display fetched articles
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
