use tauri::Window;

#[tauri::command]
pub fn move_window_top_left(window: Window) {
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: 0, y: 0 })).unwrap();
}
