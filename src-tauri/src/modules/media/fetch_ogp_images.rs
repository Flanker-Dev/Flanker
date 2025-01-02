use scraper::{Html, Selector};
use tokio::task;
use reqwest::Url;

#[tauri::command]
pub async fn fetch_ogp_images(urls: Vec<String>) -> Result<Vec<(String, Option<String>)>, String> {
    let selector = Selector::parse("meta[property='og:image']").map_err(|e| format!("{:?}", e))?;

    let mut tasks = vec![];
    for url in urls {
        let selector_clone = selector.clone();
        tasks.push(task::spawn(async move {
            let response = reqwest::get(&url).await.ok();
            if let Some(resp) = response {
                if let Ok(body) = resp.text().await {
                    let document = Html::parse_document(&body);

                    // ベースURLを取得
                    let base_url = Url::parse(&url).ok();

                    if let Some(element) = document.select(&selector_clone).next() {
                        if let Some(content) = element.value().attr("content") {
                            // 相対URLを絶対URLに変換
                            let resolved_url = base_url
                                .as_ref()
                                .and_then(|base| Url::parse(content).or_else(|_| base.join(content)).ok());

                            return (url, resolved_url.map(|u| u.to_string()));
                        }
                    }
                }
            }
            (url, Some("Failed to fetch OGP image".to_string())) // 画像が見つからない場合
        }));
    }

    let results = futures::future::join_all(tasks)
        .await
        .into_iter()
        .map(|res| res.unwrap_or_else(|_| ("Unknown URL".to_string(), None)))
        .collect();

    Ok(results)
}
