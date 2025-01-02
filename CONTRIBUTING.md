# Contributing to Flanker

## Issues

- [All](https://github.com/Flanker-Dev/Flanker/issues)
- [Bugs](https://github.com/Flanker-Dev/Flanker/labels/bug)

## Commands

```sh
npm run tauri dev
npm run format
npm run lint
npm run tauri build

# Generate icon
npm run tauri icon src-tauri/icons/icon.png
```

## Branches (WIP)

```plaintext
main (production)
  ⎿ develop (current default branch)
    ⎿ feature/<issue_number> (feature branch)
    ⎿ refactor/<issue_number> (refactor branch)
    ⎿ document/<issue_number> (document branch)
    ⎿ ignore-issues (ignore issues)
```

## Directory Structure

### src/ (React: Colocation Patterns)

We will adopt the philosophy of colocation patterns as much as possible to determine the directory structure of the tauri application.

```plaintext
src/
  ⎿ assets/ (Images, Docs Images, Logo, etc.)
  ⎿ components/
    ⎿ <component_name>/
      ⎿ <component_name>.tsx
      ⎿ <function_name>.ts (This file contains functions used only in components.)
    ⎿ ui/ (shadcn components)
  ⎿ constants/ (Constants.)
  ⎿ utils/ (Common or utility functions.)
  ⎿ hooks/ (Custom hooks.)
  ⎿ store/ (State management.)
  ⎿ types/ (Typescript types.)
```

### src-tauri/ (Rust: Moduler Monolith)

We will adopt the philosophy of moduler monolith as much as possible to determine the directory structure of the tauri application.

```plaintext
src-tauri/
  ⎿ icons/
  ⎿ src/
      ├── modules/
      │   ├── file_management/
      │   │   ├── mod.rs
      │   │   ├── file_handler.rs
      │   │   ├── image_handler.rs
      │   ├── media/
      │   │   ├── mod.rs
      │   │   ├── spotify_info.rs
      │   │   ├── github.rs
      │   ├── ui/
      │   │   ├── mod.rs
      │   │   ├── toggle_maximize.rs
      │   │   ├── toggle_tight.rs
      │   │   ├── resize/
      │   │       ├── increase_height.rs
      │   │       ├── decrease_height.rs
      │   │       ├── increase_width.rs
      │   │       ├── decrease_width.rs
      │   │   ├── window_position/
      │   │       ├── move_window_top_left.rs
      │   │       ├── move_window_top_right.rs
      │   │       ├── move_window_bottom_left.rs
      │   │       ├── move_window_bottom_right.rs
      │   ├── system/
      │       ├── mod.rs
      │       ├── system_info.rs
      │       ├── open_devtools.rs
      │       ├── window_events.rs
      ├── main.rs
```

## Types (WIP)

```typescript
export type Config = {
  sideMenuView: boolean;
  contentBodyView: boolean;
  titlebarView: boolean;
  alwaysOnTopView: boolean;
  isPrivacyMode: boolean;
  fullContentBodyView: boolean;
};

export type FileConfig = {
  bookmark: [
    {
      title: string;
      bookmarkInfo: [
        {
          title: string;
          url: string;
          description: string;
          tags: string[];
        },
      ];
    },
  ];
};
```

## Contributions

We are open to contributions. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

<a href="https://github.com/Coordinate-Cat/Flanker/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Coordinate-Cat/Flanker" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
