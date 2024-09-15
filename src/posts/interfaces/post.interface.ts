export interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  categoryId: number;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
}
