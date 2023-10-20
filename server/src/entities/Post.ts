import { Exclude, Expose } from "class-transformer";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { makeId } from "../utils/helpers";
import Comment from "./Comment";
import BaseEntity from "./Entity";
import Sub from "./Sub";
import { User } from "./User";
import Vote from "./Vote";
import { slugify } from "transliteration"; // 한글명 처리
import { Length } from "class-validator";

@Entity("posts")
export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  priceChoose: string;

  @Length(3, 8, { message: "가격은 최소 100원 이상 입니다." })
  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  musicType: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column({ nullable: true })
  subName: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  musicFileUrn: string;

  @Column({ nullable: true })
  userImage: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
  })
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post, {
    cascade: true,
  })
  votes: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
  }

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : null;
  }

  @Expose()
  get musicFileUrl(): string {
    return this.musicFileUrn
      ? `${process.env.APP_URL}/music/${this.musicFileUrn}`
      : null;
  }

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
