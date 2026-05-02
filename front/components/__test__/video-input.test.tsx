import { render, screen, fireEvent } from "@testing-library/react";
import { VideoInput } from "../video-input";

// --- テスト用定数 ---
const PLACEHOLDER_TEXT = "YouTube URLを入力...";
const ADD_BUTTON_LABEL = "追加";
const ERROR_MESSAGE = "有効なYouTube URLを入力してください";

const VALID_YOUTUBE_URL = "https://www.youtube.com/watch?v=MkNeIUgNPQ8";
const VALID_YOUTUBE_VIDEO_ID = "MkNeIUgNPQ8";
const INVALID_URL = "https://example.com";

describe("VideoInput", () => {
  it("入力欄とボタンが正しく描画される", () => {
    const onAddMock = jest.fn();
    render(<VideoInput onAdd={onAddMock} />);

    // 入力欄の存在を確認
    const urlInput = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    expect(urlInput).toBeInTheDocument();

    // ボタンの存在を確認
    const addButton = screen.getByRole("button", { name: ADD_BUTTON_LABEL });
    expect(addButton).toBeInTheDocument();
  });

  it("有効なYouTube URLではモックが呼ばれ、入力欄がリセットされる", () => {
    const onAddMock = jest.fn();
    render(<VideoInput onAdd={onAddMock} />);

    const urlInput = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const addButton = screen.getByRole("button", { name: ADD_BUTTON_LABEL });

    // 有効なYouTube URLを入力して追加ボタンをクリック
    fireEvent.change(urlInput, { target: { value: VALID_YOUTUBE_URL } });
    fireEvent.click(addButton);

    expect(onAddMock).toHaveBeenCalledWith(VALID_YOUTUBE_URL, VALID_YOUTUBE_VIDEO_ID);
    // 送信後に入力欄がリセットされることを確認
    expect(urlInput).toHaveValue("");
    // エラーメッセージが表示されないことを確認
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
  });

  it("無効なYouTube URLではモックが呼ばれず、エラーメッセージを表示する", () => {
    const onAddMock = jest.fn();
    render(<VideoInput onAdd={onAddMock} />);

    const urlInput = screen.getByPlaceholderText(PLACEHOLDER_TEXT);
    const addButton = screen.getByRole("button", { name: ADD_BUTTON_LABEL });

    // YouTube以外のURLを入力して追加ボタンをクリック
    fireEvent.change(urlInput, { target: { value: INVALID_URL } });
    fireEvent.click(addButton);

    expect(onAddMock).not.toHaveBeenCalled();
    // エラーメッセージが表示されることを確認
    expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
  });
});
