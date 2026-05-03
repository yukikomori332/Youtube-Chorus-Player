// Testing Libraryのカスタムマッチャーを追加
import "@testing-library/jest-dom";

// JSDOMはResizeObserverを実装していないため、コンポーネント内で使用している場合にテストがクラッシュする
// ResizeObserverのモックをglobalに登録して、クラッシュを回避する
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
