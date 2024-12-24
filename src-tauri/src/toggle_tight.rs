use tauri::Window;

#[tauri::command]
pub fn toggle_tight(window: Window) {
    let current_size = window.inner_size().unwrap();
    let scale_factor = window.scale_factor().unwrap();
    let new_size = if current_size.height == 76 {
        tauri::Size::Logical(tauri::LogicalSize {
            width: current_size.width as f64 / scale_factor,
            height: 96.0,
        })
    } else {
        tauri::Size::Logical(tauri::LogicalSize {
            width: 768.0,
            height: 76.0,
        })
    };
    window.set_size(new_size).unwrap();
}
