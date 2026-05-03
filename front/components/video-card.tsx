"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { X, RotateCcw, Clock, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { type VideoPlaybackConfig, formatTime, parseTimeInput } from "@/lib/video-store";

interface VideoCardProps {
  video: VideoPlaybackConfig;
  onUpdate: (video: VideoPlaybackConfig) => void;
  onRemove: (id: string) => void;
  isPlaying: boolean;
  registerPlayer: (id: string, player: object | null) => void;
  syncedRepeatEnabled?: boolean;
  playToken?: number;
  onReachedEnd?: (id: string) => void;
}

export function VideoCard(
  {
    video,
    onUpdate,
    onRemove,
    isPlaying,
    registerPlayer,
    syncedRepeatEnabled = false,
    playToken = 0,
    onReachedEnd,
  }: VideoCardProps) {
    const containerId = `player-${video.id}`;
    const containerRef = useRef<HTMLDivElement>(null);

    // ───────────────────────────────────────────
    // refs（クロージャ問題の回避 & プレイヤー保持）
    // ───────────────────────────────────────────
    const playerRef              = useRef<YT.Player | null>(null);
    const intervalRef            = useRef<NodeJS.Timeout | null>(null);
    const videoRef               = useRef(video);
    const syncedRepeatEnabledRef = useRef(syncedRepeatEnabled);
    const onReachedEndRef        = useRef(onReachedEnd);
    const hasSignaledEndRef      = useRef(false);

    // ───────────────────────────────────────────
    // state
    // ───────────────────────────────────────────
    const [isReady, setIsReady]   = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume]     = useState(100);
    const [isMuted, setIsMuted]   = useState(false);

    // ───────────────────────────────────────────
    // refの最新値同期
    // ───────────────────────────────────────────
    useEffect(() => { videoRef.current = video; }, [video]);
    useEffect(() => { syncedRepeatEnabledRef.current = syncedRepeatEnabled; }, [syncedRepeatEnabled]);
    useEffect(() => { onReachedEndRef.current = onReachedEnd; }, [onReachedEnd]);
    useEffect(() => { hasSignaledEndRef.current = false; }, [playToken]);

    // ───────────────────────────────────────────
    // 音量・ミュート操作
    // ───────────────────────────────────────────
    const handleVolumeChange = useCallback((value: number[]) => {
      const vol = value[0];
      setVolume(vol);

      const player = playerRef.current;
      if (!player) return;

      player.setVolume(vol);
      if (vol > 0 && isMuted) {
        player.unMute();
        setIsMuted(false);
      }
    }, [isMuted]);

    const toggleMute = useCallback(() => {
      const player = playerRef.current;
      if (!player) return;

      if (isMuted) {
        player.unMute();
        player.setVolume(volume);
      } else {
        player.mute();
      }
      setIsMuted((prev) => !prev);
    }, [isMuted, volume]);

    // ───────────────────────────────────────────
    // インターバル管理
    // ───────────────────────────────────────────
    const clearTimeInterval = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const handleTimeProgress = useCallback((time: number) => {
      setCurrentTime(time);

      const cv     = videoRef.current;
      const player = playerRef.current;
      if (!cv.endTime || time < cv.endTime || !player) return;

      if (syncedRepeatEnabledRef.current) {
        if (!hasSignaledEndRef.current) {
          hasSignaledEndRef.current = true;
          player.pauseVideo?.();
          onReachedEndRef.current?.(cv.id);
        } else {
          player.pauseVideo?.();
        }
        return;
      }

      if (cv.repeat) {
        player.seekTo?.(cv.startTime, true);
      } else {
        player.pauseVideo?.();
      }
    }, []);

    const startTimeInterval = useCallback(() => {
      clearTimeInterval();
      intervalRef.current = setInterval(() => {
        const player = playerRef.current;
        if (typeof player?.getCurrentTime === "function") {
          handleTimeProgress(player.getCurrentTime());
        }
      }, 100);
    }, [clearTimeInterval, handleTimeProgress]);

    // ───────────────────────────────────────────
    // 状態変化ハンドラ
    // ───────────────────────────────────────────
    const handleStateChange = useCallback((event: YT.OnStateChangeEvent) => {
      const { PlayerState } = window.YT;
      const player = playerRef.current;
      const cv     = videoRef.current;

      if (event.data === PlayerState.PLAYING) {
        startTimeInterval();
        return;
      }

      clearTimeInterval();
      if (!player) return;

      const isEnded = event.data === PlayerState.ENDED;

      if (isEnded && syncedRepeatEnabledRef.current) {
        if (!hasSignaledEndRef.current) {
          hasSignaledEndRef.current = true;
          onReachedEndRef.current?.(cv.id);
        }
        return;
      }

      if (isEnded && cv.repeat) {
        player.seekTo?.(cv.startTime, true);
        player.playVideo?.();
      }
    }, [startTimeInterval, clearTimeInterval]);

    // ───────────────────────────────────────────
    // プレイヤー初期化・破棄
    // ───────────────────────────────────────────
    useEffect(() => {
      if (!video.videoId) return;

      const initPlayer = () => {
        if (!window.YT?.Player) return;

        playerRef.current?.destroy();
        playerRef.current = null;

        playerRef.current = new window.YT.Player(containerId, {
          videoId: video.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            start: Math.floor(video.startTime),
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }: YT.PlayerEvent) => {
              setDuration(target.getDuration());
              setIsReady(true);
              registerPlayer(video.id, target as YT.Player);
            },
            onStateChange: handleStateChange,
          },
        });
      };

      if (window.YT?.Player) {
        initPlayer();
      } else {
        const timer = setInterval(() => {
          if (window.YT?.Player) {
            clearInterval(timer);
            initPlayer();
          }
        }, 100);
        return () => clearInterval(timer);
      }

      return () => {
        clearTimeInterval();
        registerPlayer(video.id, null);
        playerRef.current?.destroy();
        playerRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video.videoId, video.id, containerId]);
    // ↑ handleStateChangeを含めると再初期化ループが起きるため意図的に除外

    // ───────────────────────────────────────────
    // 再生状態の同期
    // ───────────────────────────────────────────
    useEffect(() => {
      const player = playerRef.current;
      if (!isReady || !player || typeof player.seekTo !== "function") return;

      if (isPlaying) {
        player.seekTo(video.startTime, true);
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }, [isPlaying, isReady, video.startTime, playToken]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium truncate flex-1 mr-2">{video.title || "動画"}</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => onRemove(video.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {/* プレイヤーエリア */}
        <div ref={containerRef} className="aspect-video bg-muted rounded-md overflow-hidden relative">
          <div id={containerId} className="w-full h-full" />
          {!video.videoId && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              URLを入力してください
            </div>
          )}
        </div>

        {/* 再生時間表示 */}
        {isReady && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Clock className="h-3 w-3" />
            <span>{formatTime(currentTime, true)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}

        {/* 音量コントロール */}
        {isReady && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        )}

        {/* 設定 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">開始時間</Label>
            <Input
              type="text"
              placeholder="0:00:00.000"
              className="h-8 text-sm font-mono"
              defaultValue={video.startTime > 0 ? formatTime(video.startTime, true) : ""}
              onBlur={(e) => onUpdate({ ...video, startTime: parseTimeInput(e.target.value) })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">終了時間</Label>
            <Input
              type="text"
              placeholder="最後まで"
              className="h-8 text-sm font-mono"
              defaultValue={video.endTime ? formatTime(video.endTime, true) : ""}
              onBlur={(e) =>
                onUpdate({
                  ...video,
                  endTime: e.target.value ? parseTimeInput(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        {/* ヒント */}
        <p className="text-xs text-muted-foreground">形式: 時:分:秒.ミリ秒（例: 0:01:30.500）</p>

        {/* リピート設定 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm">リピート</Label>
          </div>
          <Switch
            checked={video.repeat}
            onCheckedChange={(checked: boolean) => onUpdate({ ...video, repeat: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
