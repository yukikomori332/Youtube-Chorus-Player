import { render, screen, fireEvent, act } from "@testing-library/react";
import { VideoCard } from "../video-card";
import { type VideoPlaybackConfig } from "@/lib/video-store";

// ───────────────────────────────────────────
// 共通ユーティリティ
// ───────────────────────────────────────────
// 各テストで上書きしたいフィールドだけ指定できるベース動画設定ファクトリ
function createBaseVideo(overrides: Partial<VideoPlaybackConfig> = {}): VideoPlaybackConfig {
  return {
    id: "test-video-1",
    url: "https://youtu.be/MkNeIUgNPQ8",
    videoId: "MkNeIUgNPQ8",
    title: "テスト動画",
    startTime: 0,
    endTime: null,
    repeat: false,
    ...overrides,
  };
}

// 何もしない関数。コールバック不要なpropsに渡すプレースホルダー
const noop = () => {};

// ───────────────────────────────────────────
// 型定義
// ───────────────────────────────────────────
// YouTube IFrame Player APIが受け取るイベントハンドラ群
type YTPlayerEvents = {
  onReady: (e: { target: FakeYTPlayer }) => void;
  onStateChange: (e: { data: number; target: FakeYTPlayer }) => void;
};

// YouTube Playerコンストラクタに渡す設定オブジェクト
type YTPlayerConfig = {
  events: YTPlayerEvents;
};

// テスト用のYouTube Playerスタブ
// 実際の YT.Player メソッドのうちテストで使うものだけをモック化している
type FakeYTPlayer = {
  destroy: jest.Mock;
  getDuration: jest.Mock;
  pauseVideo: jest.Mock;
  playVideo: jest.Mock;
  seekTo: jest.Mock;
  getCurrentTime: jest.Mock;
};

// ───────────────────────────────────────────
// describe: 時間入力 UI
// ───────────────────────────────────────────
describe("VideoCard — 時間入力 UI", () => {
  // --- 時間入力 UI - 共通のテスト用定数 ---
  const START_TIME_PLACEHOLDER = "0:00:00.000";
  const END_TIME_PLACEHOLDER = "最後まで";

  it("開始時間を入力したとき、正しく変換された開始時間が onUpdate に渡る", () => {
    const onUpdate = jest.fn();
    // videoIdを null にすることで、YouTube Playerの初期化をスキップし、入力UIだけをテストする
    const video = createBaseVideo({ videoId: null });
    render(<VideoCard video={video} onUpdate={onUpdate} onRemove={noop} isPlaying={false} registerPlayer={noop} />);

    const INPUT_VALUE = "0:01:30";
    const EXPECTED_SECONDS = 90; // 秒
    const startInput = screen.getByPlaceholderText(START_TIME_PLACEHOLDER);

    // 開始時間を入力して、入力欄からフォーカスを外す
    fireEvent.change(startInput, { target: { value: INPUT_VALUE } });
    fireEvent.blur(startInput);

    // 正しく変換された開始時間が更新されていることを確認
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: video.id,
        startTime: EXPECTED_SECONDS,
      })
    );
  });

  it("終了時間を入力したとき、空文字なら endTime が null になる", () => {
    const onUpdate = jest.fn();
    const INITIAL_END_TIME = 120; // 秒
    const video = createBaseVideo({ videoId: null, endTime: INITIAL_END_TIME });

    render(<VideoCard video={video} onUpdate={onUpdate} onRemove={noop} isPlaying={false} registerPlayer={noop} />);

    const endInput = screen.getByPlaceholderText(END_TIME_PLACEHOLDER);
    const INPUT_WITH_MILLIS = "0:02:00.500";
    const EXPECTED_SECONDS_WITH_MILLIS = 120.5;

    // 終了時間を入力して、入力欄からフォーカスを外す
    fireEvent.change(endInput, { target: { value: INPUT_WITH_MILLIS } });
    fireEvent.blur(endInput);

    // 正しく変換されたミリ秒を含む終了時間が更新されていることを確認
    expect(onUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        endTime: EXPECTED_SECONDS_WITH_MILLIS,
      })
    );

    // モックをリセット
    onUpdate.mockClear();

    // 空の終了時間を入力して、入力欄からフォーカスを外す
    fireEvent.change(endInput, { target: { value: "" } });
    fireEvent.blur(endInput);

    // 空文字を入力すると、endTimeが null になることを確認
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: null,
      })
    );
  });
});

