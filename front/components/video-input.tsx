"use client";

import { useState } from "react";
import { Link, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractYouTubeVideoId } from "@/lib/video-store";

interface VideoInputProps {
  onAdd: (url: string, videoId: string) => void;
}

export function VideoInput({ onAdd }: VideoInputProps) {
  // YouTube URLの入力値を管理
  const [youtubeUrl, setYoutubeUrl] = useState("");
  // 入力バリデーションのエラーメッセージを管理
  const [validationError, setValidationError] = useState("");

  // 入力されたURLからYouTube動画の動画IDを抽出し、動画を追加する
  // 無効なURLの場合はバリデーションエラーを表示する
  const handleAddVideo = () => {
    const videoId = extractYouTubeVideoId(youtubeUrl.trim());

    if (videoId) {
      onAdd(youtubeUrl.trim(), videoId);
      // 追加成功後、入力フィールドとエラーメッセージをリセット
      setYoutubeUrl("");
      setValidationError("");
    } else {
      setValidationError("有効なYouTube URLを入力してください");
    }
  };

  // Enterキー押下時に動画追加を実行する
  // テキスト入力フィールドのキーボードイベントハンドラ
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddVideo();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder="YouTube URLを入力..."
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              setValidationError("");
            }}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddVideo} disabled={!youtubeUrl.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          追加
        </Button>
      </div>
      {/* エラーメッセージ */}
      {validationError && <p className="text-sm text-destructive">{validationError}</p>}
    </div>
  );
}
