#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod system_info;
mod window_events;

use system_info::get_system_info;
use window_events::setup_window_event_listeners;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            setup_window_event_listeners(window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_system_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
