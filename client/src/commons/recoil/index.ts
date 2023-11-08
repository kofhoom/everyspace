// recoil.js
import { atom } from "recoil";

export const selectedNavState = atom({
  key: "selectedNavState",
  default: "home", // 초기 선택: 'home'
});
