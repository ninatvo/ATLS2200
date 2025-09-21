const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function toggleMenu() {
    const isOpen = navMenu.classList.contains('show');
    navMenu.classList.toggle('show');

    navToggle.setAttribute('aria-expanded', !isOpen);

    navToggle.classList.toggle('active');
}

navToggle.addEventListener('click', toggleMenu);

navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

document.addEventListener('click', (e) => {
    const isClickInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);

    if (!isClickInsideNav && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

navToggle.setAttribute('aria-expanded', 'false');