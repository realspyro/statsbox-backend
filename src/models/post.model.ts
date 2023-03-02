export interface Post {
  author: string;
  title: string;
  data: PostContent[];
  references: string[];
  thumbnail: PostImage;
}

export interface PostImage {
  url: string;
  title: string;
}
export interface PostContent {
  type: "title" | "text" | "img" | "list";
  content: any;
}
