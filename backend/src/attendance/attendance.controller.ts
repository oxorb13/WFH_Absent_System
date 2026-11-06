import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { AttendanceService } from './attendance.service.js';
import { CheckInDto } from './dto/check-in.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { User, UserRole } from '../users/entities/user.entity.js';
import { AttendanceStatus } from './entities/attendance.entity.js';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const randomSuffix = Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `attendance-${Date.now()}-${randomSuffix}${ext}`);
  },
});

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(
      new BadRequestException(
        'Format foto tidak didukung! Harap unggah file JPG, JPEG, PNG, atau WEBP.',
      ),
      false,
    );
  }
  cb(null, true);
};

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    }),
  )
  async checkIn(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() checkInDto: CheckInDto,
  ) {
    if (!file) {
      throw new BadRequestException('Foto bukti WFH wajib diunggah!');
    }

    if (!user.employee) {
      throw new BadRequestException(
        'Akun Anda tidak terhubung ke profil karyawan manapun.',
      );
    }

    const photoUrl = 'privacy_deleted';
    const result = await this.attendanceService.checkIn(
      user.employee.id,
      photoUrl,
      checkInDto,
    );

    // Kebijakan Privasi: Foto bukti presensi otomatis dihapus dari server setelah presensi tercatat
    if (file?.path) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.warn('Gagal menghapus file foto presensi sementara:', err);
      }
    }

    return result;
  }

  @Get('today')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  async getTodayStatus(@CurrentUser() user: User) {
    if (!user.employee) {
      return { hasCheckedIn: false, attendance: null };
    }
    return this.attendanceService.findTodayCheckIn(user.employee.id);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async getTodayStats() {
    return this.attendanceService.getTodayStats();
  }

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query('employeeId') employeeId?: string,
    @Query('date') date?: string,
    @Query('status') status?: AttendanceStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // If not admin, restrict to own attendance records
    let targetEmployeeId: number | undefined;

    if (user.role === UserRole.ADMIN) {
      targetEmployeeId = employeeId ? parseInt(employeeId, 10) : undefined;
    } else {
      if (!user.employee) {
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }
      targetEmployeeId = user.employee.id;
    }

    return this.attendanceService.findAll({
      employeeId: targetEmployeeId,
      date,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }
}

