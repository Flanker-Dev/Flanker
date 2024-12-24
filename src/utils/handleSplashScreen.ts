export function handleSplashScreen(
  setFadeOut: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSplash: React.Dispatch<React.SetStateAction<boolean>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  // スプラッシュスクリーンを3秒後にフェードアウト開始
  const splashTimeout = setTimeout(() => {
    setFadeOut(true);
    // フェードアウトが完了するまでさらに1秒待つ
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  }, 4000);

  // プログレスバーの進行をシミュレート
  const progressInterval = setInterval(() => {
    setProgress((prev) => (prev < 100 ? prev + 1 : 100));
  }, 30);

  return () => {
    clearInterval(progressInterval);
    clearTimeout(splashTimeout);
  };
}
