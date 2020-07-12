export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  value: string;
  image: string;
  tags?: Tag[];
  parentpost?: string;
}
