import { useAuthState } from "@/src/context/auth";
import { formatTime } from "@/utils/helpers";
import React, { useRef, useState, useEffect } from "react";
import { FaStop } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";

interface AudioProps {
  audioUrl: string;
}

const AudioLayout = ({ audioUrl }: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { authenticated } = useAuthState();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", () => {
        const { currentTime, duration } = audio;
        if (targetRef.current) {
          targetRef.current.style.width = `${(currentTime / duration) * 100}%`;
        }
        setCurrentTime(currentTime);
        setDuration(duration);
        if (currentTime === duration && targetRef.current) {
          // 현재 시간이 총 시간과 같다면 재생을 멈춤.
          setPlay(false);
          targetRef.current.style.width = `0%`;
          setCurrentTime(0);
        }
      });
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      if (play) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [play]);

  const handleClick = () => {
    setPlay((prevPlay) => !prevPlay);
  };

  const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    targetRef.current?.classList.add("dragging");
    timeHandler(event);
  };

  const mouseUpHandler = () => {
    targetRef.current?.classList.remove("dragging");
  };

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (targetRef.current?.classList.contains("dragging")) {
      timeHandler(event);
    }
  };

  const timeHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const fullWidth = progressRef.current.clientWidth;
      const offsetX =
        event.pageX - progressRef.current.getBoundingClientRect().left;
      const ratio = offsetX / fullWidth;
      if (audioRef.current) {
        audioRef.current.currentTime = ratio * audioRef.current.duration;
      }
    }
  };

  return (
    <div className="mb-3 border border-#e5e7eb rounded p-4 relative">
      <audio
        controls
        src={audioUrl}
        controlsList="nodownload"
        ref={audioRef}
        hidden
        preload="auto"
      ></audio>
      <div className="flex items-center">
        <button onClick={handleClick}>
          {play ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
        </button>
        <div
          className="w-full bg-gray-100 h-2 relative cursor-pointer rounded"
          ref={progressRef}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
          onMouseMove={mouseMoveHandler}
        >
          <div
            id="progress"
            className="bg-orange-400 h-2"
            style={{ width: "fit-content" }}
            ref={targetRef}
          ></div>
        </div>
      </div>
      <div className="flex justify-between" style={{ paddingLeft: "26px" }}>
        <span className="text-xs font-semibold">{formatTime(currentTime)}</span>
        <span className="text-xs font-semibold">{formatTime(duration)}</span>
      </div>
      {!authenticated && (
        <div className="absolute top-0 left-0 bg-gray-300 bg-opacity-50  h-full w-full flex justify-center items-center">
          <p className="font-medium text-sm text-gray-500">
            로그인 후 이용 가능합니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioLayout;
