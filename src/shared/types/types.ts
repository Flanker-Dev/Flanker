export type Config = {
  sideMenuView: boolean;
  contentBodyView: boolean;
  titlebarView: boolean;
  alwaysOnTopView: boolean;
  isPrivacyMode: boolean;
  fullContentBodyView: boolean;
};

// ja: ブックマークｊのカテゴリーのタイトルとブックマーク情報を持つ
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
        title: string;
        url: string;
        description: string;
        tags: string[];
      }[];
    }[];
  };
};

export interface Bookmark {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export interface FileContent {
  bookmark: {
    bookmarkList: {
      name: string;
      bookmarkInfo: Bookmark[];
    }[];
  };
}
