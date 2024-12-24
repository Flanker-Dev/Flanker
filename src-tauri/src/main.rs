#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod system_info;
mod window_events;
mod spotify_info;
mod file_handler;
mod app_launcher;
mod image_handler;
mod open_devtools;
mod github;

use system_info::get_system_info;
use window_events::setup_window_event_listeners;
use spotify_info::get_spotify_track_info;
use file_handler::{list_files, read_file, delete_file, write_file};
use app_launcher::open_application;
use image_handler::get_image_path;
use open_devtools::register_open_devtools_shortcut;
use github::get_contributions;

use tauri::Manager;
use tauri::Window;

#[tauri::command]
fn toggle_maximize(window: Window) {
    if window.is_maximized().unwrap() {
        window.unmaximize().unwrap();
    } else {
        window.maximize().unwrap();
    }
}

#[tauri::command]
fn toggle_tight(window: Window) {
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

#[tauri::command]
fn decrease_height(window: Window) {
    let current_size = window.outer_size().unwrap();
    let scale_factor = window.scale_factor().unwrap();
    window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: current_size.width as f64 / scale_factor,
        height: (current_size.height as f64 / scale_factor - 20.0).max(76.0),
    })).unwrap();
}

#[tauri::command]
fn increase_height(window: Window) {
    let current_size = window.outer_size().unwrap();
    let scale_factor = window.scale_factor().unwrap();
    window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: current_size.width as f64 / scale_factor,
        height: current_size.height as f64 / scale_factor + 20.0,
    })).unwrap();
}

#[tauri::command]
fn decrease_width(window: Window) {
    let current_size = window.outer_size().unwrap();
    let scale_factor = window.scale_factor().unwrap();
    window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: (current_size.width as f64 / scale_factor - 20.0).max(768.0),
        height: current_size.height as f64 / scale_factor,
    })).unwrap();
}

#[tauri::command]
fn increase_width(window: Window) {
    let current_size = window.outer_size().unwrap();
    let scale_factor = window.scale_factor().unwrap();
    let monitor = window.primary_monitor().unwrap().unwrap();
    let monitor_width = monitor.size().width as f64 / scale_factor;
    let new_width = (current_size.width as f64 / scale_factor + 20.0).min(monitor_width);
    window.set_size(tauri::Size::Logical(tauri::LogicalSize {
        width: new_width,
        height: current_size.height as f64 / scale_factor,
    })).unwrap();
}

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
