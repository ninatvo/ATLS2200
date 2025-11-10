const API_KEY = '47814adebd92fcbd0a0027c3e4ce109d';
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
    
    const url = `http://api.mediastack.com/v1/news?access_key=${API_KEY}&keywords=${encodeURIComponent(topic)}&languages=en&limit=10`;
    
    fetch(url)
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Search data:', data);
            if (data.data && data.data.length > 0) {
                statusText.textContent = "";
                displayArticles(data.data);
            } else if (data.error) {
                statusText.textContent = "API Error: " + data.error.message;
                console.error('API Error:', data.error);
            } else {
                statusText.textContent = "No articles found for that topic.";
            }
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            statusText.textContent = "Error loading news. Check console for details.";
        });
}

// fetch default feed
function fetchTopHeadlines() {
    statusText.textContent = "Loading top headlines...";
    newsContainer.innerHTML = "";
    
    const url = `http://api.mediastack.com/v1/news?access_key=${API_KEY}&countries=us&languages=en&limit=10`;
    
    fetch(url)
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Headlines data:', data);
            if (data.data && data.data.length > 0) {
                statusText.textContent = "";
                displayArticles(data.data);
            } else if (data.error) {
                statusText.textContent = "API Error: " + data.error.message;
                console.error('API Error:', data.error);
            } else {
                statusText.textContent = "No top headlines found.";
            }
        })
        .catch(error => {
            console.error("Error fetching headlines:", error);
            statusText.textContent = "Error loading default news. Check console for details.";
        });
}

// display articles
function displayArticles(articles) {
    newsContainer.innerHTML = "";
    articles.forEach(article => {
        const div = document.createElement('div');
        div.className = "article";
        
        // placeholder if no image or if image is null/empty
        let imageUrl = 'https://via.placeholder.com/300x200/35bfe6/ffffff?text=News+Article';
        if (article.image && article.image.trim() !== '') {
            imageUrl = article.image;
        }
        
        const description = article.description || 'No description available.';
        
        div.innerHTML = `
            <img src="${imageUrl}" alt="${article.title || 'News Image'}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/35bfe6/ffffff?text=News+Article';">
            <h3>${article.title}</h3>
            <p>${description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(div);
    });
}