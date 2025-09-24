var box1 = document.querySelector('#one').addEventListener('click', message);

var box2 = document.querySelector('#two').addEventListener('mouseover', message);

function message() {
    alert('This is a message');
}