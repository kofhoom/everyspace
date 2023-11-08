import { Column, Entity, JoinColumn, ManyToOne, Index } from "typeorm";
import BaseEntity from "./Entity";
import { User } from "./User";

@Entity("payments")
export default class Payment extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: "buyer_name", referencedColumnName: "username" })
  user: User;

  @Column()
  buyer_name: string;

  @Column()
  seller_name: string;

  @Column()
  buyer_music_title: string;

  @Column()
  paid_amount: number;

  @Column()
  buyer_tel: string;

  @Column()
  buyer_email: string;

  @Column()
  pg_provider: string;

  @Column()
  success: boolean;
}
