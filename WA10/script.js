let triviaBtn = document.querySelector("#js-new-quote"); // trivia button
let answerBtn = document.querySelector("#js-tweet"); // reveal author button
const endpoint = "https://quotes-api-self.vercel.app/quote";
const dog = "https://dog.ceo/api/breeds/image/random";
triviaBtn.addEventListener('click', getQuote); // clicking trivia button calls getQuote function
answerBtn.addEventListener('click', displayAuthor); // clicking author button calls displayAuthor function

let current = {
    quote: "",
    author: ""
}

let doggie = {
    message: ""
}

async function getQuote() {
    try {
        const response = await fetch(endpoint); // await results of a fetch endpoint command

        if (!response.ok) {
            throw Error(response.statusText);
        }
        const json = await response.json(); // assign json response to variable
        current.quote = json["quote"];
        current.author = json["author"];
        doggie.message = json["message"];
        displayQuote(current.quote);
    }
    catch (err) {
        console.log(err);
        alert("Failed to get new trivia");
    }
}

function displayQuote(quote) {
    const questionText = document.querySelector("#js-quote-text");
    const answerText = document.querySelector("#js-author-text");
    questionText.textContent = quote;
    answerText.textContent = "";
}

function displayAuthor() {
    const answerText = document.querySelector("#js-author-text");
    answerText.textContent = current.author;
}

async function showDog() {
    try {
        const dogResponse = await fetch(dog);

        if (!dogResponse.ok) {
            throw Error(response.statusText);
        }

        const dogJson = await dogResponse.json();
        doggie.message = dogJson["message"];
        var img = document.getElementById("dog");
        img.src = doggie.message;
        img.style.display = "block";
    }
    catch (err) {
        console.log(err);
        alert("Failed to get dog");
    }
    // var sourceOfPicture = "http://img.tesco.com/Groceries/pi/118/5000175411118/IDShot_90x90.jpg";
    // var img = document.getElementById('bigpic')
    // img.src = sourceOfPicture.replace('90x90', '225x225');
    // img.style.display = "block";
}

getQuote();