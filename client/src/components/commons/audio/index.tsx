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
        if (currentTime === duration) {
          // 현재 시간이 총 시간과 같다면 재생을 멈춤.
          setPlay(false);
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

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div>
      <audio
        controls
        src={audioUrl}
        controlsList="nodownload"
        ref={audioRef}
        hidden
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
      <div className="flex justify-between">
        <span className="text-sm font-semibold">{formatTime(currentTime)}</span>
        <span className="text-sm font-semibold">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioLayout;
