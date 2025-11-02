
const API_KEY = '7b19a4698b3f410fa3b470dcbcd9362c'; 
const newsContainer = document.getElementById('newsContainer');
const statusText = document.getElementById('status');
const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

// load saved topic
const savedTopic = localStorage.getItem('preferredTopic');

// if there is a saved topic, show it
if (savedTopic) {
    topicInput.value = savedTopic;
    fetchNews(savedTopic);
} else {
    // otherwise show default headlines
    fetchTopHeadlines();
}

// when user clicks Search
searchBtn.addEventListener('click', function() {
    const topic = topicInput.value.trim();
    if (topic !== "") {
        localStorage.setItem('preferredTopic', topic);
        fetchNews(topic);
    } else {
        statusText.textContent = "Please type a topic!";
    }
});

// when user clicks Clear
clearBtn.addEventListener('click', function() {
    localStorage.removeItem('preferredTopic');
    topicInput.value = "";
    newsContainer.innerHTML = "";
    statusText.textContent = "Saved topic cleared. Showing default news...";
    fetchTopHeadlines();
});

// function to fetch news for a topic
function fetchNews(topic) {
    statusText.textContent = "Loading news...";
    newsContainer.innerHTML = "";

    fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=10&apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok" && data.articles.length > 0) {
                statusText.textContent = "";
                displayArticles(data.articles);
            } else {
                statusText.textContent = "No articles found for that topic.";
            }
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            statusText.textContent = "Error loading news. Please try again.";
        });
}

// function to fetch top US headlines (default feed)
function fetchTopHeadlines() {
    statusText.textContent = "Loading top headlines...";
    newsContainer.innerHTML = "";

    fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok" && data.articles.length > 0) {
                statusText.textContent = "";
                displayArticles(data.articles);
            } else {
                statusText.textContent = "No top headlines found.";
            }
        })
        .catch(error => {
            console.error("Error fetching headlines:", error);
            statusText.textContent = "Error loading default news.";
        });
}

// function to show articles on the page
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
