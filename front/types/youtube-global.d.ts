/// <reference types="youtube" />

// Windowへのマージのみ追加
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export {};
