const nameText = 'Kristine';
const typedName = document.getElementById('typed');
const nameCursor = document.getElementById('cursor');
let nameIndex = 0;

function typeName() {
    if (!typedName || !nameCursor) {
        return;
    }
    if (nameIndex < nameText.length) {
        typedName.textContent += nameText[nameIndex];
        nameIndex++;
        setTimeout(typeName, 150);
    } else {
        nameCursor.style.display = 'none';
        setTimeout(typeAspiring, 500);
    }
}

const aspiringText = 'Aspiring ';
const typedAspiring = document.getElementById('aspiring');
let aspiringIndex = 0;

function typeAspiring() {
    if (!typedAspiring) {
        return;
    }
    if (aspiringIndex < aspiringText.length) {
        typedAspiring.textContent += aspiringText[aspiringIndex];
        aspiringIndex++;
        setTimeout(typeAspiring, 100);
    } else {
        setTimeout(typeRole, 200);
    }
}

const roles = ['Software Developer', 'Cybersecurity Expert'];
const typedRole = document.getElementById('typed-role');
const roleCursor = document.getElementById('role-cursor');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    if (!typedRole || !roleCursor) {
        return;
    }
    const currentText = roles[roleIndex];
    if (!isDeleting && charIndex <= currentText.length) {
        typedRole.textContent = currentText.substring(0, charIndex);
        charIndex++;
        setTimeout(typeRole, 100);
    } else if (isDeleting && charIndex > 0) {
        typedRole.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeRole, 50);
    } else if (!isDeleting && charIndex > 0) {
        isDeleting = true;
        setTimeout(typeRole, 1500);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 500);
    }
}

