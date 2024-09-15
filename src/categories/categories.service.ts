import { Injectable } from '@nestjs/common';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { slug } from 'src/utils';

@Injectable()
export class CategoriesService {
  public async findAll(): Promise<Category[]> {
    return this.categories;
  }

  public async findOne(id: number): Promise<Category> {
    return this.categories.find(el => el.id === id);
  }

  public async findOneBySlug(slug: string): Promise<Category> {
    return this.categories.find(el => el.slug === slug.trim());
  }

  public async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory: Category = {
      id: Date.now(),
      ...createCategoryDto,
      slug: slug(createCategoryDto.name),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  public async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const oldCategory: Category = await this.findOne(id);
    const modCategory: Category = {
      ...oldCategory,
      ...updateCategoryDto,
      slug: slug(updateCategoryDto.name),
    };
    this.categories = this.categories.map(el => {
      if (el.id === modCategory.id) {
        return modCategory;
      } else {
        return el;
      }
    });
    return modCategory;
  }

  private categories: Category[] = [
    {
      id: 1,
      name: 'JavaScript',
      slug: 'javascript',
    },
    {
      id: 2,
      name: 'TypeScript',
      slug: 'typescript',
    },
    {
      id: 3,
      name: 'React JS',
      slug: 'react-js',
    },
    {
      id: 4,
      name: 'React Redux',
      slug: 'react-redux',
    },
    {
      id: 5,
      name: 'Node JS',
      slug: 'node-js',
    },
  ];
}
