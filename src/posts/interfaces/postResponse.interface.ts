import { Post } from './post.interface';

export interface PostResponse extends Post {
  categoryName: string;
  createdByName: {
    firstname: string;
    lastname: string;
  };
  updatedByName: {
    firstname: string;
    lastname: string;
  };
}