// ───────────────────────────────────────────
// describe: 終了検知とリピート分岐
// ───────────────────────────────────────────
describe("VideoCard — 終了検知とリピート分岐", () => {
  // ----------------------------------------------------------
  // Fake YT Player のセットアップ
  // ----------------------------------------------------------

  // 最後に生成されたYTPlayerConfig
  // テスト内で onReady / onStateChange を手動発火するために保持する
  let lastPlayerConfig: YTPlayerConfig | null = null;

  // 各テストで使い回すFake Playerインスタンス
  let fakePlayer: FakeYTPlayer;

  beforeEach(() => {
    // タイマーをJestの制御下に置く（setIntervalによる終了時間ポーリングを手動で進めるため）
    jest.useFakeTimers();
    lastPlayerConfig = null;

    fakePlayer = {
      destroy: jest.fn(),
      getDuration: jest.fn(() => 300), // デフォルトの動画時間: 300秒
      pauseVideo: jest.fn(),
      playVideo: jest.fn(),
      seekTo: jest.fn(),
      getCurrentTime: jest.fn(() => 0),
    };

    // window.YT.Playerのスタブコンストラクタ
    // フェイクタイマー有効時は queueMicrotask が進まないため、onReadyを非同期ではなく即座に呼び出している
    function MockYTPlayer(this: unknown, _containerId: string, config: YTPlayerConfig) {
      lastPlayerConfig = config;
      config.events.onReady({ target: fakePlayer });
      return fakePlayer;
    }

    const YT = {
      PlayerState: {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5,
      },
      Player: MockYTPlayer as unknown as typeof window.YT.Player,
    };

    (window as unknown as { YT: typeof YT }).YT = YT;
  });

  afterEach(() => {
    jest.useRealTimers();
    delete (window as unknown as { YT?: unknown }).YT;
  });

  // ----------------------------------------------------------
  // テスト用ヘルパー
  // ----------------------------------------------------------

  // Microtaskキューを空にして、Reactの非同期処理（useEffectなど）を完了させる
  // YT.Playerの初期化後にregisterPlayerが呼ばれることを確認する前に使う
  async function flushMicrotasks(): Promise<void> {
    await act(async () => {
      await Promise.resolve();
    });
  }

  // Playerに「再生中(PLAYING)」状態変化イベントを発火する
  // 終了時間ポーリング(setInterval)はこのイベントをトリガーに開始される
  function emitPlayingEvent(): void {
    const onStateChange = lastPlayerConfig?.events.onStateChange;
    expect(onStateChange).toBeDefined();

    act(() => {
      onStateChange!({
        data: window.YT.PlayerState.PLAYING,
        target: fakePlayer,
      });
    });
  }

  // Player に「動画終了(ENDED)」状態変化イベントを発火する
  // endTime 未設定の場合の終了検知に使う
  function emitEndedEvent(): void {
    const onStateChange = lastPlayerConfig?.events.onStateChange;
    expect(onStateChange).toBeDefined();

    act(() => {
      onStateChange!({
        data: window.YT.PlayerState.ENDED,
        target: fakePlayer,
      });
    });
  }

  // ----------------------------------------------------------
  // テストケース
  // ----------------------------------------------------------

  it("同期リピートON・終了時間到達時に onReachedEnd が一度だけ呼ばれ、その後は呼ばれない", async () => {
    const onReachedEnd = jest.fn();
    const registerPlayer = jest.fn();
    const END_TIME = 10; // 秒
    const video = createBaseVideo({ startTime: 0, endTime: END_TIME, repeat: true });

    render(
      <VideoCard
        video={video}
        onUpdate={noop}
        onRemove={noop}
        isPlaying={false}
        registerPlayer={registerPlayer}
        syncedRepeatEnabled
        onReachedEnd={onReachedEnd}
      />
    );

    // プレイヤー初期化の非同期処理を完了させる
    await flushMicrotasks();
    expect(registerPlayer).toHaveBeenCalledWith(video.id, fakePlayer);

    // 再生開始 → ポーリング開始
    emitPlayingEvent();

    // Fake Playerが endTime を返すようにして、100ミリ秒経過させる
    fakePlayer.getCurrentTime.mockReturnValue(END_TIME);
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    // 終了検知でコールバックが1回呼ばれ、動画が一時停止されることを確認
    expect(onReachedEnd).toHaveBeenCalledTimes(1);
    expect(onReachedEnd).toHaveBeenCalledWith(video.id);
    expect(fakePlayer.pauseVideo).toHaveBeenCalled();

    // さらに時間を進めても二重呼び出しされないことを確認
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(onReachedEnd).toHaveBeenCalledTimes(1);
  });

  it("同期リピートOFF・単体リピートON のとき、終了時間到達で seekTo が呼ばれ、 onReachedEnd は呼ばれない", async () => {
    const onReachedEnd = jest.fn();
    const registerPlayer = jest.fn();
    const START_TIME = 5;
    const END_TIME = 10;
    const video = createBaseVideo({ startTime: START_TIME, endTime: END_TIME, repeat: true });

    render(
      <VideoCard
        video={video}
        onUpdate={noop}
        onRemove={noop}
        isPlaying={false}
        registerPlayer={registerPlayer}
        syncedRepeatEnabled={false} // 単体リピートモード
        onReachedEnd={onReachedEnd}
      />
    );

    await flushMicrotasks();
    expect(registerPlayer).toHaveBeenCalledWith(video.id, fakePlayer);

    // 再生開始 → endTime に到達
    emitPlayingEvent();
    fakePlayer.getCurrentTime.mockReturnValue(END_TIME);
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    // 終了検知のコールバックを呼ばず、開始時間へ巻き戻ることを確認
    expect(onReachedEnd).not.toHaveBeenCalled();
    expect(fakePlayer.seekTo).toHaveBeenCalledWith(START_TIME, true);
  });

  it("同期リピートON のとき、YouTube側の ENDED イベントで onReachedEnd が呼ばれる", async () => {
    const onReachedEnd = jest.fn();
    const registerPlayer = jest.fn();
    // endTimeが未設定 → YouTubeネイティブの ENDED イベントで終了を検知する
    const video = createBaseVideo({ repeat: true });

    render(
      <VideoCard
        video={video}
        onUpdate={noop}
        onRemove={noop}
        isPlaying={false}
        registerPlayer={registerPlayer}
        syncedRepeatEnabled
        onReachedEnd={onReachedEnd}
      />
    );

    await flushMicrotasks();
    expect(registerPlayer).toHaveBeenCalledWith(video.id, fakePlayer);

    // 再生終了
    emitEndedEvent();

    // YouTubeネイティブの ENDED イベントで終了を検知することを確認
    expect(onReachedEnd).toHaveBeenCalledTimes(1);
    expect(onReachedEnd).toHaveBeenCalledWith(video.id);
  });

  it("同期リピートOFF・単体リピートON のとき、ENDED イベントで seekTo + playVideo が呼ばれる", async () => {
    const onReachedEnd = jest.fn();
    const registerPlayer = jest.fn();
    const START_TIME = 3;
    const video = createBaseVideo({ startTime: START_TIME, repeat: true });

    render(
      <VideoCard
        video={video}
        onUpdate={noop}
        onRemove={noop}
        isPlaying={false}
        registerPlayer={registerPlayer}
        syncedRepeatEnabled={false} // 単体リピートモード
        onReachedEnd={onReachedEnd}
      />
    );

    await flushMicrotasks();
    expect(registerPlayer).toHaveBeenCalledWith(video.id, fakePlayer);

    // 再生終了
    emitEndedEvent();

    // 終了検知のコールバックを呼ばず、開始時間から再生を再開することを確認
    expect(onReachedEnd).not.toHaveBeenCalled();
    expect(fakePlayer.seekTo).toHaveBeenCalledWith(START_TIME, true);
    expect(fakePlayer.playVideo).toHaveBeenCalled();
  });
});
