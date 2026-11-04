// "Your case" stage: switches between the four scenes with a diagonal wipe.
import { reduced, refreshScroll, stageVisible } from './motion';

const TONES = ['light', 'danube', 'dark', 'dark'];

const stage = document.querySelector<HTMLElement>('[data-stage]');
const live = document.querySelector<HTMLElement>('[data-live]');
const options = Array.from(document.querySelectorAll<HTMLElement>('[data-pick]'));
const plates = Array.from(document.querySelectorAll<HTMLElement>('[data-plate]'));
const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-c]'));

let current = 0;
let topZ = 5;
let token = 0;
let animations: Animation[] = [];

function pick(next: number) {
  if (!stage || next === current) return;
  const previous = current;
  current = next;
  stage.dataset.scene = String(next);
  stage.dataset.tone = TONES[next];
  options.forEach((option, i) => option.setAttribute('aria-pressed', String(i === next)));
  if (live) live.textContent = `${stage.dataset.livePrefix ?? ''}${options[next].dataset.name ?? ''}`;
  refreshScroll();

  const run = (token += 1);
  animations.forEach((animation) => animation.cancel());
  animations = [];

  const instant = reduced || !stageVisible();
  plates.forEach((plate, i) => {
    if (i !== next && i !== previous) plate.style.visibility = 'hidden';
  });
  scenes.forEach((scene, i) => {
    if (i !== next && i !== previous) scene.style.visibility = 'hidden';
  });

  const inPlate = plates[next];
  const outPlate = plates[previous];
  const inScene = scenes[next];
  const outScene = scenes[previous];
  inPlate.style.visibility = 'visible';
  inPlate.style.zIndex = String((topZ += 1));
  inPlate.style.clipPath = 'none';
  inScene.style.visibility = 'visible';

  if (instant) {
    outPlate.style.visibility = 'hidden';
    outScene.style.visibility = 'hidden';
    return;
  }

  const dir = next > previous ? 1 : -1;
  const clipFrom =
    dir > 0
      ? 'polygon(140% 0%, 140% 0%, 140% 100%, 100% 100%)'
      : 'polygon(-40% 0%, 0% 0%, -40% 100%, -40% 100%)';
  const clipTo =
    dir > 0
      ? 'polygon(0% 0%, 140% 0%, 140% 100%, -40% 100%)'
      : 'polygon(-40% 0%, 140% 0%, 100% 100%, -40% 100%)';
  const inOut = 'cubic-bezier(.77,0,.18,1)';
  const out = 'cubic-bezier(.16,1,.3,1)';
  const animate = (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = el.animate(keyframes, options);
    animations.push(animation);
    return animation;
  };

  animate(inPlate, [{ clipPath: clipFrom }, { clipPath: clipTo }], { duration: 1050, easing: inOut });

  const inWord = inPlate.querySelector('[data-word]');
  const outWord = outPlate.querySelector('[data-word]');
  if (inWord) {
    animate(
      inWord,
      [
        { transform: `translate3d(${dir * 22}vw,0,0) skewX(${-dir * 14}deg)` },
        { transform: 'none' },
      ],
      { duration: 1400, easing: out },
    );
  }
  const outWordAnimation =
    outWord &&
    animate(
      outWord,
      [
        { transform: 'none' },
        { transform: `translate3d(${-dir * 16}vw,0,0) skewX(${dir * 10}deg)` },
      ],
      { duration: 1050, easing: inOut, fill: 'forwards' },
    );
  const outSceneAnimation = animate(
    outScene,
    [
      { transform: 'none', opacity: 1, filter: 'blur(0px)' },
      { transform: 'translate3d(0,-70px,0)', opacity: 0, filter: 'blur(6px)' },
    ],
    { duration: 420, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' },
  );
  inScene.querySelectorAll('[data-piece]').forEach((piece, i) => {
    animate(
      piece,
      [
        {
          transform: `translate3d(${dir * 140}px,0,0) skewX(${-dir * 6}deg)`,
          opacity: 0,
          filter: 'blur(10px)',
        },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: 950, delay: 320 + i * 110, easing: out, fill: 'backwards' },
    );
  });

  setTimeout(() => {
    if (run !== token) return;
    outPlate.style.visibility = 'hidden';
    outScene.style.visibility = 'hidden';
    outWordAnimation?.cancel();
    outSceneAnimation.cancel();
  }, 1100);
}

options.forEach((option, i) => option.addEventListener('click', () => pick(i)));

// The phrases in "Sound familiar?" jump to their case.
document.querySelector('[data-wall]')?.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const button = target?.closest<HTMLElement>('[data-scene]');
  if (!button) return;
  pick(Number(button.dataset.scene));
  const anchor = document.getElementById('caso');
  if (anchor) {
    window.scrollTo({
      top: anchor.getBoundingClientRect().top + window.scrollY,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }
});
