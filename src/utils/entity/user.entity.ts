import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from '../contants';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @Column({ length: 50 })
  email: string;

  @Column()
  password: string;

  @Column('text')
  fullname: string;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ default: '' })
  refresh_token: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;
}
