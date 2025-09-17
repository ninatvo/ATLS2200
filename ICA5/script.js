let info = false;

const expandBtn = document.querySelector('.expand-btn');
const details = document.querySelector('.card-content');

expandBtn.addEventListener('click', showInfo);

function showInfo(){
    if(!info){
        details.style.display = 'block';
        expandBtn.textContent = '-';
        expandBtn.setAttribute('aria-label', 'Collapse card')
        info = true;
    }
    else {
        details.style.display = 'none';
        expandBtn.textContent = '+';
        expandBtn.setAttribute('aria-label', 'Expand card')
        info = false;
    }
}