export const SITE_SHARE = Object.freeze({
  title: '三丁目資料室（仮）',
  text: 'オリジナル漫画とショートアニメの作品サイト。毎日に、ちょっと笑える物語。',
  url: 'https://pshg9519-cloud.github.io/sanchome-shiryoshitsu/'
});

export function createSiteShare({e, button}) {
  const section = e('li', 'site-share');
  const trigger = button('', share, 'site-share-trigger');
  trigger.setAttribute('aria-label', 'このサイトを共有');
  trigger.append(e('span', 'site-share-label', 'このサイトを共有'));
  const status = e('p', 'site-share-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  section.append(trigger, status);

  const dialog = e('dialog', 'site-share-dialog');
  dialog.id = 'site-share-dialog';
  dialog.setAttribute('aria-labelledby', 'site-share-menu-title');
  const bar = e('div', 'site-share-dialog-heading');
  const heading = e('h2', '', 'このサイトを共有');
  heading.id = 'site-share-menu-title';
  const close = button('閉じる ×', () => dialog.close(), 'site-share-close');
  close.setAttribute('aria-label', '共有メニューを閉じる');
  close.autofocus = true;
  bar.append(heading, close);
  const reason = e('p', 'site-share-reason');
  const actions = e('div', 'site-share-options');
  const x = e('a', 'button button-secondary', 'Xで共有');
  const intent = new URL('https://twitter.com/intent/tweet');
  intent.search = new URLSearchParams({text: SITE_SHARE.title + '\n' + SITE_SHARE.text, url: SITE_SHARE.url}).toString();
  x.href = intent.href;
  x.target = '_blank';
  x.rel = 'noopener noreferrer';
  x.referrerPolicy = 'no-referrer';
  const copy = button('URLをコピー', copyUrl, 'button button-secondary');
  actions.append(x, copy);
  const copyStatus = e('p', 'site-share-copy-status');
  copyStatus.setAttribute('role', 'status');
  copyStatus.setAttribute('aria-live', 'polite');
  const manual = e('label', 'site-share-manual', '共有するサイトのURL');
  manual.hidden = true;
  const field = e('input');
  field.type = 'text';
  field.value = SITE_SHARE.url;
  field.readOnly = true;
  field.spellcheck = false;
  field.setAttribute('aria-label', '共有するサイトのURL');
  field.addEventListener('click', () => field.select());
  manual.append(field);
  dialog.append(bar, reason, actions, copyStatus, manual);
  section.append(dialog);

  let oldOverflow = '';
  let busy = false;
  async function share() {
    if (busy) return;
    status.textContent = '';
    try {
      if (!window.isSecureContext || typeof navigator.share !== 'function' ||
          (typeof navigator.canShare === 'function' && !navigator.canShare(SITE_SHARE))) {
        openFallback();
        return;
      }
      busy = true;
      trigger.disabled = true;
      trigger.setAttribute('aria-busy', 'true');
      // Called directly within the click handler, before any asynchronous work.
      await navigator.share({...SITE_SHARE});
    } catch (error) {
      // AbortError also covers absence of a native share target. No error alert.
      if (error?.name !== 'AbortError') openFallback('標準共有を開けませんでした。別の方法をお選びください。');
    } finally {
      busy = false;
      trigger.disabled = false;
      trigger.removeAttribute('aria-busy');
      if (!dialog.open) trigger.focus({preventScroll: true});
    }
  }
  function openFallback(message = '共有する方法をお選びください。') {
    if (dialog.open) return;
    reason.textContent = message;
    copyStatus.textContent = '';
    manual.hidden = true;
    oldOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    close.focus({preventScroll: true});
  }
  async function copyUrl() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(SITE_SHARE.url);
      manual.hidden = true;
      copyStatus.textContent = 'URLをコピーしました。';
    } catch {
      copyStatus.textContent = '自動コピーできませんでした。下のURLを選択してコピーしてください。';
      manual.hidden = false;
      field.focus();
      field.select();
    }
  }
  dialog.addEventListener('close', () => {
    document.body.style.overflow = oldOverflow;
    trigger.focus({preventScroll: true});
  });
  const outside = event => {
    const r = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
  };
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => {backdropPress = outside(event);});
  dialog.addEventListener('click', event => {
    if (backdropPress && outside(event)) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button:not(:disabled),a[href],input')].filter(n => n.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
  return section;
}
