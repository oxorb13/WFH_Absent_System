import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity.js';
import { Employee } from '../employees/entities/employee.entity.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedInitialData();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: { employee: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { employee: true },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async seedInitialData(): Promise<void> {
    // 1. Seed Admin User
    const existingAdmin = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('✅ Seeded default admin account: admin / admin123');
    }

    // 2. Seed Sample Employee
    const existingEmployeeUser = await this.userRepository.findOne({
      where: { username: 'karyawan1' },
    });

    if (!existingEmployeeUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const employeeUser = this.userRepository.create({
        username: 'karyawan1',
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
      });
      const savedUser = await this.userRepository.save(employeeUser);

      const employeeProfile = this.employeeRepository.create({
        userId: savedUser.id,
        employeeCode: 'EMP001',
        fullName: 'Budi Santoso',
        email: 'budi.santoso@wfh-app.com',
        phone: '081234567890',
        department: 'IT & Digital Transformation',
        position: 'Software Engineer',
        joinDate: '2024-01-15',
        isActive: 1,
      });
      await this.employeeRepository.save(employeeProfile);
      console.log(
        '✅ Seeded default employee account: karyawan1 / password123 (EMP001 - Budi Santoso)',
      );
    }
  }
}
