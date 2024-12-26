use tauri::Window;

#[tauri::command]
pub fn move_window_bottom_left(window: Window) {
    let screen = window.primary_monitor().unwrap();
    let screen_height = screen.as_ref().map_or(0, |s| s.size().height as i32);
    let window_size = window.outer_size().unwrap();
    let window_height = window_size.height as i32;
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: 0, y: screen_height - window_height })).unwrap();
}
