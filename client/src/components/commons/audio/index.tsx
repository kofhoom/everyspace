import { useAuthState } from "@/src/context/auth";
import { formatTime } from "@/utils/helpers";
import { FaStop } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import React, { useRef, useState, useEffect } from "react";

// AudioLayout 컴포넌트 정의
interface AudioProps {
  audioUrl: string;
}

const AudioLayout = ({ audioUrl }: AudioProps) => {
  // useRef를 사용하여 DOM 엘리먼트에 접근
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // 상태 관리를 위한 useState 훅을 사용
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // useAuthState 훅을 사용하여 사용자 인증 상태를 확인
  const { authenticated } = useAuthState();

  useEffect(() => {
    const audio = audioRef.current;

    // audio 엘리먼트에 timeupdate 이벤트 리스너를 추가
    if (audio) {
      audio.addEventListener("timeupdate", () => {
        const { currentTime, duration } = audio;

        // progress 바의 너비를 조절
        if (targetRef.current) {
          targetRef.current.style.width = `${(currentTime / duration) * 100}%`;
        }

        // 현재 재생 시간과 총 재생 시간을 업데이트
        setCurrentTime(currentTime);
        setDuration(duration);

        // 오디오가 끝까지 재생되면 재생을 멈추고 시간을 초기화
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

    // play 상태에 따라 오디오를 재생 또는 일시 정지
    if (audio) {
      if (play) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [play]);

  // 재생/일시정지 버튼 클릭 이벤트 핸들러
  const handleClick = () => {
    setPlay((prevPlay) => !prevPlay);
  };

  // progress 바 관련 이벤트 핸들러
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

      // 클릭한 위치에 따라 오디오의 재생 시간을 업데이트
      if (audioRef.current) {
        audioRef.current.currentTime = ratio * audioRef.current.duration;
      }
    }
  };

  return (
    <div className="mb-3 border border-#e5e7eb rounded p-4 relative">
      {/* 오디오 엘리먼트 */}
      <audio
        controls
        src={audioUrl}
        controlsList="nodownload"
        ref={audioRef}
        hidden
        preload="auto"
      ></audio>

      {/* 플레이/일시정지 버튼과 progress 바 */}
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

      {/* 현재 재생 시간과 총 재생 시간 */}
      <div className="flex justify-between" style={{ paddingLeft: "26px" }}>
        <span className="text-xs font-semibold">{formatTime(currentTime)}</span>
        <span className="text-xs font-semibold">{formatTime(duration)}</span>
      </div>
      {/* 인증되지 않은 사용자에게 보여지는 안내 메시지 */}
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
