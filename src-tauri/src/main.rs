// main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod system_info;
mod window_events;
mod spotify_info;
mod file_handler;
mod app_launcher;
mod image_handler;
mod open_devtools;
mod github; // 追加: githubモジュールをインポート

use system_info::get_system_info;
use window_events::setup_window_event_listeners;
use spotify_info::get_spotify_track_info;
use file_handler::{list_files, read_file, delete_file, write_file};
use app_launcher::open_application;
use image_handler::get_image_path;
use open_devtools::register_open_devtools_shortcut;
use github::get_contributions; // 追加: get_contributionsをインポート

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // Set up window event listeners
            setup_window_event_listeners(window);
            // Register the open DevTools shortcut
            register_open_devtools_shortcut(app);

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
            get_contributions, // 追加: get_contributionsコマンドを追加
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
