import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";
import BaseEntity from "./Entity";
import { Expose } from "class-transformer";
import Sub from "./Sub";
import Payment from "./Payment";

@Entity("users")
export class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "이메일 주소가 잘못되었습니다." })
  @Length(1, 255, { message: "이메일 주소는 비워둘 수 없습니다." })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: "사용자 이름은 3자 이상이어야 합니다." })
  @Column({ unique: true })
  username: string;

  @Column()
  @Length(6, 255, { message: "비밀번호는 6자리 이상이어야 합니다." })
  password: string;

  @Column({ nullable: true })
  tel: string;

  @Column({ unique: true, nullable: true })
  userImageUrn: string;

  @Column({ nullable: true })
  userBannerUrn: string;

  @Column({ nullable: true })
  isApproved: Boolean;

  @Column("simple-array", { nullable: true })
  approvalRequsts: any[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Sub, (sub) => sub.user)
  sub: Sub[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    cascade: true,
  })
  payment: Payment[];

  @Column({ default: false }) // 거절 당한 사용자 여부
  isRejected: Boolean;

  @Expose()
  get userImageUrl(): string {
    return this.userImageUrn
      ? `${process.env.APP_URL}/images/${this.userImageUrn}`
      : "https://www.gravatar.com/avatar?d=mp&f=y";
  }

  @Expose()
  get userBannerUrl(): string {
    return this.userBannerUrn
      ? `${process.env.APP_URL}/images/${this.userBannerUrn}`
      : null;
  }

  protected userVote: number;
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
