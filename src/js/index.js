(() => {
  if (window.__axonyxUiRuntime) return;
  window.__axonyxUiRuntime = true;

  const allowedThemes = new Set(['silver', 'bronze', 'gold']);

  function bootThemes() {
    const applyTheme = (theme) => {
      const next = allowedThemes.has(theme) ? theme : 'silver';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    };

    document.querySelectorAll('[data-ax-behavior="theme"]').forEach((control) => {
      const storageKey = control.getAttribute('data-ax-theme-storage-key') || 'axonyx-theme';
      const stored = window.localStorage ? window.localStorage.getItem(storageKey) : null;
      const current = document.documentElement.getAttribute('data-theme');
      const initial = applyTheme(stored || current || control.value || 'silver');
      control.value = initial;

      control.addEventListener('change', () => {
        const next = applyTheme(control.value);
        if (window.localStorage) window.localStorage.setItem(storageKey, next);
      });
    });
  }

  function bootAccordions() {
    document.querySelectorAll('.ax-accordion').forEach((accordion) => {
      accordion.querySelectorAll('.ax-accordion__trigger').forEach((trigger) => {
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');

        const toggle = () => {
          const item = trigger.closest('.ax-accordion__item');
          if (!item) return;
          const open = item.dataset.open === 'true' || item.dataset.open === 'open';

          if (accordion.dataset.single === 'true') {
            accordion.querySelectorAll('.ax-accordion__item').forEach((sibling) => {
              if (sibling !== item) sibling.dataset.open = 'false';
            });
          }

          item.dataset.open = open ? 'false' : 'true';
        };

        trigger.addEventListener('click', toggle);
        trigger.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          toggle();
        });
      });
    });
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

  function initTabs(root) {
    if (root.dataset.axTabsReady === 'true') return;
    root.dataset.axTabsReady = 'true';

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

  function bootTabs() {
    document.querySelectorAll('.ax-tabs').forEach(initTabs);
  }

  function closeFloatingSurfaces(except) {
    document.querySelectorAll('.ax-dropdown, .ax-popover').forEach((root) => {
      if (except && root === except) return;
      root.dataset.open = 'false';
    });
  }

  function bootFloatingSurfaces() {
    document.querySelectorAll('.ax-dropdown, .ax-popover').forEach((root) => {
      const trigger = root.querySelector('.ax-dropdown__trigger, .ax-popover__trigger, .ax-popover > button, [slot="trigger"]');
      if (!trigger) return;

      root.dataset.open = root.dataset.open === 'true' ? 'true' : 'false';
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const open = root.dataset.open === 'true';
        closeFloatingSurfaces(root);
        root.dataset.open = open ? 'false' : 'true';
      });
    });

    document.addEventListener('click', () => closeFloatingSurfaces());
  }

  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.dataset.open = 'false';
    drawer.setAttribute('aria-hidden', 'true');
  }

  function openDrawer(drawer) {
    if (!drawer) return;
    drawer.dataset.open = 'true';
    drawer.removeAttribute('aria-hidden');
  }

  function bootDrawers() {
    document.querySelectorAll('.ax-drawer').forEach((drawer) => {
      if (drawer.dataset.open !== 'true') {
        closeDrawer(drawer);
      } else {
        drawer.removeAttribute('aria-hidden');
      }

      drawer.querySelectorAll('[data-ax-drawer-close], .ax-drawer__backdrop').forEach((trigger) => {
        trigger.addEventListener('click', () => closeDrawer(drawer));
      });
    });

    document.querySelectorAll('[data-ax-drawer-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const selector = trigger.getAttribute('data-ax-drawer-open');
        if (!selector) return;
        openDrawer(document.querySelector(selector));
      });
    });
  }

  function setMachineSwitchState(control, nextState) {
    const isOn = nextState === 'on';
    const offPad = control.querySelector('.ax-machine-switch__pad[data-tone="danger"]');
    const onPad = control.querySelector('.ax-machine-switch__pad[data-tone="success"]');
    const stateLabel = control.querySelector('.ax-machine-switch__label[data-state]');
    const onLabel = control.dataset.onLabel || 'Online';
    const offLabel = control.dataset.offLabel || 'Offline';

    control.dataset.state = isOn ? 'on' : 'off';
    control.setAttribute('aria-pressed', String(isOn));
    if (offPad) offPad.dataset.active = String(!isOn);
    if (onPad) onPad.dataset.active = String(isOn);
    if (stateLabel) stateLabel.textContent = isOn ? onLabel : offLabel;
  }

  function bootMachineSwitches() {
    document.querySelectorAll('[data-ax-behavior="machine-switch"]').forEach((control) => {
      if (control.dataset.axMachineSwitchReady === 'true') return;
      control.dataset.axMachineSwitchReady = 'true';

      const initial = control.dataset.state === 'on' || control.getAttribute('aria-pressed') === 'true' ? 'on' : 'off';
      setMachineSwitchState(control, initial);

      control.addEventListener('click', () => {
        if (control.disabled || control.getAttribute('aria-disabled') === 'true') return;
        setMachineSwitchState(control, control.dataset.state === 'on' ? 'off' : 'on');
      });
    });
  }

  function bootSliders() {
    document.querySelectorAll('[data-ax-behavior="slider"]').forEach((input) => {
      if (input.dataset.axSliderReady === 'true') return;
      input.dataset.axSliderReady = 'true';

      const root = input.closest('.ax-slider');
      const valueTarget = root ? root.querySelector('[data-ax-slider-value="true"]') : null;
      const sync = () => {
        if (valueTarget) valueTarget.textContent = input.value;
        input.setAttribute('aria-valuenow', input.value);
      };

      input.addEventListener('input', sync);
      input.addEventListener('change', sync);
      sync();
    });
  }

  function bootToasts() {
    document.querySelectorAll('.ax-toast').forEach((toast) => {
      if (toast.dataset.axToastReady === 'true') return;
      toast.dataset.axToastReady = 'true';

      toast.querySelectorAll('[data-ax-toast-close], .ax-toast__close').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          toast.dataset.open = 'false';
          toast.setAttribute('hidden', '');
          toast.remove();
        });
      });
    });
  }

  function boot() {
    bootThemes();
    bootAccordions();
    bootTabs();
    bootFloatingSurfaces();
    bootDrawers();
    bootMachineSwitches();
    bootSliders();
    bootToasts();
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeFloatingSurfaces();
    closeDrawer(document.querySelector('.ax-drawer[data-open="true"]'));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
