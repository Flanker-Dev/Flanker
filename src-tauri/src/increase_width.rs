use tauri::Window;

#[tauri::command]
pub async fn increase_width(window: Window) {
    tauri::async_runtime::spawn(async move {
        let current_size = window.outer_size().unwrap();
        let scale_factor = window.scale_factor().unwrap();
        let monitor = window.primary_monitor().unwrap().unwrap();
        let monitor_width = monitor.size().width as f64 / scale_factor;
        let new_width = (current_size.width as f64 / scale_factor + 20.0).min(monitor_width);
        window.set_size(tauri::Size::Logical(tauri::LogicalSize {
            width: new_width,
            height: current_size.height as f64 / scale_factor,
        })).unwrap();
    }).await.unwrap();
}
