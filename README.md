# Flanker

<img src="https://github.com/Coordinate-Cat/Flanker/blob/develop/src/assets/Flanker_full_logo.svg" alt="Flanker Logo" width="200"/>

|                                   Appearance 1                                   |                                   Appearance 2                                   |
| :------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
| <img src="./src/assets/appearance1.png" alt="Flanker Appearance 1" width="400"/> | <img src="./src/assets/appearance2.png" alt="Flanker Appearance 2" width="400"/> |

![Alt](https://repobeats.axiom.co/api/embed/42a25ba8b65843eba3c9852c3be27de59967a4a0.svg "Repobeats analytics image")

## develop

### issues

[ALL](https://github.com/Coordinate-Cat/Flanker/issues)
[bugs](https://github.com/Coordinate-Cat/Flanker/labels/bug)

### commands

```
npm run tauri dev
npm run format
npm run lint
```

### branches

```
main - production branch
  ⎿ develop - development branch
    ⎿ feature/<issue_number> - feature branches
    ⎿ refactor/<issue_number> - refactor branche
    ⎿ document/<issue_number> - documentation branche
    ⎿ ignore-issues - branch to ignore issues
```

### types

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

## License

<img src="./src/assets/GPLv3Logo.svg" alt="GPLv3 Logo" width="100"/>

This project is licensed under the terms of the GNU General Public License v3.0. See the [LICENSE](./LICENSE) file for details.

## Contributions

We are open to contributions. Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

<a href="https://github.com/Coordinate-Cat/Flanker/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Coordinate-Cat/Flanker" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
