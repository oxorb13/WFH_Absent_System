import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity.js';
import { Employee } from '../employees/entities/employee.entity.js';
import { CheckInDto } from './dto/check-in.dto.js';
import { getStartAndEndOfDay } from '../common/utils/date.util.js';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async checkIn(
    employeeId: number,
    photoUrl: string,
    checkInDto: CheckInDto,
  ) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Data karyawan tidak ditemukan');
    }

    if (employee.isActive === 0) {
      throw new BadRequestException('Status karyawan tidak aktif');
    }

    const today = new Date();
    const { startOfDay, endOfDay } = getStartAndEndOfDay(today);

    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        employeeId: employee.id,
        checkInTime: Between(startOfDay, endOfDay),
      },
    });

    if (existingAttendance) {
      const timeStr = new Date(existingAttendance.checkInTime).toLocaleTimeString('id-ID');
      throw new BadRequestException(
        `Anda sudah melakukan absensi hari ini pada pukul ${timeStr}`,
      );
    }

    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const isLate = currentHour > 9 || (currentHour === 9 && currentMinute > 0);
    const status = isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

    const attendance = new Attendance();
    attendance.employeeId = employee.id;
    attendance.checkInTime = today;
    attendance.photoUrl = photoUrl;
    attendance.notes = checkInDto.notes ?? null;
    attendance.status = status;

    const saved = await this.attendanceRepository.save(attendance);

    return {
      message: 'Absensi WFH berhasil dicatat!',
      attendance: {
        id: saved.id,
        employeeName: employee.fullName,
        employeeCode: employee.employeeCode,
        checkInTime: saved.checkInTime,
        photoUrl: saved.photoUrl,
        notes: saved.notes,
        status: saved.status,
      },
    };
  }

  async findTodayCheckIn(employeeId: number) {
    const { startOfDay, endOfDay } = getStartAndEndOfDay();

    const attendance = await this.attendanceRepository.findOne({
      where: {
        employeeId,
        checkInTime: Between(startOfDay, endOfDay),
      },
      relations: { employee: true },
    });

    return {
      hasCheckedIn: !!attendance,
      attendance: attendance || null,
    };
  }

  async findAll(options: {
    employeeId?: number;
    date?: string;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .orderBy('attendance.checkInTime', 'DESC');

    if (options.employeeId) {
      qb.andWhere('attendance.employeeId = :employeeId', { employeeId: options.employeeId });
    }

    if (options.status) {
      qb.andWhere('attendance.status = :status', { status: options.status });
    }

    if (options.date) {
      qb.andWhere('DATE(attendance.checkInTime) = :date', { date: options.date });
    }

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: { employee: true },
    });

    if (!attendance) {
      throw new NotFoundException(`Data absensi #${id} tidak ditemukan`);
    }

    return attendance;
  }

  async getTodayStats() {
    const { startOfDay, endOfDay } = getStartAndEndOfDay();

    const totalToday = await this.attendanceRepository.count({
      where: { checkInTime: Between(startOfDay, endOfDay) },
    });

    const presentToday = await this.attendanceRepository.count({
      where: {
        checkInTime: Between(startOfDay, endOfDay),
        status: AttendanceStatus.PRESENT,
      },
    });

    const lateToday = await this.attendanceRepository.count({
      where: {
        checkInTime: Between(startOfDay, endOfDay),
        status: AttendanceStatus.LATE,
      },
    });

    return {
      totalToday,
      presentToday,
      lateToday,
    };
  }
}
