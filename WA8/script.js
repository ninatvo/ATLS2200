//stores hamburger button and nav menu from mobile view
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// only runs for navToggle and navMenu
if (navToggle && navMenu) {
    // function to toggle the nav menu
    function toggleMenu() {
        //stores current state of navMenu before click (if open or closed)
        const isOpen = navMenu.classList.contains('show');
        //toggles btwn .nav-menu to .nav-menu.show to show/hide
        navMenu.classList.toggle('show');
        //updates the aria-expanded attribute
        navToggle.setAttribute('aria-expanded', !isOpen);
    }

    // when hamburger is clicked, toggleMenu runs
    navToggle.addEventListener('click', toggleMenu);

    // if key press is Enter or Space on hamburger, toggleMenu
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            // preventDefault stops space bar from default action (scrolling down on Space)
            e.preventDefault();
            toggleMenu();
        }
    });

    // if click is inside navbar
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navToggle.contains(e.target) || navMenu.contains(e.target);
        // if click is not inside nav and nav menu contains 'show' (is open) it closes menu + updates metadata
        if (!isClickInsideNav && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // selects all links in nav menu
    const navLinks = document.querySelectorAll('.nav-menu a');
    // for each linked when clicked it closes nav menu + updates metadata
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // window resizing (mobile view)
    window.addEventListener('resize', () => {
        // if screen is wider than 768px 
        if (window.innerWidth > 768) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // aria-expanded initially set to false
    navToggle.setAttribute('aria-expanded', 'false');
}

// class search
const searchInput = document.querySelector('#classSearch');
const classItems = document.querySelectorAll('.class-item');

if (searchInput && classItems.length > 0) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        // filters per lowercase input
        classItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'list-item' : 'none';
        });
    });
}

// dropdown menus for classes
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        // on click expand content
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

// expandable class items
classItems.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('expanded');
    });
});

// add study groups
const addGroupForm = document.querySelector('#addGroupForm');
const studyGroupsList = document.querySelector('#studyGroupsList');
// storage key in localStorage to save study groups
const STORAGE_KEY = "studyGroups";

// only runs for addGroupsForm and studyGroupsList
if (addGroupForm && studyGroupsList) {
    function loadGroups() {
        // returns saved local database
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return []; // nothing initially
        try {
            return JSON.parse(saved); // convert JSON into array
        } catch (e) {
            console.error("Corrupt data in localStorage", e);
            return [];
        }
    }

    // turns study groups array into JSON to store in STORAGE_KEY
    function saveGroups(groups) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    }

    function renderGroupList(groups) {
        studyGroupsList.innerHTML = ""; // clear list first
        // loops through study group array to render all groups
        groups.forEach((group, index) => renderGroup(group, index));
    }

    // adding a group
    function renderGroup(group, index) {
        // create new list item
        const li = document.createElement('li');
        li.classList.add('study-group-item');

        // create new text
        const text = document.createElement('span');
        text.textContent = `${group.name} - ${group.class} @ ${group.location}, ${group.date} `;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = "x";
        removeBtn.classList.add('remove-btn');

        // when clicked, remove this group
        removeBtn.addEventListener('click', () => {
            let groups = loadGroups(); // get current array
            groups.splice(index, 1); // remove clicked group
            saveGroups(groups); // save update
            renderGroupList(groups); // refresh list
        });

        li.appendChild(text); // add text to list
        li.appendChild(removeBtn); // add button at end
        studyGroupsList.appendChild(li); // append li to ul
    }

    // load and render when page opens
    const groups = loadGroups();
    renderGroupList(groups);


    addGroupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // prevent page reload

        const groupName = document.querySelector('#groupName').value.trim();
        const groupClass = document.querySelector('#groupClass').value.trim();
        const groupLocation = document.querySelector('#groupLocation').value.trim();
        const groupDate = document.querySelector('#groupDate').value;

        //create list element per input
        if (groupName && groupClass && groupLocation && groupDate) {
            const [year, month, day] = groupDate.split('-');
            const localDate = new Date(year, month - 1, day);
            const formattedDate = localDate.toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const newGroup = { name: groupName, class: groupClass, location: groupLocation, date: formattedDate };

            const groups = loadGroups(); // get current groups
            groups.push(newGroup); // add the new group
            saveGroups(groups); // save to STORAGE_KEY

            renderGroupList(groups); // update list
            addGroupForm.reset(); // clear form
        }
    });
}

// profile
// string for localStorage that stores profile info
const PROFILE_KEY = "userProfile";

// grabbing form/input ids
const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const majorInput = document.getElementById("majorInput");
const aboutInput = document.getElementById("aboutInput");

// grabbing elements that will show up on profile-info
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayMajor = document.getElementById("displayMajor");
const displayAbout = document.getElementById("displayAbout");

// clear button
const clearBtn = document.getElementById("clearProfile");

// only runs on Profile page
if (profileForm && nameInput && emailInput && majorInput && aboutInput &&
    displayName && displayEmail && displayMajor && displayAbout && clearBtn) {

    // function to update the display
    function updateDisplay(data) {
        // setting text content to data with fallback info
        displayName.textContent = data.name || "Guest";
        displayEmail.textContent = data.email || "guest@example.com";
        displayMajor.textContent = data.major || "—";
        displayAbout.textContent = data.about || "No bio yet.";
    }

    // function to load saved profile
    function loadProfile() {
        // reads raw profile JSON string from localStorage
        const saved = localStorage.getItem(PROFILE_KEY);
        if (saved) { // if saaved key exists
            try {
                const data = JSON.parse(saved);
                // populate info
                nameInput.value = data.name || "";
                emailInput.value = data.email || "";
                majorInput.value = data.major || "";
                aboutInput.value = data.about || "";
                // update display
                updateDisplay(data);
            } catch (e) {
                console.error("Error loading profile:", e);
            }
        }
    }

    // when user hits "submit"
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent page reload

        const profileData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            major: majorInput.value.trim(),
            about: aboutInput.value.trim()
        };

        if (confirm("Are you sure you want to save this data? All data is stored locally in your browser. We only use this data to display on your profile, and you can completely clear it at any time!")) {
            // save to localStorage
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));

            // update display
            updateDisplay(profileData);

        }

    });

    // clear button
    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your profile?")) {
            localStorage.removeItem(PROFILE_KEY); // remove from localStorage
            profileForm.reset(); // clears fields
            updateDisplay({}); // set to nothing
        }
    });

    // load profile when page loads
    loadProfile();
}