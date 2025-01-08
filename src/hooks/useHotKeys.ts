import { useState, useEffect } from "react";
import type { ActionType, Hotkey, electronAPI } from "../types";

export default function useHotKeys() {
  // 1. Declara la función antes
  function getActionFunction(action: ActionType) {
    switch (action) {
      case "ArrowLeft":
        return () =>
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft" })
          );
      case "ArrowRight":
        return () =>
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight" })
          );
      case "ArrowUp5Times":
        return () => {
          for (let i = 0; i < 5; i++)
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "ArrowUp" })
            );
        };
      case "ArrowDown5Times":
        return () => {
          for (let i = 0; i < 5; i++)
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "ArrowDown" })
            );
        };
      case "Space":
        return () => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
        };
      default:
        return () => {};
    }
  }

  // 2. Luego usa la función en el reduce
  const keys: { key: string; action: ActionType }[] = [
    { key: "o", action: "ArrowLeft" },
    { key: "p", action: "ArrowRight" },
    { key: "a", action: "ArrowUp5Times" },
    { key: "b", action: "ArrowDown5Times" },
    { key: "k", action: "Space" },
  ];
  const keysMap = keys.reduce((map, { key, action }) => {
    map[key] = getActionFunction(action);
    return map;
  }, {} as { [key: string]: () => void });

  return (pressedKey: string) => {
    const func = keysMap[pressedKey];
    if (func) func();
  };
}
