//stores hamburger button and nav menu from mobile view
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

//function to toggle the nav menu
function toggleMenu() {
    //stores current state of navMenu before click (if open or closed)
    const isOpen = navMenu.classList.contains('show');
    //toggles btwn .nav-menu to .nav-menu.show to show/hide
    navMenu.classList.toggle('show');
    //updates the aria-expanded attribute
    navToggle.setAttribute('aria-expanded', !isOpen);
}

//when hamburger is clicked, toggleMenu runs
navToggle.addEventListener('click', toggleMenu);

//if key press is Enter or Space bar on hamburger
navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        //preventDefault stops space bar from default action (scrolling down)
        e.preventDefault();
        //activate toggle menu
        toggleMenu();
    }
});

//if click is inside of navbar
document.addEventListener('click', (e) => {
    const isClickInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);

    //if click is not inside nav and nav menu conttains show (is open), it closes menu
    if (!isClickInsideNav && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

//selects all links in nav menu
const navLinks = document.querySelectorAll('.nav-menu a');
//for each link when clicked it closes nav menu
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

//window resizing (mobile view)
window.addEventListener('resize', () => {
    //is screen is wider than 768px (desktop)
    if (window.innerWidth > 768) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

//aria-expanded initially set to false
navToggle.setAttribute('aria-expanded', 'false');

//class search
const searchInput = document.querySelector('#classSearch');
const classItems = document.querySelectorAll('.class-item');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        //filters per lowercase input
        classItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'list-item' : 'none';
        });
    });
}

//dropdown menus for classes
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    // on click expand content
    toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        const isOpen = content.classList.contains('open');

        // close all dropdowns first
        document.querySelectorAll('.dropdown-content').forEach(c => c.classList.remove('open'));

        // toggle the clicked one
        if (!isOpen) {
            content.classList.add('open');
        }
    });
});

classItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('expanded');
    });
});

// add study groups
const addGroupForm = document.querySelector('#addGroupForm');
const studyGroupsList = document.querySelector('#studyGroupsList');
addGroupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent page reload

    const groupName = document.querySelector('#groupName').value.trim();
    const groupClass = document.querySelector('#groupClass').value.trim();
    const groupDate = document.querySelector('#groupDate').value;

    //create list element per input
    if (groupName && groupClass) {
        const li = document.createElement('li');
        li.classList.add('study-group-item');

        const [year, month, day] = groupDate.split('-');
        const localDate = new Date(year, month - 1, day); 
        const formattedDate = localDate.toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });


        li.textContent = `${groupName} - ${groupClass} \@ ${formattedDate}`;
        studyGroupsList.appendChild(li);

        // reset form
        addGroupForm.reset();
    }
});

