use tauri::Window;

#[tauri::command]
pub async fn decrease_width(window: Window) {
    tauri::async_runtime::spawn(async move {
        let current_size = window.outer_size().unwrap();
        let scale_factor = window.scale_factor().unwrap(); // scale_factorはウィンドウのスケールファクターを取得します。(スケールファクターは、ウィンドウの表示がどれだけ拡大されているかを示します。)
        // 
        window.set_size(tauri::Size::Logical(tauri::LogicalSize {
            width: (current_size.width as f64 / scale_factor - 20.0).max(768.0),
            height: current_size.height as f64 / scale_factor,
        })).unwrap();
    }).await.unwrap();
}
