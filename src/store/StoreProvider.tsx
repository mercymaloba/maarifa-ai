"use client";
import { use, useState, type ReactNode } from "react";
import { io } from "next/cache";
import { Provider, useDispatch, useSelector } from "react-redux";
import { makeStore, type AppDispatch, type RootState } from "./store";

export function StoreProvider({ children }: { children: ReactNode }) {
  // Redux initializes internal action identifiers with randomness. Defer that
  // work until request rendering rather than capturing it in the static shell.
  use(io());
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
