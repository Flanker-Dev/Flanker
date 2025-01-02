// src-tauri/src/github.rs
use reqwest::Client;
use serde::{Deserialize, Serialize};  // Serializeをインポート

#[derive(Deserialize, Serialize, Debug)]  // Debugを追加
pub struct Event {
    pub id: String,
    #[serde(rename = "type")]
    pub type_: String,
    pub created_at: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Contribution {
    pub date: String,
    pub count: i32,
}

#[tauri::command]
pub async fn get_contributions(username: String, token: String) -> Result<Vec<Contribution>, String> {
    println!("get_contributions関数が呼び出されました: {}", username);

    let client = Client::new();
    let query = format!(
        r#"
        {{
            user(login: "{}") {{
                contributionsCollection {{
                    contributionCalendar {{
                        weeks {{
                            contributionDays {{
                                date
                                contributionCount
                            }}
                        }}
                    }}
                }}
            }}
        }}
        "#,
        username
    );

    let response = client
        .post("https://api.github.com/graphql")
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "YourAppName")
        .json(&serde_json::json!({ "query": query }))
        .send()
        .await;

    match response {
        Ok(res) => {
            let text = res.text().await.map_err(|e| e.to_string())?;
            println!("APIレスポンスの内容: {}", text);

            let json: serde_json::Value = serde_json::from_str(&text).map_err(|e| e.to_string())?;
            let days = json["data"]["user"]["contributionsCollection"]["contributionCalendar"]["weeks"]
                .as_array()
                .ok_or("Invalid response format")?
                .iter()
                .flat_map(|week| {
                    week["contributionDays"]
                        .as_array()
                        .unwrap()
                        .iter()
                        .map(|day| Contribution {
                            date: day["date"].as_str().unwrap().to_string(),
                            count: day["contributionCount"].as_i64().unwrap() as i32,
                        })
                })
                .collect();

            Ok(days)
        }
        Err(e) => {
            println!("APIリクエストでエラーが発生しました: {}", e);
            Err("GitHub APIのリクエスト中にエラーが発生しました。".to_string())
        }
    }
}
