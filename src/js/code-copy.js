(() => {
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

  function initCodeBlocks() {
    document.querySelectorAll('[data-ax-copy-code]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const root = btn.closest('.ax-code-block');
        if (!root) return;

        const code = root.querySelector('.ax-code-block__code');
        if (!code) return;

        const text = code.innerText;

        try {
          await copyText(text);
          btn.textContent = 'Copied';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 1200);
        } catch (err) {
          btn.textContent = 'Error';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBlocks);
  } else {
    initCodeBlocks();
  }
})();
