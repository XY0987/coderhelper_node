import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity()
export class User {
  // 设置主键id的注解
  @PrimaryGeneratedColumn()
  userId: number;

  // 用户名
  @Column({ unique: true })
  userName: string;

  // 用户邮箱
  @Column({ unique: true })
  useEmail: string;

  // 用户密码
  @Column()
  userPassword: string;

  // 用户个性签名
  @Column()
  useSlogan: number;

  // 用户头像
  @Column()
  userImg: string;

  // 用户权限
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  usePower: UserRole;
}
