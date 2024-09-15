import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './interfaces/post.interface';
import { PostResponse } from './interfaces/postResponse.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public async findAll(@Query('category') category?: string): Promise<Post[]> {
    return this.postsService.findAll(category);
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostResponse> {
    return this.postsService.findOne(id);
  }
}
