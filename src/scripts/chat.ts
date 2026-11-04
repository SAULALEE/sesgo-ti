// Chat demo: plays sample questions while visible and answers the quick questions on tap.
import { isSceneActive, reduced } from './motion';

interface Exchange {
  q: string;
  a: string;
}

const root = document.querySelector<HTMLElement>('[data-chat]');
const log = root?.querySelector<HTMLElement>('[data-chat-log]');
const typing = root?.querySelector<HTMLElement>('[data-typing]');
const countEl = root?.querySelector<HTMLElement>('[data-chat-count]');

if (root && log && typing) {
  const chatLog = log;
  const typingEl = typing;
  const auto = JSON.parse(root.dataset.auto ?? '[]') as Exchange[];
  const quick = JSON.parse(root.dataset.quick ?? '[]') as Exchange[];
  let next = 0;
  let count = 0;
  let timer: ReturnType<typeof setTimeout>;
  let answer: (() => void) | null = null;

  function addMessage(text: string, me: boolean) {
    const message = document.createElement('div');
    message.className = me ? 'chat__msg chat__msg--me' : 'chat__msg';
    message.textContent = text;
    chatLog.insertBefore(message, typingEl);
  }

  function ask(exchange: Exchange) {
    clearTimeout(timer);
    // A tap during an unanswered question answers it first instead of dropping it.
    answer?.();
    if (chatLog.querySelectorAll('.chat__msg').length > 40) {
      chatLog.querySelectorAll('.chat__msg').forEach((message) => message.remove());
    }
    addMessage(exchange.q, false);
    typingEl.hidden = false;
    answer = () => {
      answer = null;
      addMessage(exchange.a, true);
      typingEl.hidden = true;
      count += 1;
      if (countEl) countEl.textContent = String(count);
    };
    timer = setTimeout(() => {
      answer?.();
      timer = setTimeout(step, reduced ? 6000 : 2800);
    }, 1100);
  }

  function step() {
    if (!isSceneActive(2)) {
      timer = setTimeout(step, 900);
      return;
    }
    ask(auto[next++ % auto.length]);
  }

  root.querySelectorAll<HTMLElement>('[data-ask]').forEach((button) => {
    button.addEventListener('click', () => ask(quick[Number(button.dataset.ask)]));
  });

  timer = setTimeout(step, 600);
}
