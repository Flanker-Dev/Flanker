#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod system_info;
mod window_events;
mod spotify_info;
mod file_handler;
mod app_launcher;
mod image_handler;
mod open_devtools;
mod github;
mod toggle_maximize;
mod toggle_tight;
mod decrease_height;
mod increase_height;
mod decrease_width;
mod increase_width;
mod move_window_top_left;
mod move_window_top_right;
mod move_window_bottom_left;
mod move_window_bottom_right;

use system_info::get_system_info;
use window_events::setup_window_event_listeners;
use spotify_info::get_spotify_track_info;
use file_handler::{list_files, read_file, delete_file, write_file};
use app_launcher::open_application;
use image_handler::get_image_path;
use open_devtools::register_open_devtools_shortcut;
use github::get_contributions;
use toggle_maximize::toggle_maximize;
use toggle_tight::toggle_tight;
use decrease_height::decrease_height;
use increase_height::increase_height;
use decrease_width::decrease_width;
use increase_width::increase_width;
use move_window_top_left::move_window_top_left;
use move_window_top_right::move_window_top_right;
use move_window_bottom_left::move_window_bottom_left;
use move_window_bottom_right::move_window_bottom_right;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // 他の初期設定
            setup_window_event_listeners(window.clone());
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
            get_contributions,
            toggle_tight,
            decrease_height,
            increase_height,
            toggle_maximize,
            decrease_width,
            increase_width,
            move_window_top_left,
            move_window_top_right,
            move_window_bottom_left,
            move_window_bottom_right,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
