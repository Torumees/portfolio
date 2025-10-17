// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if(navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
    });
}

// Footer year
document.getElementById('year').textContent - new Date().getFullYear();

// Contact "submit"
function handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('msg').value.trim();
    const status = document.getElementById('form-status');

    if(!name || !email || !msg) {
        status.textContent = 'Palun täida kõik väljad.';
        return false;
    }

    // Siin võiks hiljem lisada päris backend/Email API (nt Formspree või oma API)
    status.textContent = 'Aitäh, sõnum justkui saadetud (demo)!';
    e.target.reset();
    return false;
}