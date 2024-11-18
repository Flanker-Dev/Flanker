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

```
main - production branch
  ⎿ develop - development branch
    ⎿ feature/<issue_number> - feature branches
    ⎿ refactor/<issue_number> - refactor branche
    ⎿ document/<issue_number> - documentation branche
    ⎿ ignore-issues - branch to ignore issues
```

## Types

```
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
