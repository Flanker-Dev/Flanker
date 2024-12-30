use std::process::Command;

#[tauri::command]
pub fn get_spotify_track_info() -> Result<String, String> {
    let check_spotify_running_script = r#"
    if application "Spotify" is running then
        return "running"
    else
        return "not running"
    end if
    "#;

    let check_output = Command::new("osascript")
        .arg("-e")
        .arg(check_spotify_running_script)
        .output()
        .map_err(|e| e.to_string())?;

    let is_running = String::from_utf8_lossy(&check_output.stdout).trim().to_string();

    if is_running != "running" {
        return Err("Spotify is not running.".to_string());
    }

    let script = r#"
    tell application "Spotify"
        if player state is playing then
            set trackName to name of current track
            set artistName to artist of current track
            return trackName & " by " & artistName
        else
            return "Spotify is not playing."
        end if
    end tell
    "#;

    let output = Command::new("osascript")
        .arg("-e")
        .arg(script)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        let result = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(result)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
    }
}
