import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Employee } from '../employees/entities/employee.entity.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

