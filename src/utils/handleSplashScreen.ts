export function handleSplashScreen(
  setFadeOut: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSplash: React.Dispatch<React.SetStateAction<boolean>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  // スプラッシュスクリーンを8秒後にフェードアウト開始
  const splashTimeout = setTimeout(() => {
    setFadeOut(true);
    // フェードアウトが完了するまでさらに1秒待つ
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, 8000);

  // プログレスバーの進行をシミュレート
  const progressInterval = setInterval(() => {
    setProgress((prev) => (prev < 100 ? prev + 1 : 100));
  }, 120); // 150msごとに1%ずつ進む

  return () => {
    clearInterval(progressInterval);
    clearTimeout(splashTimeout);
  };
}
