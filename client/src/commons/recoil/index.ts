// recoil.js
import { atom } from "recoil";

// admin nav 상태
export const selectedNavState = atom({
  key: "selectedNavState",
  default: "home", // 초기 선택: 'home'
});
