document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Animate skills bars on scroll
const skills = document.querySelectorAll('.progress');
const animateSkills = () => {
    skills.forEach(skill => {
        const rect = skill.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 50) {
            skill.style.width = skill.getAttribute('data-width');
        }
    });
};

// Set initial widths to 0 and store actual widths
skills.forEach(skill => {
    skill.setAttribute('data-width', skill.style.width);
    skill.style.width = '0%';
});

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

// Form submission handling
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! I\'ll get back to you soon.');
    e.target.reset();
});

// Sticky nav effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255, 255, 255, 1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Certificate image click handler
document.querySelectorAll('.certificate-image img').forEach(img => {
    img.addEventListener('click', () => {
        const fullScreenDiv = document.createElement('div');
        fullScreenDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        `;

        fullScreenDiv.appendChild(fullImg);
        document.body.appendChild(fullScreenDiv);

        fullScreenDiv.addEventListener('click', () => {
            document.body.removeChild(fullScreenDiv);
        });
    });
});

// Certificate and Resume image click handler
document.querySelectorAll('.certificate-image img, .resume-image img').forEach(img => {
    img.addEventListener('click', () => {
        const fullScreenDiv = document.createElement('div');
        fullScreenDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;

        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        `;

        fullScreenDiv.appendChild(fullImg);
        document.body.appendChild(fullScreenDiv);

        fullScreenDiv.addEventListener('click', () => {
            document.body.removeChild(fullScreenDiv);
        });
    });
});

