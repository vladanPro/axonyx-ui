(() => {
  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    dialog.dataset.open = 'true';
    dialog.removeAttribute('hidden');
    document.documentElement.dataset.dialogOpen = 'true';

    const closeButton = dialog.querySelector('[data-ax-dialog-close]');
    if (closeButton && closeButton.focus) closeButton.focus();
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    dialog.dataset.open = 'false';
    dialog.setAttribute('hidden', '');
    delete document.documentElement.dataset.dialogOpen;
  }

  function boot() {
    document.querySelectorAll('.ax-dialog').forEach((dialog) => {
      if (dialog.dataset.open !== 'true') {
        dialog.setAttribute('hidden', '');
      }

      dialog.querySelectorAll('[data-ax-dialog-close]').forEach((trigger) => {
        trigger.addEventListener('click', () => closeDialog(dialog));
      });
    });

    document.querySelectorAll('[data-ax-dialog-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const id = trigger.getAttribute('data-ax-dialog-open');
        if (id) openDialog(id);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = document.querySelector('.ax-dialog[data-open="true"]');
      if (open) closeDialog(open);
    });
  }

  window.AxonyxDialog = { open: openDialog };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