// Navigation, Form Handling, and Game Logic
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const menuIcon = hamburger?.querySelector('.menu-icon');
    const closeIcon = hamburger?.querySelector('.close-icon');

    if (!navLinks.length || !sections.length || !hamburger || !nav || !menuIcon || !closeIcon) {
        return;
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        menuIcon.style.display = hamburger.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = hamburger.classList.contains('active') ? 'block' : 'none';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section') + '-section';
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
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

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
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

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = e.target.querySelector('input[name="name"]');
            const emailInput = e.target.querySelector('input[name="email"]');
            const messageInput = e.target.querySelector('textarea[name="message"]');
            const name = nameInput?.value.trim();
            const email = emailInput?.value.trim();
            const message = messageInput?.value.trim();

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

    // Runner Game Logic
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas?.getContext('2d');
    let score = 0;
    const scoreDisplay = document.getElementById('game-score');
    let animationFrameId = null;

    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 400;
    const groundHeight = canvas.height - 100; 

    if (!canvas || !ctx || !scoreDisplay) {
        return;
    }

    // Load player image
    const playerImage = new Image();
    playerImage.src = 'images/melody.gif';
    let playerImageLoaded = false;
    playerImage.onload = () => {
        playerImageLoaded = true;
    };

    // Load background image
    const backgroundImage = new Image();
    backgroundImage.src = 'images/kk.jpg';
    let backgroundImageLoaded = false;
    backgroundImage.onload = () => {
        backgroundImageLoaded = true;
    };

    // Load obstacle image
    const obstacleImage = new Image();
    obstacleImage.src = 'images/obstacle.jpg';
    let obstacleImageLoaded = false;
    obstacleImage.onload = () => {
        obstacleImageLoaded = true;
    };

    // Load game over image
    const gameOverImage = new Image();
    gameOverImage.src = 'images/gameover.jpg';
    let gameOverImageLoaded = false;
    gameOverImage.onload = () => {
        gameOverImageLoaded = true;
    };

    // Player
    const player = {
        x: 50,
        y: groundHeight,
        width: 70,
        height: 70,
        velocityY: 0,
        jumping: false,
        gravity: 0.8,
        jumpStrength: 20
    };

    const obstacles = [];
    let gameSpeed = 2;
    let gameOver = false;

    class PlayerDrone {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = player.width;
            this.height = player.height;
        }

        draw() {
            if (playerImageLoaded) {
                ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = '#F4A7A7';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }

    class FirewallObstacle {
        constructor() {
            this.width = 70;
            this.height = 70;
            this.x = canvas.width;
            this.y = canvas.height - this.height; 
        }

        draw() {
            if (obstacleImageLoaded) {
                ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = '#FF69B4';
                ctx.fillRect(this.x, this.y, this.width, this.height);

                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let i = 1; i < 4; i++) {
                    ctx.moveTo(this.x + (this.width / 4) * i, this.y);
                    ctx.lineTo(this.x + (this.width / 4) * i, this.y + this.height);
                    ctx.moveTo(this.x, this.y + (this.height / 4) * i);
                    ctx.lineTo(this.x + this.width, this.y + (this.height / 4) * i);
                }
                ctx.stroke();
            }
        }

        update() {
            this.x -= gameSpeed;
        }
    }

    function spawnObstacle() {
        if (gameOver) {
            return;
        }
        obstacles.push(new FirewallObstacle());
        const minDelay = 1000;
        const maxDelay = 2500;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        setTimeout(spawnObstacle, delay);
    }

    function handleInput(e) {
        if ((e.type === 'keydown' && e.code === 'Space') || e.type === 'click') {
            e.preventDefault();
            if (gameOver) {
                score = 0;
                scoreDisplay.textContent = score;
                obstacles.length = 0;
                player.y = groundHeight;
                player.velocityY = 0;
                player.jumping = false;
                gameSpeed = 2;
                gameOver = false;
                spawnObstacle();
                gameLoop();
            } else if (!player.jumping) {
                player.velocityY = -player.jumpStrength;
                player.jumping = true;
            }
        }
    }

    function checkCollision(player, obstacle) {
        const playerBox = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height
        };
        const obstacleBox = {
            x: obstacle.x,
            y: obstacle.y,
            width: obstacle.width,
            height: obstacle.height
        };
        return (
            playerBox.x < obstacleBox.x + obstacleBox.width &&
            playerBox.x + playerBox.width > obstacleBox.x &&
            playerBox.y < obstacleBox.y + obstacleBox.height &&
            playerBox.y + playerBox.height > obstacleBox.y
        );
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (backgroundImageLoaded) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#1C2526';
            ctx.fillRect(0, 0, canvas.width, 100);
            ctx.fillStyle = '#2A3435';
            ctx.fillRect(0, 100, canvas.width, canvas.height - 100);
        }

        // Update and draw player
        const drone = new PlayerDrone(player.x, player.y);
        if (!gameOver) {
            player.velocityY += player.gravity;
            player.y += player.velocityY;
            if (player.y > groundHeight) {
                player.y = groundHeight;
                player.velocityY = 0;
                player.jumping = false;
            }
            if (player.y < 0) {
                player.y = 0;
                player.velocityY = 0;
            }
        }
        drone.draw();

        // Update and draw obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.update();
            obstacle.draw();
            if (checkCollision(player, obstacle)) {
                gameOver = true;
            }
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score += 10;
                scoreDisplay.textContent = score;
                gameSpeed += 0.1;
            }
        });

        // Draw score and game over image
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Poppins';
        ctx.fillText(`Score: ${score}`, 10, 30);
        if (gameOver) {
            if (gameOverImageLoaded) {
                const imgWidth = gameOverImage.width;
                const imgHeight = gameOverImage.height;
                const x = (canvas.width - imgWidth) / 2;
                const y = (canvas.height - imgHeight) / 2;
                ctx.drawImage(gameOverImage, 150, 50, 300, 300 );
            } else {
                ctx.font = '40px Poppins';
                ctx.fillStyle = '#FF69B4';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
                ctx.font = '20px Poppins';
                ctx.fillText('Press Space or Click to Restart', canvas.width / 2, canvas.height / 2 + 40);
                ctx.textAlign = 'start';
            }
        } else {
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }

    // Initialize Game
    document.addEventListener('keydown', handleInput);
    canvas.addEventListener('click', handleInput);
    spawnObstacle();
    gameLoop();
});

window.addEventListener('unload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});