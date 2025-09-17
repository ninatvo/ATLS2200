let info = false;

const expandBtn = document.querySelector('.expand-btn');
const details = document.querySelector('.card-content');

expandBtn.addEventListener('click', showInfo);

function showInfo(){
    if(!info){
        details.style.display = 'block';
        info = true;
    }
    else {
        details.style.display = 'none';
        info = false;
    }
}