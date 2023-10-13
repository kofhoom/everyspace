import { Post } from "@/types";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";

export default function PostCreateList() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImgUrl] = useState("");
  const router = useRouter();
  const { sub: subName, identifier, slug } = router.query;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileInput = (type: string) => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  // 이미지 파일 프리뷰 처리
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const file = event.target.files[0];
    const fileName = URL.createObjectURL(file);
    setImgUrl(fileName);
  };

  // 메모리 누수 방지 - 이미지 업로드 후 Blob URL 해제
  useEffect(() => {
    if (imageUrl) {
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [imageUrl]);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === "" || !subName) return;

    if (fileInputRef.current?.files && fileInputRef.current?.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("type", fileInputRef.current.name);

      try {
        // 이미지 업로드 API 호출
        const { data: postImageUrl } = await axios.post(
          `/posts/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        //post 등록
        const { data: post } = await axios.post<Post>("/posts", {
          title: title.trim(),
          body,
          sub: subName,
          imageUrn: postImageUrl, // Use the image URL directly
        });
        router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
      } catch (error) {}
    }
  };
  return (
    <div className="flex flex-col justify-center pt-16">
      <input
        type="file"
        hidden={true}
        ref={fileInputRef}
        onChange={uploadImage}
      />
      <div className="w-10/12 mx-auto md:w-96 bg-white rounded p-4">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">포스트 생성하기</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <div
                className="h-56"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <button
                className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded"
                onClick={() => openFileInput("post")}
              >
                이미지 등록
              </button>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="제목"
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                style={{ top: 10, right: 10 }}
                className="absolute mb-2 text-sm text-gray-400 select-none"
              >
                {title.trim().length}/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="설명"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
                생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
