use std::fs;
use std::path::Path;
use tauri::api::path::home_dir;

#[derive(serde::Serialize)]  // 構造体をシリアライズ可能にする
pub struct FileInfo {  // `pub` を追加して公開
    pub name: String,  // フィールドも公開
    pub is_dir: bool,  // フィールドも公開
}

#[tauri::command]
pub fn list_files(dir_path: Option<String>) -> Result<(String, Vec<FileInfo>), String> {
    let dir_path = dir_path.unwrap_or_else(|| {
        home_dir()
            .unwrap_or_else(|| Path::new("/").to_path_buf())
            .to_string_lossy()
            .to_string()
    });

    let path = Path::new(&dir_path);
    if path.is_dir() {
        let entries = fs::read_dir(path).map_err(|e| e.to_string())?;
        let mut file_list = Vec::new();
        for entry in entries {
            let entry = entry.map_err(|e| e.to_string())?;
            let file_name = entry.file_name().into_string().map_err(|e| e.to_string_lossy().to_string())?;
            let is_dir = entry.path().is_dir();  // フォルダかどうかをチェック
            file_list.push(FileInfo { name: file_name, is_dir });
        }
        Ok((dir_path, file_list))  // 現在のパスとファイルリストを返す
    } else {
        Err("指定されたパスはディレクトリではありません".to_string())
    }
}

#[tauri::command]
pub fn read_file(file_path: String) -> Result<String, String> {
    let path = Path::new(&file_path);
    if path.is_file() {
        fs::read_to_string(path).map_err(|e| {println!("ファイルの読み込みエラー: {}", e); e.to_string()})
    } else {
        Err("指定されたパスはファイルではありません".to_string())
    }
}

#[tauri::command]
pub fn write_file(file_path: String, contents: String) -> Result<(), String> {
    fs::write(file_path, contents).map_err(|err| err.to_string())
}

// deleteFile関数を追加
#[tauri::command]
pub fn delete_file(file_path: String) -> Result<(), String> {
    let path = Path::new(&file_path);
    if path.is_file() {
        fs::remove_file(path).map_err(|e| {println!("ファイルの削除エラー: {}", e); e.to_string()})
    } else {
        Err("指定されたパスはファイルではありません".to_string())
    }
}
