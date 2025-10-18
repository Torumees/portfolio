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

// --- Navbar Weather pill ---
// Kasutab brauseri geolokatsiooni (HTTPS või localhost),
// toob jooksvad näitajad Open-Meteost (°C, m/s) ja koha nime Nominatimist.
(function () {
  const el = document.getElementById("nav-weather");
  if (!el) return;

  function setStatus(msg) {
    el.textContent = msg;
  }

  async function loadOnce() {
    try {
      setStatus("Laen ilma…");

      if (!("geolocation" in navigator)) {
        setStatus("Geolokatsioon puudub");
        return;
      }

      // Võta kasutaja koordinaadid
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 5 * 60 * 1000, // kasuta kuni 5 min vana positsiooni
        })
      );

      const { latitude, longitude } = pos.coords;

      // Lae ilm + kohanimi paralleelselt
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
        `&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;

      const reverseUrl =
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
        `&lat=${latitude}&lon=${longitude}`;

      const [wRes, gRes] = await Promise.all([fetch(weatherUrl), fetch(reverseUrl)]);
      if (!wRes.ok) throw new Error("Weather HTTP " + wRes.status);
      if (!gRes.ok) throw new Error("Geo HTTP " + gRes.status);

      const w = await wRes.json();
      const g = await gRes.json();

      const temp = typeof w.current?.temperature_2m === "number" ? Math.round(w.current.temperature_2m) : "–";
      const wind = typeof w.current?.wind_speed_10m === "number" ? w.current.wind_speed_10m.toFixed(1) : "–";

      const addr = g.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        addr.state ||
        "Teadmata";
      const cc = (addr.country_code || "").toUpperCase();

      el.textContent = `📍${city}${cc ? ", " + cc : ""} • ${temp}°C • ${wind} m/s`;
    } catch (e) {
      setStatus("Ilma laadimine ebaõnnestus");
      // Vajadusel lisa nupp "Proovi uuesti"
    }
  }

  // Lae kohe ja värskenda iga 10 minuti järel
  loadOnce();
  setInterval(loadOnce, 10 * 60 * 1000);
})();