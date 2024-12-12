export type Config = {
  sideMenuView: boolean;
  contentBodyView: boolean;
  titlebarView: boolean;
  alwaysOnTopView: boolean;
  isPrivacyMode: boolean;
  fullContentBodyView: boolean;
};

// ja: ブックマークのカテゴリーのタイトルとブックマーク情報を持つ
// en: Holds the title of the bookmark category and the bookmark information.
export type FileConfig = {
  bookmark: {
    bookmarkTitle: string;
    bookmarkDescription: string;
    bookmarkTags: string[];
    emoji: string;
    nsfw: boolean;
    createdAt: string;
    updatedAt: string;
    bookmarkList: {
      name: string;
      bookmarkInfo: {
        id: string; // ここにidプロパティを追加
        title: string;
        url: string;
        description: string;
        tags: string[];
      }[];
    }[];
  };
};

export interface Bookmark {
  id: string; // ここにidプロパティを追加
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export interface FileContent {
  bookmark: {
    bookmarkTitle: string;
    bookmarkDescription: string;
    bookmarkTags: string[];
    emoji: string;
    nsfw: boolean;
    createdAt: string;
    updatedAt: string;
    bookmarkList: {
      name: string;
      bookmarkInfo: Bookmark[];
    }[];
  };
}

export interface FileInfo {
  name: string;
  nsfw: boolean;
  emoji: string;
}

export interface OutlineContentComponentProps {
  selectedFileContent: FileContent | null;
}
