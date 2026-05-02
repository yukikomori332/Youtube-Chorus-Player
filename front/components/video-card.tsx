"use client";

import { X, RotateCcw, Clock, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function VideoCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium truncate flex-1 mr-2">動画</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {/* プレイヤーエリア */}
        <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
          <div className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            URLを入力してください
          </div>
        </div>

        {/* 再生時間表示 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Clock className="h-3 w-3" />
          <span>0:00:00.000</span>
          <span>/</span>
          <span>0:01:00.000</span>
        </div>

        {/* 音量コントロール */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />
          </Button>
          <Slider max={100} step={1} className="flex-1" />
        </div>

        {/* 設定 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">開始時間</Label>
            <Input type="text" placeholder="0:00:00.000" className="h-8 text-sm font-mono" defaultValue={""} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">終了時間</Label>
            <Input type="text" placeholder="最後まで" className="h-8 text-sm font-mono" defaultValue={""} />
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
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
}
