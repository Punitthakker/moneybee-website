// Essential-only storage notice. Shown once; dismissal is remembered on this device.
(() => {
  const box = document.querySelector('[data-cookie]'); if (!box) return;
  let seen = false; try { seen = localStorage.getItem('mb-cookie-ok') === '1'; } catch (e) {}
  if (seen) return;
  setTimeout(() => { box.hidden = false; }, 1200);
  box.querySelector('[data-cookie-ok]').addEventListener('click', () => { box.hidden = true; try { localStorage.setItem('mb-cookie-ok', '1'); } catch (e) {} });
})();
