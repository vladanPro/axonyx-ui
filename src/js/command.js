(() => {
  let activeIndex = -1;

  function openCommand(id) {
    const root = document.getElementById(id);
    if (!root) return;
    root.dataset.open = 'true';
    root.removeAttribute('hidden');

    const input = root.querySelector('[data-ax-command-input]');
    if (input) input.focus();
  }

  function closeCommand(root) {
    if (!root) return;
    root.dataset.open = 'false';
    root.setAttribute('hidden', '');
    activeIndex = -1;
  }

  function filterItems(root, value) {
    const items = Array.from(root.querySelectorAll('[data-ax-command-item]'));
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(value.toLowerCase());
      item.hidden = !match;
    });
    activeIndex = -1;
  }

  function setActive(root, index) {
    const items = Array.from(root.querySelectorAll('[data-ax-command-item]:not([hidden])'));
    items.forEach((item, i) => {
      item.dataset.active = String(i === index);
    });
    activeIndex = index;
  }

  function boot() {
    document.querySelectorAll('.ax-command').forEach((root) => {
      root.setAttribute('hidden', '');

      const input = root.querySelector('[data-ax-command-input]');
      if (input) {
        input.addEventListener('input', (e) => {
          filterItems(root, e.target.value);
        });

        input.addEventListener('keydown', (e) => {
          const items = Array.from(root.querySelectorAll('[data-ax-command-item]:not([hidden])'));

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.min(activeIndex + 1, items.length - 1);
            setActive(root, next);
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = Math.max(activeIndex - 1, 0);
            setActive(root, prev);
          }

          if (e.key === 'Enter') {
            const item = items[activeIndex];
            if (item) item.click();
          }
        });
      }

      root.querySelectorAll('[data-ax-command-close]').forEach((btn) => {
        btn.addEventListener('click', () => closeCommand(root));
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const root = document.querySelector('.ax-command');
        if (root) openCommand(root.id);
      }

      if (e.key === 'Escape') {
        const open = document.querySelector('.ax-command[data-open="true"]');
        if (open) closeCommand(open);
      }
    });
  }

  window.AxonyxCommand = { open: openCommand };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
