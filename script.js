const nameText = 'Kristine';
const typedNameElement = document.getElementById('typed');
const nameCursorElement = document.getElementById('cursor');
let nameIndex = 0;

function typeName() {
    if (nameIndex < nameText.length) {
        typedNameElement.textContent += nameText.charAt(nameIndex);
        nameIndex++;
        setTimeout(typeName, 150);
    } else {
        nameCursorElement.style.display = 'none';
        setTimeout(startAspiring, 500);
    }
}

const aspiringText = 'Aspiring ';
const typedAspiringElement = document.getElementById('aspiring');
let aspiringIndex = 0;

function startAspiring() {
    if (aspiringIndex < aspiringText.length) {
        typedAspiringElement.textContent += aspiringText.charAt(aspiringIndex);
        aspiringIndex++;
        setTimeout(startAspiring, 100);
    } else {
        setTimeout(startRoleTyping, 200);
    }
}

const roles = ['Software Developer', 'Cyber Security'];
const typedRoleElement = document.getElementById('typed-role');
const roleCursorElement = document.getElementById('role-cursor');
let charIndex = 0;
let currentRole = 0;
let isDeleting = false;

function startRoleTyping() {
    typedRoleElement.textContent = '';
    roleCursorElement.style.display = 'inline';
    typeRole();
}

function typeRole() {
    const text = roles[currentRole];

    if (!isDeleting && charIndex < text.length) {
        typedRoleElement.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeRole, 100);
    } else if (isDeleting && charIndex > 0) {
        typedRoleElement.textContent = text.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeRole, 50);
    } else if (!isDeleting && charIndex === text.length) {
        isDeleting = true;
        setTimeout(typeRole, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentRole = (currentRole + 1) % roles.length;
        setTimeout(typeRole, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section') + '-section';
            const section = document.getElementById(sectionId);
            section.scrollIntoView({ behavior: 'smooth' });

            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', false);
            }

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
        }
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id').replace('-section', '');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    const homeLink = document.querySelector('.nav-link[data-section="home"]');
    homeLink.classList.add('active');
    
    hamburger.setAttribute('aria-expanded', false);
});

window.onload = typeName;