import multer, { FileFilterCallback } from "multer";
import path from "path";

// 주어진 문자열에서 슬러그를 생성하는 함수
export const slugify = function (str: string): string {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // 강세 기호 제거, ñ을 n으로 교체 등
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // 유효하지 않은 문자 제거
    .replace(/\s+/g, "-") // 공백 축소 및 -로 교체
    .replace(/-+/g, "-"); // 대시 축소

  return str;
};

// 특정 길이의 무작위 ID를 생성하는 함수
export function makeId(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 에러 형식 맵핑
// 유효성 검사 오류를 더 읽기 쉬운 형식으로 매핑하는 함수
export const mapError = (errors: Object[]): Object[] => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

// 이미지 저장
// 이미지 업로드를 위한 multer 미들웨어 구성
export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(10);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      callback(new Error("이미지가 아닙니다."));
    }
  },
});

// 음악 저장
// 음악 파일 업로드를 위한 multer 미들웨어 구성
export const uploadMusic = multer({
  storage: multer.diskStorage({
    destination: "public/music",
    filename: (_, file, callback) => {
      const name = makeId(10);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/wav") {
      callback(null, true);
    } else {
      callback(new Error("음원파일이 아닙니다."));
    }
  },
});

// 현재 날짜와 주어진 타임스탬프 간의 시간 차이를 계산하는 함수
export function timeForToday(value: string) {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
}

// 임시 비밀번호를 생성하는 함수
export const generateTemporaryPassword = () => {
  // Math.random()을 사용하여 임시 비밀번호 생성
  return Math.random().toString(36).substring(7);
};
