import { User } from "@/types";
import axios from "axios";
import { createContext, useReducer, useContext, useEffect } from "react";

// 상태의 타입을 정의하는 인터페이스
interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

// 액션의 타입과 페이로드를 정의하는 인터페이스
interface Action {
  type: string;
  payload: any;
}

// 상태를 담는 컨텍스트 생성
const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

// 디스패치를 담는 컨텍스트 생성
const DispatchContext = createContext<any>(null);

// 리듀서 함수 정의
const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action ${type}`);
  }
};

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // useReducer를 이용해 상태와 디스패치를 생성
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  // 커스텀 디스패치 함수 생성
  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  // 컴포넌트가 마운트될 때 로그인된 유저 정보를 불러오는 비동기 함수
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("auth/me");
        dispatch("LOGIN", res.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

// 컨텍스트 훅들 정의
export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
