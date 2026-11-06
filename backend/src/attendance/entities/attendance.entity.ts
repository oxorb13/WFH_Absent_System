import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity.js';

export enum AttendanceStatus {
  PRESENT = 'present',
  LATE = 'late',
}

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @Column({
    name: 'check_in_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  checkInTime: Date;

  @Column({ name: 'photo_url', type: 'varchar', length: 255 })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @ManyToOne(() => Employee, (employee) => employee.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Relation<Employee>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
