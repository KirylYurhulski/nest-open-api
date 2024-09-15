import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { slug } from 'src/utils';
import { CategoriesService } from 'src/categories/categories.service';
import { UsersService } from 'src/users/users.service';
import { PostResponse } from './interfaces/postResponse.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async findAll(categorySlug?: string): Promise<PostResponse[]> {
    let result: PostResponse[] = [];

    if (categorySlug) {
      const category = await this.categoriesService.findOneBySlug(categorySlug);
      const filteredPosts = this.posts.filter(
        el => el.categoryId === category.id,
      );
      for (let post of filteredPosts) {
        const createdBy = await this.usersService.findOne(post.createdBy);
        const updatedBy = await this.usersService.findOne(post.updatedBy);
        result.push({
          ...post,
          categoryName: category.name,
          createdByName: {
            ...createdBy.name,
          },
          updatedByName: {
            ...updatedBy.name,
          },
        });
      }
    } else {
      for (let post of this.posts) {
        result.push(await this.findOne(post.id));
      }
    }

    return result;
  }

  public async findOne(id: number): Promise<PostResponse> {
    const post = this.posts.find(el => el.id === id);
    const category = await this.categoriesService.findOne(post.categoryId);
    const createdBy = await this.usersService.findOne(post.createdBy);
    const updatedBy = await this.usersService.findOne(post.updatedBy);

    return {
      ...post,
      categoryName: category.name,
      createdByName: {
        ...createdBy.name,
      },
      updatedByName: {
        ...updatedBy.name,
      },
    };
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
      title: 'At nam consequatur ea labore ea harum',
      slug: 'at-nam-consequatur-ea-labore-ea-harum',
      body: 'Cupiditate quo est a modi nesciunt soluta\nipsa voluptas error itaque dicta in\nautem qui minus magnam et distinctio eum\naccusamus ratione error aut',
      categoryId: 1,
      createdBy: 1,
      createdAt: new Date(),
      updatedBy: 1,
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Laboriosam dolor voluptates',
      slug: 'laboriosam-dolor-voluptates',
      body: 'Doloremque ex facilis sit sint culpa\nsoluta assumenda eligendi non ut eius\nsequi ducimus vel quasi\nveritatis est dolores',
      categoryId: 2,
      createdBy: 1,
      createdAt: new Date(),
      updatedBy: 1,
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: 'Ceatae soluta recusandae',
      slug: 'beatae-soluta-recusandae',
      body: 'Dolorem quibusdam ducimus consequuntur dicta aut quo laboriosam\nvoluptatem quis enim recusandae ut sed sunt\nnostrum est odit totam\nsit error sed sunt eveniet provident qui nulla',
      categoryId: 2,
      createdBy: 1,
      createdAt: new Date(),
      updatedBy: 1,
      updatedAt: new Date(),
    },
  ];
}
