// window_position.rs

use tauri::Window;

// top_left にウィンドウを移動する関数
#[tauri::command]
pub fn move_window_top_left(window: Window) {
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: 0, y: 0 })).unwrap();
}

// top_right にウィンドウを移動する関数
#[tauri::command]
pub fn move_window_top_right(window: Window) {
    let screen = window.primary_monitor().unwrap();
    let screen_width = screen.as_ref().map_or(0, |s| s.size().width as i32);
    let window_size = window.outer_size().unwrap();
    let window_width = window_size.width as i32;
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: screen_width - window_width, y: 0 })).unwrap();
}

// bottom_left にウィンドウを移動する関数
#[tauri::command]
pub fn move_window_bottom_left(window: Window) {
    let screen = window.primary_monitor().unwrap();
    let screen_height = screen.as_ref().map_or(0, |s| s.size().height as i32);
    let window_size = window.outer_size().unwrap();
    let window_height = window_size.height as i32;
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: 0, y: screen_height - window_height })).unwrap();
}

// bottom_right にウィンドウを移動する関数
#[tauri::command]
pub fn move_window_bottom_right(window: Window) {
    let screen = window.primary_monitor().unwrap();
    let screen_width = screen.as_ref().map_or(0, |s| s.size().width as i32);
    let screen_height = screen.as_ref().map_or(0, |s| s.size().height as i32);
    let window_size = window.outer_size().unwrap();
    let window_width = window_size.width as i32;
    let window_height = window_size.height as i32;
    window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: screen_width - window_width, y: screen_height - window_height })).unwrap();
}
