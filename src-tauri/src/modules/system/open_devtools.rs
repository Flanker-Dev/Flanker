use tauri::{App, GlobalShortcutManager, Manager};

/// open DevTools shortcut
pub fn register_open_devtools_shortcut(app: &mut App) {
    let app_handle = app.handle();
    let mut shortcut_manager = app_handle.global_shortcut_manager();

    shortcut_manager
        .register("CmdOrCtrl+Alt+I", move || {
            if let Some(_main_window) = app_handle.get_window("main") {
                // when the app is built in debug mode, toggle DevTools
                #[cfg(debug_assertions)]
                {
                    if _main_window.is_devtools_open() {
                        _main_window.close_devtools();
                    } else {
                        _main_window.open_devtools();
                    }
                }
            }
        })
        .expect("Failed to register global shortcut");
}
