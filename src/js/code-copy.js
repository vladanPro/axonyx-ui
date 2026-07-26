(() => {
  const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M5 15V7a2 2 0 0 1 2-2h8"></path></svg>';

  function copyText(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve();
  }

  function buttonLabel(label) {
    return `${copyIcon}<span>${label}</span>`;
  }

  function codeTextForButton(btn) {
    const root = btn.closest('.ax-code-block, .ax-code-shell');
    if (!root) return '';
    const code = root.querySelector('.ax-code-block__code, .ax-code-shell__code, code');
    const pre = root.querySelector('pre');
    return (code || pre || root).innerText || '';
  }

  function enhanceLegacyPre(pre) {
    if (pre.dataset.axCodeEnhanced === 'true') return;
    if (pre.closest('.ax-code-block, .ax-code-shell')) return;
    if (pre.classList.contains('ax-docs-code-block__pre')) return;
    pre.dataset.axCodeEnhanced = 'true';

    const shell = document.createElement('figure');
    shell.className = 'ax-code-shell';
    shell.dataset.language = pre.dataset.language || pre.getAttribute('data-language') || 'code';

    const header = document.createElement('figcaption');
    header.className = 'ax-code-shell__header';

    const resolvedTitle = pre.dataset.title || pre.getAttribute('data-title') || 'Code';
    const resolvedLanguage = shell.dataset.language || 'code';

    const title = document.createElement('span');
    title.className = 'ax-code-shell__title';
    title.textContent = resolvedTitle;

    const tools = document.createElement('div');
    tools.className = 'ax-code-shell__tools';

    const language = document.createElement('span');
    language.className = 'ax-code-shell__language';
    language.textContent = resolvedLanguage;
    if (resolvedTitle.toLowerCase() === resolvedLanguage.toLowerCase()) {
      language.hidden = true;
    }

    const button = document.createElement('button');
    button.className = 'ax-code-shell__copy';
    button.type = 'button';
    button.dataset.axCopyCode = 'true';
    button.innerHTML = buttonLabel('Copy');

    tools.append(language, button);
    header.append(title, tools);

    pre.parentNode.insertBefore(shell, pre);
    shell.append(header, pre);
    pre.classList.add('ax-code-shell__pre');

    if (!pre.querySelector('code')) {
      const code = document.createElement('code');
      code.className = 'ax-code-shell__code';
      code.textContent = pre.textContent;
      pre.textContent = '';
      pre.appendChild(code);
    }
  }

  function initCodeBlocks() {
    document
      .querySelectorAll('pre.docs-code, pre[data-ax-code], .ax-card pre, .ui-code-window pre')
      .forEach(enhanceLegacyPre);

    document.querySelectorAll('[data-ax-copy-code]').forEach((btn) => {
      if (btn.dataset.axCopyReady === 'true') return;
      btn.dataset.axCopyReady = 'true';
      if (!btn.innerHTML.trim() || btn.textContent.trim() === 'Copy') {
        btn.innerHTML = buttonLabel('Copy');
      }

      btn.addEventListener('click', async () => {
        const text = codeTextForButton(btn);
        if (!text) return;

        try {
          await copyText(text);
          btn.innerHTML = buttonLabel('Copied');
          setTimeout(() => {
            btn.innerHTML = buttonLabel('Copy');
          }, 1200);
        } catch (err) {
          btn.innerHTML = buttonLabel('Error');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBlocks, { once: true });
  } else {
    initCodeBlocks();
  }
})();
