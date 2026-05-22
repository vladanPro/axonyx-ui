(() => {
  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.dataset.open = 'false';
    drawer.setAttribute('aria-hidden', 'true');
  }

  function boot() {
    document.querySelectorAll('.ax-drawer').forEach((drawer) => {
      if (drawer.dataset.open !== 'true') {
        closeDrawer(drawer);
      } else {
        drawer.removeAttribute('aria-hidden');
      }

      drawer.querySelectorAll('[data-ax-drawer-close]').forEach((trigger) => {
        trigger.addEventListener('click', () => closeDrawer(drawer));
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = document.querySelector('.ax-drawer[data-open="true"]');
      if (open) closeDrawer(open);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
