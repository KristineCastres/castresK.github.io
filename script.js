var nameText = 'Kristine';
var typedName = document.getElementById('typed');
var nameCursor = document.getElementById('cursor');
var nameIndex = 0;
function typeName() {
    if (!typedName || !nameCursor) {
        return;
    }
    if (nameIndex < nameText.length) {
        typedName.textContent += nameText[nameIndex];
        nameIndex++;
        setTimeout(typeName, 150);
    }
    else {
        nameCursor.style.display = 'none';
        setTimeout(typeAspiring, 500);
    }
}
var aspiringText = 'Aspiring ';
var typedAspiring = document.getElementById('aspiring');
var aspiringIndex = 0;
function typeAspiring() {
    if (!typedAspiring) {
        return;
    }
    if (aspiringIndex < aspiringText.length) {
        typedAspiring.textContent += aspiringText[aspiringIndex];
        aspiringIndex++;
        setTimeout(typeAspiring, 100);
    }
    else {
        setTimeout(typeRole, 200);
    }
}
var roles = ['Software Developer', 'Cybersecurity Expert'];
var typedRole = document.getElementById('typed-role');
var roleCursor = document.getElementById('role-cursor');
var roleIndex = 0;
var charIndex = 0;
var isDeleting = false;
function typeRole() {
    if (!typedRole || !roleCursor) {
        return;
    }
    var currentText = roles[roleIndex];
    if (!isDeleting && charIndex <= currentText.length) {
        typedRole.textContent = currentText.substring(0, charIndex);
        charIndex++;
        setTimeout(typeRole, 100);
    }
    else if (isDeleting && charIndex > 0) {
        typedRole.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeRole, 50);
    }
    else if (!isDeleting && charIndex > 0) {
        isDeleting = true;
        setTimeout(typeRole, 1500);
    }
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 500);
    }
}
// Navigation amd Form Handling
document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section');
    var hamburger = document.querySelector('.hamburger');
    var nav = document.querySelector('nav');
    var menuIcon = hamburger === null || hamburger === void 0 ? void 0 : hamburger.querySelector('.menu-icon');
    var closeIcon = hamburger === null || hamburger === void 0 ? void 0 : hamburger.querySelector('.close-icon');
    if (!navLinks.length || !sections.length || !hamburger || !nav || !menuIcon || !closeIcon) {
        return;
    }
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        menuIcon.style.display = hamburger.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = hamburger.classList.contains('active') ? 'block' : 'none';
    });
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionId = link.getAttribute('data-section') + '-section';
            var section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                navLinks.forEach(function (l) { return l.classList.remove('active'); });
                link.classList.add('active');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                    menuIcon.style.display = 'block';
                    closeIcon.style.display = 'none';
                }
            }
        });
    });
    window.addEventListener('scroll', function () {
        var current = '';
        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id').replace('-section', '');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameInput = e.target.querySelector('input[name="name"]');
            var emailInput = e.target.querySelector('input[name="email"]');
            var messageInput = e.target.querySelector('textarea[name="message"]');
            var name = nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim();
            var email = emailInput === null || emailInput === void 0 ? void 0 : emailInput.value.trim();
            var message = messageInput === null || messageInput === void 0 ? void 0 : messageInput.value.trim();
            if (!name || !email || !message) {
                alert('Please fill all fields.');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            alert('Message sent successfully!');
            contactForm.reset();
        });
    }
    typeName();
});
window.addEventListener('unload', function () {
    if (animationFrameId)
        cancelAnimationFrame(animationFrameId);
});
