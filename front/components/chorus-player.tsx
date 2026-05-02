"use client";

import { Play, Pause, RotateCcw, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChorusPlayer() {
    return (
        <div className="min-h-screen bg-background">
            {/* ヘッダー */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* ロゴ・タイトル */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                <Music className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">YouTube合唱プレイヤー</h1>
                                <p className="text-xs text-muted-foreground">複数の動画を同時再生して合唱を楽しもう</p>
                            </div>
                        </div>

                        {/* 再生コントロール */}
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" title="リセット">
                            <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button size="lg" className="gap-2">
                                <>
                                <Pause className="h-5 w-5" />
                                一時停止
                                </>
                            </Button>
                            <Button size="lg" className="gap-2">
                                <>
                                <Play className="h-5 w-5" />
                                同時再生
                                </>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* フッター */}
            <footer className="border-t mt-auto">
                <div className="container mx-auto px-4 py-4">
                    <p className="text-center text-sm text-muted-foreground">
                        YouTube IFrame Player APIを使用しています。 動画の著作権は各権利者に帰属します。
                    </p>
                    <p className="text-center text-sm text-muted-foreground">
                        ©2026 Hakoice Studio All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
