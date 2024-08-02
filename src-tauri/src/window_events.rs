use tauri::Window;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

pub fn setup_window_event_listeners(window: Window) {
    let window = Arc::new(window);
    let is_fullscreen = Arc::new(Mutex::new(false));

    let window_clone = Arc::clone(&window);
    let is_fullscreen_clone = Arc::clone(&is_fullscreen);

    thread::spawn(move || {
        loop {
            let current_fullscreen = window_clone.is_fullscreen().unwrap();
            let mut is_fullscreen_lock = is_fullscreen_clone.lock().unwrap();

            if current_fullscreen != *is_fullscreen_lock {
                *is_fullscreen_lock = current_fullscreen;

                if current_fullscreen {
                    window_clone.emit("fullscreen-entered", true).unwrap();
                } else {
                    window_clone.emit("fullscreen-left", true).unwrap();
                }
            }

            thread::sleep(Duration::from_millis(500));
        }
    });
}
