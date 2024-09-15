import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { slug } from 'src/utils';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class PostsService {
  constructor(private readonly categoriesService: CategoriesService) {}

  public async findAll(categorySlug?: string): Promise<Post[]> {
    if (categorySlug) {
      const category = await this.categoriesService.findOneBySlug(categorySlug);
      return this.posts.filter(el => el.categoryId === category.id);
    }

    return this.posts;
  }

  public async findOne(id: number): Promise<Post> {
    return this.posts.find(el => el.id === id);
  }

  public async create(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const createdAt = new Date();
    const newPost: Post = {
      id: Date.now(),
      createdBy: userId,
      createdAt: createdAt,
      updatedBy: userId,
      updatedAt: createdAt,
      ...createPostDto,
      slug: slug(createPostDto.title),
    };
    this.posts.push(newPost);
    return newPost;
  }

  public async update(
    postId: number,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const oldPost: Post = await this.findOne(postId);
    const modPost: Post = {
      ...oldPost,
      ...updatePostDto,
      updatedBy: userId,
      updatedAt: new Date(),
      slug: slug(updatePostDto.title),
    };
    this.posts = this.posts.map(el => {
      if (el.id === modPost.id) {
        return modPost;
      } else {
        return el;
      }
    });
    return modPost;
  }

  public async delete(id: number): Promise<Post> {
    const deletePost = await this.findOne(id);
    this.posts = this.posts.filter(el => el.id !== deletePost.id);
    return deletePost;
  }

  private posts: Post[] = [
    {
      id: 1,
      title: 'Post 1',
      slug: 'post-1',
      body: 'My first post about JavaScript',
      categoryId: 1,
      createdBy: 1,
      createdAt: new Date(),
      updatedBy: 1,
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Post 2',
      slug: 'post-2',
      body: 'My first post about TypeScript',
      categoryId: 2,
      createdBy: 1,
      createdAt: new Date(),
      updatedBy: 1,
      updatedAt: new Date(),
    },
  ];
}
