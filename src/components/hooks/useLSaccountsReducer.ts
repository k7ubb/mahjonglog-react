import { useReducer } from "react";

export type LSaccount = {
  email: string;
  password: string;
};

export type LSaccountsReducer =
  | { type: "add"; value: LSaccount }
  | { type: "delete"; value: LSaccount };

// 保持しているイベント情報を更新する
const reducer = (state: any, action: LSaccountsReducer) => {
  switch (action.type) {
    case "add": {
      if (!state.find((x:any) => x.email === action.value.email)) {
        const result = [ ...state, action.value ];
        localStorage.setItem("accounts", JSON.stringify(result));
        return result;
      } else {
        return state;
      }
    }
    case "delete": {
      const result = state.filter((x:any) => x.email !== action.value.email);
      localStorage.setItem("accounts", JSON.stringify(result));
      return result;
    }
    default:
      return state;
  }
};

// diaglogで表示/編集するイベント情報を管理する
export const useLSaccountsReducer = () => {
  const [LSaccounts, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem("accounts") || "[]"));
  return {
    LSaccounts,
    dispatch
  };
};
