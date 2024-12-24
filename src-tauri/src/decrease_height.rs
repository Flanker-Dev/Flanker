// main.rs
use tauri::Window;

#[tauri::command]
pub async fn decrease_height(window: Window) {
    tauri::async_runtime::spawn(async move {
        let current_size = window.outer_size().unwrap();
        let scale_factor = window.scale_factor().unwrap();
        window.set_size(tauri::Size::Logical(tauri::LogicalSize {
            width: current_size.width as f64 / scale_factor,
            height: (current_size.height as f64 / scale_factor - 20.0).max(76.0),
        })).unwrap();
    }).await.unwrap();
}
