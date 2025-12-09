// custom cursor element
const cursor = document.querySelector(".cursor");
// if device is touchscreen
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
// if user has reduced motion enabled, less animations
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

// custom cursor only applied if user is not on touchscreen device && does not prefer reduced motion
if (!isTouchDevice && !prefersReducedMotion && cursor) {
    // show custom circular cursor
    cursor.style.display = "block";

    // inject CSS to hide the default cursor
    const style = document.createElement("style");
    style.textContent = `
        * {
          cursor: none !important;
        }
      `;
    document.head.appendChild(style);

    // position cursor div to cursor position
    document.addEventListener("mousemove", (e) => {
        let x = e.clientX; // horizontal
        let y = e.clientY; // vertical
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
    });

    // 'click' class to cursor on mousedown and remove on mouseup
    document.addEventListener("mousedown", (e) => {
        cursor.classList.remove("pressable"); // makes cursor bigger
        cursor.classList.add("click");
    });
    document.addEventListener("mouseup", (e) => {
        cursor.classList.remove("click");
        // re-add pressable if still hovering over an interactive element
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        if (hoveredElement && hoveredElement.closest("a, button, .project-card, .skill-card")) {
            cursor.classList.add("pressable");
        }
    });
    // add 'pressable' class to cursor when hovering certain elements
    const items = document.querySelectorAll("a, button, .project-card, .skill-card");
    items.forEach((item) => {
        item.addEventListener("mouseover", () => {
            cursor.classList.add("pressable");
        });
        item.addEventListener("mouseleave", () => {
            cursor.classList.remove("pressable");
        });
    });
}

// smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // stop default jumping to section
        const href = this.getAttribute('href');
        
        // home link bug
        if (href === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        // find element with id matching href to scroll to
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// scroll reveal animation
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    // loop thru each element with class "reveal"
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top; // dist from top of element to top of viewport
        const elementVisible = 150; // threshold

        // if element is within threshold of entering viewport, add animation
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // initial check