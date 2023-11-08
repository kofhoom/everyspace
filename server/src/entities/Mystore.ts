import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BaseEntity from "./Entity";
import { User } from "./User";
import { Expose } from "class-transformer";

@Entity("mystore")
export default class Mystore extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  @Column({ nullable: true })
  myStoreImageUrn: string;

  @Column({ nullable: true })
  myStoreBannerUrn: string;

  @Expose()
  get myStoreImageUrl(): string {
    return this.myStoreImageUrn
      ? `${process.env.APP_URL}/images/${this.myStoreImageUrn}`
      : "https://www.gravatar.com/avatar?d=mp&f=y";
  }

  @Expose()
  get myStorebannerUrl(): string {
    return this.myStoreBannerUrn
      ? `${process.env.APP_URL}/images/${this.myStoreBannerUrn}`
      : "https://www.gravatar.com/avatar?d=mp&f=y";
  }
}
