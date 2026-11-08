/**
 * A stand-in for YouTube's IFrame Player API in end-to-end tests (no network): a fake player
 * with the documented methods and events, whose clock the test can move. Video ids starting
 * with "errEmbed" report error 150, "errMissing" error 100.
 */
import type { BrowserContext, Page } from '@playwright/test';

const FAKE_API = `(() => {
  class Player {
    constructor(el, opts) {
      this.opts = opts;
      this.time = (opts.playerVars && opts.playerVars.start) || 0;
      this.rate = 1;
      this.state = -1;
      const div = document.createElement('div');
      div.className = 'fake-yt';
      div.dataset.videoId = opts.videoId;
      div.style.cssText = 'position:absolute;inset:0;background:#202124;color:#fff;display:flex;align-items:center;justify-content:center;font:14px sans-serif';
      div.textContent = 'YouTube (test) ' + opts.videoId;
      el.replaceWith(div);
      this.el = div;
      (window.__ytPlayers = window.__ytPlayers || []).push(this);
      setTimeout(() => {
        const id = opts.videoId;
        const code = id.startsWith('errEmbed') ? 150 : id.startsWith('errMissing') ? 100 : 0;
        if (code) opts.events.onError && opts.events.onError({ data: code });
        else opts.events.onReady && opts.events.onReady({ target: this });
      }, 30);
    }
    emit(state) {
      this.state = state;
      this.opts.events.onStateChange && this.opts.events.onStateChange({ data: state, target: this });
    }
    playVideo() {
      if (this.timer) return;
      this.last = performance.now();
      this.timer = setInterval(() => {
        const now = performance.now();
        this.time += ((now - this.last) / 1000) * this.rate;
        this.last = now;
      }, 40);
      this.emit(1);
    }
    pauseVideo() {
      clearInterval(this.timer);
      this.timer = null;
      this.emit(2);
    }
    seekTo(t) {
      this.time = t;
      this.last = performance.now();
      (window.__ytSeeks = window.__ytSeeks || []).push(t);
    }
    getCurrentTime() { return this.time; }
    getDuration() { return 300; }
    getPlayerState() { return this.state; }
    setPlaybackRate(r) {
      this.rate = r;
      this.opts.events.onPlaybackRateChange && this.opts.events.onPlaybackRateChange({ data: r });
    }
    getPlaybackRate() { return this.rate; }
    getAvailablePlaybackRates() { return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]; }
    destroy() {
      clearInterval(this.timer);
      this.el.remove();
      window.__ytPlayers = (window.__ytPlayers || []).filter((p) => p !== this);
    }
  }
  window.YT = { Player, PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 } };
  setTimeout(() => window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady(), 0);
})();`;

/** Serves the fake API and blocks every other YouTube request (oEmbed etc.). */
export async function fakeYouTube(context: BrowserContext) {
  await context.route('https://www.youtube.com/iframe_api', (route) => route.fulfill({ contentType: 'text/javascript', body: FAKE_API }));
  await context.route(/https:\/\/(www\.)?youtube\.com\/oembed.*/, (route) => route.fulfill({ status: 404, body: '' }));
}

/** Moves the clock of the fake player (seconds). */
export async function setVideoTime(page: Page, seconds: number) {
  await page.evaluate((s) => {
    const players = (window as unknown as { __ytPlayers?: { seekTo(t: number): void }[] }).__ytPlayers ?? [];
    players.at(-1)?.seekTo(s);
  }, seconds);
}

export async function videoTime(page: Page): Promise<number> {
  return page.evaluate(() => {
    const players = (window as unknown as { __ytPlayers?: { getCurrentTime(): number }[] }).__ytPlayers ?? [];
    return players.at(-1)?.getCurrentTime() ?? -1;
  });
}
