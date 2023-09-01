import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Blue Montain',
      brand: 'Blue',
      flavors: ['vanillia', 'chocolate'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((item) => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`coffee ${id} not exists`);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: string, updateCoffeeDto: any) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    this.coffees[coffeeIndex] = {
      ...this.coffees[coffeeIndex],
      ...updateCoffeeDto,
    };
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex > 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
