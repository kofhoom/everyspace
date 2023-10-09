import { Post } from "@/types";
import axios from "axios";
import { useRouter } from "next/router";
import useSwR from "swr";
export default function PostContentPage() {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSwR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  return <div></div>;
}
