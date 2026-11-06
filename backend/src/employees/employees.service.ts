import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity.js';
import { User, UserRole } from '../users/entities/user.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query?: { search?: string; department?: string; isActive?: number }) {
    const qb = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .orderBy('employee.createdAt', 'DESC');

    if (query?.search) {
      qb.andWhere(
        '(employee.fullName LIKE :search OR employee.employeeCode LIKE :search OR employee.email LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query?.department) {
      qb.andWhere('employee.department = :department', {
        department: query.department,
      });
    }

    if (query?.isActive !== undefined) {
      qb.andWhere('employee.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    const sanitizedData = data.map((emp) => {
      if (emp.user) {
        const { password, ...userWithoutPassword } = emp.user;
        emp.user = userWithoutPassword as User;
      }
      return emp;
    });

    return { data: sanitizedData, total };
  }

  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { user: true, attendances: true },
    });

    if (!employee) {
      throw new NotFoundException(`Karyawan dengan ID ${id} tidak ditemukan`);
    }

    if (employee.user) {
      const { password, ...userWithoutPassword } = employee.user;
      employee.user = userWithoutPassword as User;
    }

    return employee;
  }

  async create(createDto: CreateEmployeeDto) {
    // 1. Check existing employeeCode or email
    const existingCode = await this.employeeRepository.findOne({
      where: { employeeCode: createDto.employeeCode },
    });
    if (existingCode) {
      throw new ConflictException(
        `Kode karyawan (NIP) "${createDto.employeeCode}" sudah terdaftar`,
      );
    }

    const existingEmail = await this.employeeRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingEmail) {
      throw new ConflictException(`Email "${createDto.email}" sudah terdaftar`);
    }

    // 2. Check existing username
    const existingUser = await this.userRepository.findOne({
      where: { username: createDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Username "${createDto.username}" sudah digunakan`,
      );
    }

    // 3. Create User Account
    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const user = this.userRepository.create({
      username: createDto.username,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    });
    const savedUser = await this.userRepository.save(user);

    // 4. Create Employee Profile
    const employee = new Employee();
    employee.userId = savedUser.id;
    employee.employeeCode = createDto.employeeCode;
    employee.fullName = createDto.fullName;
    employee.email = createDto.email;
    employee.phone = createDto.phone ?? null;
    employee.department = createDto.department ?? null;
    employee.position = createDto.position ?? null;
    employee.photoUrl = createDto.photoUrl ?? null;
    employee.joinDate = createDto.joinDate ?? null;
    employee.isActive = 1;

    const savedEmployee = await this.employeeRepository.save(employee);

    return {
      message: 'Karyawan dan akun login berhasil dibuat',
      employee: {
        id: savedEmployee.id,
        employeeCode: savedEmployee.employeeCode,
        fullName: savedEmployee.fullName,
        email: savedEmployee.email,
        department: savedEmployee.department,
        position: savedEmployee.position,
        photoUrl: savedEmployee.photoUrl,
        username: savedUser.username,
      },
    };
  }

  async update(id: number, updateDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    if (updateDto.email && updateDto.email !== employee.email) {
      const existingEmail = await this.employeeRepository.findOne({
        where: { email: updateDto.email },
      });
      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException(
          `Email "${updateDto.email}" sudah digunakan oleh karyawan lain`,
        );
      }
    }

    Object.assign(employee, updateDto);
    await this.employeeRepository.save(employee);

    return {
      message: 'Data karyawan berhasil diperbarui',
      employee,
    };
  }

  async remove(id: number) {
    const employee = await this.findOne(id);
    employee.isActive = employee.isActive === 1 ? 0 : 1;
    await this.employeeRepository.save(employee);

    const statusText =
      employee.isActive === 1 ? 'diaktifkan kembali' : 'dinonaktifkan';
    return {
      message: `Status karyawan ${employee.fullName} berhasil ${statusText}`,
      isActive: employee.isActive,
    };
  }

  async getStats() {
    const total = await this.employeeRepository.count();
    const active = await this.employeeRepository.count({
      where: { isActive: 1 },
    });
    const inactive = total - active;

    return {
      totalEmployees: total,
      activeEmployees: active,
      inactiveEmployees: inactive,
    };
  }
}
