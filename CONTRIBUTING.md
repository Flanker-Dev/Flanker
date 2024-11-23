# Contributing to Flanker

## Issues

[ALL](https://github.com/Coordinate-Cat/Flanker/issues)
[bugs](https://github.com/Coordinate-Cat/Flanker/labels/bug)

## Commands

```
npm run tauri dev
npm run format
npm run lint
```

## Branches

```plaintext
main (production)
  ⎿ develop (current default branch)
    ⎿ feature/<issue_number> (feature branch)
    ⎿ refactor/<issue_number> (refactor branch)
    ⎿ document/<issue_number> (document branch)
    ⎿ ignore-issues (ignore issues)
```

## Directory Structure

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

## Types

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

![Alt](https://repobeats.axiom.co/api/embed/42a25ba8b65843eba3c9852c3be27de59967a4a0.svg "Repobeats analytics image")

We are open to contributions. Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

<a href="https://github.com/Coordinate-Cat/Flanker/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Coordinate-Cat/Flanker" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
