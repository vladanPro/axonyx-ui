(() => {
  function initTabs(root) {
    const tabs = Array.from(root.querySelectorAll(':scope > .ax-tab'));
    if (tabs.length === 0) return;

    const defaultValue = root.dataset.defaultValue || tabs[0].dataset.value || '';

    const list = document.createElement('div');
    list.className = 'ax-tabs__list';
    list.setAttribute('role', 'tablist');

    tabs.forEach((tab, index) => {
      const value = tab.dataset.value || String(index);
      const label = tab.querySelector(':scope > .ax-tab__label');
      const panel = tab.querySelector(':scope > .ax-tab__panel');
      if (!label || !panel) return;

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'ax-tabs__trigger';
      trigger.dataset.value = value;
      trigger.setAttribute('role', 'tab');
      trigger.textContent = label.textContent || value;

      label.hidden = true;
      panel.setAttribute('role', 'tabpanel');
      panel.dataset.value = value;

      trigger.addEventListener('click', () => setActiveTab(root, value));
      list.appendChild(trigger);
    });

    root.prepend(list);
    setActiveTab(root, defaultValue);
  }

  function setActiveTab(root, value) {
    const triggers = Array.from(root.querySelectorAll(':scope > .ax-tabs__list > .ax-tabs__trigger'));
    const tabs = Array.from(root.querySelectorAll(':scope > .ax-tab'));

    triggers.forEach((trigger) => {
      const active = trigger.dataset.value === value;
      trigger.dataset.active = String(active);
      trigger.setAttribute('aria-selected', String(active));
    });

    tabs.forEach((tab) => {
      const active = tab.dataset.value === value;
      tab.dataset.active = String(active);
      const panel = tab.querySelector(':scope > .ax-tab__panel');
      if (panel) panel.hidden = !active;
    });
  }

  function boot() {
    document.querySelectorAll('.ax-tabs').forEach(initTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
