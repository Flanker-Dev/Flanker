use reqwest::{header, StatusCode};
use std::time::Duration;

#[tauri::command]
pub async fn check_link_status(url: &str) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .redirect(reqwest::redirect::Policy::limited(10))
        .timeout(Duration::from_secs(15))
        .build()
        .unwrap();

    // クエリパラメータを追加
    let url_with_query = format!("{}?fbclid=example", url);

    let response = client
        .get(&url_with_query)
        .header(header::USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        .header("Upgrade-Insecure-Requests", "1")
        .header("Sec-Fetch-Site", "none")
        .header("Sec-Fetch-Mode", "navigate")
        .header("Sec-Fetch-User", "?1")
        .header("Sec-Fetch-Dest", "document")
        .header("Cookie", "__cf_bm=example_cookie") // Cookie追加
        .send()
        .await;

    match response {
        Ok(resp) => {
            let status = resp.status();
            if status.is_success() {
                // println!("URL: {} is alive (Status: {})", resp.url(), status);
                Ok("alive".to_string())
            } else if status == StatusCode::FORBIDDEN {
                // println!(
                //     "URL: {} returned 403 Forbidden. Headers: {:?}",
                //     resp.url(),
                //     resp.headers()
                // );
                Ok("403 Forbidden".to_string())
            } else if status == StatusCode::UNAUTHORIZED {
                // println!(
                //     "URL: {} returned 401 Unauthorized. Headers: {:?}",
                //     resp.url(),
                //     resp.headers()
                // );
                Ok("401 Unauthorized".to_string())
            } else {
                // println!(
                //     "URL: {} returned status: {}. Headers: {:?}",
                //     resp.url(),
                //     status,
                //     resp.headers()
                // );
                Ok(format!("dead (Status: {})", status))
            }
        }
        Err(e) => {
            if e.is_timeout() {
                // println!("Timeout error checking link {}: {:?}", url, e);
                Err("Timeout error checking link".to_string())
            } else {
                // println!("Error checking link {}: {:?}", url, e);
                Err("Error checking link".to_string())
            }
        }
    }
}
