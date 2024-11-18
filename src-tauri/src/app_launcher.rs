// src-tauri/src/app_launcher.rs
use std::process::Command;
use std::process::Stdio;

#[tauri::command]
pub fn open_application(app_path: String) -> Result<(), String> {
    let child = Command::new(app_path)
        .stdout(Stdio::null())  // 標準出力を無効化
        .stderr(Stdio::null())  // 標準エラー出力を無効化
        .spawn();

    match child {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Failed to launch application: {}", err)),
    }
}
