use sysinfo::{System, SystemExt, CpuExt};
use display_info::DisplayInfo;
use serde_json::json;
use std::time::Duration;

#[tauri::command]
pub fn get_system_info() -> String {
    // Create a new system object and refresh all information
    let mut sys = System::new_all();
    sys.refresh_all();

    json!({
        "cpu": get_cpu_info(&sys),
        "total_mem": format_memory(sys.total_memory()),
        "used_mem": format_memory(sys.used_memory()),
        "total_swap": format_memory(sys.total_swap()),
        "used_swap": format_memory(sys.used_swap()),
        "name": sys.name(),
        "kernel": sys.kernel_version(),
        "brand": sys.cpus().get(0).map(|cpu| cpu.brand()),
        "os_version": sys.long_os_version(),
        "host_name": sys.host_name(),
        "uptime": format_uptime(sys.uptime()),
        "display": get_display_info(),
        "mhz": get_display_frequencies(),
    }).to_string()
}

fn get_cpu_info(sys: &System) -> String {
    sys.cpus()
        .iter()
        .enumerate()
        .map(|(i, cpu)| format!("{}: {}%", i + 1, cpu.cpu_usage()))
        .collect::<Vec<String>>()
        .join(", ")
}

fn format_memory(memory: u64) -> String {
    format!("{:.2}GB", memory as f64 / 1024.0 / 1024.0)
}

fn format_uptime(uptime: u64) -> String {
    let duration = Duration::from_secs(uptime);
    format!("{}d {}h {}m",
        duration.as_secs() / 86400,
        duration.as_secs() % 86400 / 3600,
        duration.as_secs() % 3600 / 60)
}

fn get_display_info() -> String {
    DisplayInfo::all()
        .unwrap_or_default()
        .iter()
        .enumerate()
        .map(|(i, info)| format!("{}: {}x{}", i + 1, info.width, info.height))
        .collect::<Vec<String>>()
        .join(", ")
}

fn get_display_frequencies() -> String {
    DisplayInfo::all()
        .unwrap_or_default()
        .iter()
        .enumerate()
        .map(|(i, info)| format!("{}: {}MHz", i + 1, info.frequency))
        .collect::<Vec<String>>()
        .join(", ")
}
