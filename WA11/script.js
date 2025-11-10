// RSS2JSON free service
const newsContainer = document.getElementById('newsContainer');
const statusText = document.getElementById('status');
const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

// saved topic from localStorage
const savedTopic = localStorage.getItem('preferredTopic');
if (savedTopic) {
    topicInput.value = savedTopic;
    fetchNews(savedTopic);
} else {
    fetchTopHeadlines();
}

// search button on click
searchBtn.addEventListener('click', function() {
    const topic = topicInput.value.trim();
    if (topic !== "") {
        localStorage.setItem('preferredTopic', topic);
        fetchNews(topic);
    } else {
        statusText.textContent = "Please type a topic!";
    }
});

// clear button on click
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
    
    // Google News RSS feed through RSS2JSON
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=public&count=10`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Search response:', data);
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                statusText.textContent = "";
                displayArticles(data.items);
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
    
    // Google News RSS feed for US top stories
    const rssUrl = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=public&count=10`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Headlines response:', data);
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                statusText.textContent = "";
                displayArticles(data.items);
            } else {
                statusText.textContent = "No top headlines found.";
            }
        })
        .catch(error => {
            console.error("Error fetching headlines:", error);
            statusText.textContent = "Error loading default news.";
        });
}

// display articles
function displayArticles(items) {
    newsContainer.innerHTML = "";
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = "article";
        
        // extract image from content or use placeholder
        let imageUrl = 'https://via.placeholder.com/300x200?text=News';
        if (item.enclosure && item.enclosure.link) {
            imageUrl = item.enclosure.link;
        } else if (item.thumbnail) {
            imageUrl = item.thumbnail;
        }
        
        // description
        let description = item.description || 'No description available.';
        description = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
        
        div.innerHTML = `
            <img src="${imageUrl}" alt="${item.title || 'News Image'}" onerror="this.src='https://via.placeholder.com/300x200?text=News'">
            <h3>${item.title}</h3>
            <p>${description}</p>
            <a href="${item.link}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(div);
    });
}