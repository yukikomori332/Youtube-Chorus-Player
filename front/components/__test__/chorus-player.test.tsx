import { render, screen, fireEvent } from "@testing-library/react";
import { ChorusPlayer } from "../chorus-player";

// ───────────────────────────────────────────
// モック定義
// ───────────────────────────────────────────
// video.id を data-testid に埋め込み、カードが描画されたことだけを検証できるようにする
jest.mock("@/components/video-card", () => ({
  VideoCard: function MockVideoCard({ video }: { video: { id: string } }) {
    return <div data-testid={`card-${video.id}`}>mock player</div>;
  },
}));

// ----------------------------------------------------------
// テスト用ヘルパー
// ----------------------------------------------------------
const VALID_YOUTUBE_URL = "https://www.youtube.com/watch?v=MkNeIUgNPQ8";
const PLACEHOLDER_TEXT = "YouTube URLを入力...";
const ADD_BUTTON_LABEL = "追加";
const PLAY_BUTTON_LABEL = "同時再生";
const STOP_BUTTON_LABEL = "一時停止";

// ----------------------------------------------------------
// テストケース
// ----------------------------------------------------------
describe("ChorusPlayer", () => {
  describe("同時再生ボタンの状態遷移", () => {
    it("動画追加後に「同時再生」を押すと、ボタンが「一時停止」表示へ切り替わる", () => {
      render(<ChorusPlayer />);

      const urlInput = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
      const addButton = screen.getByRole("button", { name: ADD_BUTTON_LABEL });

      // 有効なYouTube URLを入力して追加ボタンをクリック
      fireEvent.change(urlInput, { target: { value: VALID_YOUTUBE_URL } });
      fireEvent.click(addButton);

      // 動画カードが1件描画されていることを確認
      expect(screen.getByTestId(/card-/)).toBeInTheDocument();

      // 同時再生を開始する
      fireEvent.click(screen.getByRole("button", { name: PLAY_BUTTON_LABEL }));

      // ボタンラベルが「一時停止」へ変化し、再生中状態になっていることを確認
      expect(screen.getByRole("button", { name: STOP_BUTTON_LABEL })).toBeInTheDocument();
    });

    it("「一時停止」を押すと、ボタンが「同時再生」表示へ切り替わる", () => {
      render(<ChorusPlayer />);

      const urlInput = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
      const addButton = screen.getByRole("button", { name: ADD_BUTTON_LABEL });

      // 有効なYouTube URLを入力して追加ボタンをクリック
      fireEvent.change(urlInput, { target: { value: VALID_YOUTUBE_URL } });
      fireEvent.click(addButton);

      // 動画カードが1件描画されていることを確認
      expect(screen.getByTestId(/card-/)).toBeInTheDocument();

      // 同時再生を開始する
      fireEvent.click(screen.getByRole("button", { name: PLAY_BUTTON_LABEL }));

      // 動画を一時停止する
      fireEvent.click(screen.getByRole("button", { name: STOP_BUTTON_LABEL }));

      // ボタンラベルが「同時再生」へ戻り、停止状態になっていることを確認
      expect(screen.getByRole("button", { name: PLAY_BUTTON_LABEL })).toBeInTheDocument();
    });
  });
});
