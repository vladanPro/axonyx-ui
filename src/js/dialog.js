(() => {
  const previousFocus = new WeakMap();

  function focusableElements(dialog) {
    return Array.from(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute('hidden'));
  }

  function openDialog(id, trigger) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    previousFocus.set(dialog, trigger || document.activeElement);
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
    const trigger = previousFocus.get(dialog);
    if (trigger && trigger.focus) trigger.focus();
    previousFocus.delete(dialog);
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
        if (id) openDialog(id, trigger);
      });
    });

    document.addEventListener('keydown', (event) => {
      const open = document.querySelector('.ax-dialog[data-open="true"]');
      if (!open) return;

      if (event.key === 'Escape') {
        closeDialog(open);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = focusableElements(open);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  window.AxonyxDialog = { open: openDialog };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
