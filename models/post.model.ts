export interface Post {
  author: string;
  title: string;
  data: PostContent[];
  references: string[];
}

export interface PostContent {
  type: "title" | "text" | "img";
  content: any;
}
