import { useState, useEffect } from "react";
export const useAudio = () => {
  const [audio, setAudio] = useState(new Audio()); // audio 엘리먼트다
  const [play, setPlay] = useState(false); // 오디오 플레이어의 재생 여부를 나타내는 상태 값이다.
  const [source, setSource] = useState(""); // 재생할 오디오 소스 값이다.

  useEffect(() => {
    setSource("");
    setAudio(new Audio());
  }, []);

  useEffect(() => {
    return () => {
      if (source) {
        URL.revokeObjectURL(source);
      }
    };
  }, [source]);

  useEffect(() => {
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);

  return {
    play,
    audio,
    source,
    toggle: () => setPlay((prev) => !prev),
  };
};
