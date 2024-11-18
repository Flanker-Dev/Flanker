#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod system_info;
mod window_events;
mod spotify_info;
mod file_handler;
mod app_launcher;
mod image_handler;

use system_info::get_system_info;
use window_events::setup_window_event_listeners;
use spotify_info::get_spotify_track_info;
use file_handler::{list_files, read_file, delete_file, write_file}; // write_fileを追加
use app_launcher::open_application;
use image_handler::get_image_path;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            setup_window_event_listeners(window);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            get_spotify_track_info,
            list_files,
            read_file,
            delete_file,
            write_file,
            open_application,
            get_image_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
