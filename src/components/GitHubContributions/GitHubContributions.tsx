import { invoke } from "@tauri-apps/api";
import { RefreshCw, Loader } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Contribution {
  date: string;
  count: number;
}

const GitHubContributionsComponent: React.FC = () => {
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") || ""
  );
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const savedContributions = localStorage.getItem("contributions");
    return savedContributions ? JSON.parse(savedContributions) : [];
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchContributions = useCallback(async () => {
    try {
      console.log(`GitHub Contributionsの取得を開始: ${username}`); // デバッグログ
      const data = await invoke("get_contributions", { username, token });
      console.log("GitHub Contributionsデータ:", data); // デバッグログ
      setContributions(data as Contribution[]);
      setError("");
    } catch (err) {
      console.error("情報の取得中にエラーが発生しました:", err);
      setError("情報の取得に失敗しました。");
    }
  }, [username, token]);

  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    if (contributions.length > 0) {
      localStorage.setItem("contributions", JSON.stringify(contributions));
    }
  }, [username, token, contributions]);

  const handleFetchContributions = async () => {
    if (!username || !token) {
      setError("ユーザー名とトークンを入力してください。");
      return;
    }
    setIsLoading(true);
    const startTime = Date.now();
    await fetchContributions();
    const elapsedTime = Date.now() - startTime;
    const remainingTime = 5000 - elapsedTime;
    setTimeout(() => setIsLoading(false), Math.max(remainingTime, 0));
  };

  const memoizedContributions = useMemo(() => contributions, [contributions]);

  return (
    <div className="flex items-center">
      {contributions.length === 0 && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="GH Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-5"
          />
          <Input
            type="text"
            placeholder="GH Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="h-5"
          />
          <Button
            variant={"outline"}
            onClick={handleFetchContributions}
            disabled={isLoading}
            className="h-5"
          >
            {isLoading ? "取得中..." : "取得"}
          </Button>
        </div>
      )}

      {error ? <p className="text-red-500">{error}</p> : null}
      {isLoading ? (
        <p className="w-[150px] animate-pulse text-center text-xs italic">
          {"- Now Loading -"}
        </p>
      ) : (
        contributions.length > 0 && (
          <CalendarHeatmap
            startDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
            endDate={new Date()}
            values={memoizedContributions}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              const count = Math.min(value.count, 30);
              if (count >= 25) return "fill-stone-900";
              if (count >= 20) return "fill-stone-800";
              if (count >= 15) return "fill-stone-600";
              if (count >= 10) return "fill-stone-400";
              if (count >= 5) return "fill-stone-200";
              return "transparent";
            }}
            showWeekdayLabels={false}
            showMonthLabels={false}
          />
        )
      )}

      {/* 更新ボタン */}
      <Button
        variant={"fit"}
        size={"fit"}
        onClick={handleFetchContributions}
        className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const GitHubContributions = memo(GitHubContributionsComponent);

// Tailwind CSSのクラスを追加
const styles = `
.color-empty {
  @apply fill-transparent;
}
.fill-stone-200 {
  @apply fill-stone-200;
}
.fill-stone-400 {
  @apply fill-stone-400;
}
.fill-stone-600 {
  @apply fill-stone-600;
}
.fill-stone-800 {
  @apply fill-stone-800;
}
.fill-stone-900 {
  @apply fill-stone-900;
}
.transparent {
  @apply fill-transparent;
}
`;

// スタイルを追加
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
