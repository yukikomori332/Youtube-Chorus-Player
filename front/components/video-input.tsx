"use client";

import { Link, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VideoInput() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="url" placeholder="YouTube URLを入力..." className="pl-10" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          追加
        </Button>
      </div>
      {/* エラーメッセージ表示用 */}
      <p className="text-sm text-destructive"></p>
    </div>
  );
}
