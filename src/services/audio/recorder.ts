/**
 * Records the learner's voice locally (MediaRecorder) so they can compare it
 * with the model audio. Recordings stay in memory and are never uploaded.
 */
export function recorderSupported(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';
}

export class VoiceRecorder {
  private rec: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private url: string | null = null;

  async start(): Promise<void> {
    this.release();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    this.chunks = [];
    this.rec = new MediaRecorder(this.stream);
    this.rec.ondataavailable = (e) => {
      if (e.data.size) this.chunks.push(e.data);
    };
    this.rec.start();
  }

  stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      const rec = this.rec;
      if (!rec) return reject(new Error('not-recording'));
      rec.onstop = () => {
        const blob = new Blob(this.chunks, { type: rec.mimeType || 'audio/webm' });
        this.stream?.getTracks().forEach((t) => t.stop());
        this.stream = null;
        if (this.url) URL.revokeObjectURL(this.url);
        this.url = URL.createObjectURL(blob);
        resolve(this.url);
      };
      rec.stop();
    });
  }

  get recording(): boolean {
    return this.rec?.state === 'recording';
  }

  release() {
    if (this.rec && this.rec.state !== 'inactive') this.rec.stop();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = null;
  }
}

export function playUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio(url);
    a.onended = () => resolve();
    a.onerror = () => resolve();
    a.play().catch(() => resolve());
  });
}
