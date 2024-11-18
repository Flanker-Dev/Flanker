use std::path::PathBuf;

#[tauri::command]
pub fn get_image_path(filename: &str) -> Result<String, String> {
    let home_dir = std::env::var("HOME").map_err(|_| "Could not get home directory".to_string())?;
    let path = PathBuf::from(format!("{}/.config/flanker/images/{}", home_dir, filename));
    if path.exists() {
        Ok(path.to_string_lossy().to_string())
    } else {
        Err("Image not found".to_string())
    }
}
