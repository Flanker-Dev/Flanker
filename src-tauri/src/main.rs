#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod modules;

use modules::file_management::{file_handler, image_handler};
use modules::media::{spotify_info, github};
use modules::ui::{
    toggle_maximize,
    toggle_tight,
    resize::{increase_width, decrease_width, increase_height, decrease_height},
    window_position::{
        move_window_top_left, move_window_top_right, move_window_bottom_left, move_window_bottom_right,
    },
};
use modules::system::{system_info, open_devtools, window_events};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            // 初期設定
            window_events::setup_window_event_listeners(window.clone());
            open_devtools::register_open_devtools_shortcut(app);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            system_info::get_system_info,
            spotify_info::get_spotify_track_info,
            file_handler::list_files,
            file_handler::read_file,
            file_handler::delete_file,
            file_handler::write_file,
            image_handler::get_image_path,
            github::get_contributions,
            toggle_tight::toggle_tight,
            toggle_maximize::toggle_maximize,
            increase_width::increase_width,
            decrease_width::decrease_width,
            increase_height::increase_height,
            decrease_height::decrease_height,
            move_window_top_left::move_window_top_left,
            move_window_top_right::move_window_top_right,
            move_window_bottom_left::move_window_bottom_left,
            move_window_bottom_right::move_window_bottom_right,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
