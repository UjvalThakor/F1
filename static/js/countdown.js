/**
 * MAX VERSTAPPEN — NEXT RACE PRECISION COUNTDOWN
 * Live second-by-second digital telemetry timer (Days:Hours:Minutes:Seconds)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Digital Clock (Exact reference format: DD:HH:MM:SS)
  const heroClockEl = document.getElementById('heroDigitalClock');
  const heroClockText = document.getElementById('heroClockText');

  // 2. HUD Clock Units
  const hudClockContainer = document.getElementById('raceCountdownClock');
  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');
  const elStatus = document.getElementById('cdStatusLabel');

  const targetDateStr = (heroClockEl && heroClockEl.getAttribute('data-target')) ||
                        (hudClockContainer && hudClockContainer.getAttribute('data-target'));

  if (!targetDateStr) return;

  const targetTime = new Date(targetDateStr).getTime();

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      if (heroClockText) heroClockText.textContent = '00:00:00:00';
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      if (elStatus) elStatus.textContent = 'RACE IN PROGRESS / COMPLETED';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const sDays = String(days).padStart(2, '0');
    const sHours = String(hours).padStart(2, '0');
    const sMinutes = String(minutes).padStart(2, '0');
    const sSeconds = String(seconds).padStart(2, '0');

    // Update Hero Clock (DD:HH:MM:SS)
    if (heroClockText) {
      heroClockText.textContent = `${sDays}:${sHours}:${sMinutes}:${sSeconds}`;
    }

    // Update HUD Clock units
    if (elDays) elDays.textContent = sDays;
    if (elHours) elHours.textContent = sHours;
    if (elMinutes) elMinutes.textContent = sMinutes;
    if (elSeconds) elSeconds.textContent = sSeconds;
  }

  updateClock();
  setInterval(updateClock, 1000);
});
