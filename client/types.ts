export interface User {
  username: string;
  email: string;
  userImageUrn: string;
  userImageUrl: string;
  createdAt: string;
  updatedAt: string;
  approvalRequsts: any[];
  isApproved: Boolean;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  postCount?: string;

  imageUrl: string;
  bannerUrl: string;
  subMember: User[];
  subMemberCount: number;
}

export interface Post {
  identifier: string;
  title: string;
  slug: string;
  body: string;
  subName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  sub?: Sub;
  userImage: string;
  url: string;
  userVote?: number;
  voteScore?: number;
  commentCount?: number;
  imageUrl: string;
  imageUrn: string;
  price: number;
  musicType: string;
  priceChoose: string;
  musicFileUrl: string;
  musicFileUrn: string;
  buyername: string;
}

export interface Comment {
  identifier: string;
  body: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  post?: Post;

  userVote: number;
  voteScore: number;
}

export interface Payment {
  buyer_name: string;
  buyer_music_title: string;
  paid_amount: number;
  buyer_tel: string;
  buyer_email: string;
  pg_provider?: Post;
  success: boolean;
}
