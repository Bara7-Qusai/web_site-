"use client";

import { useSyncExternalStore } from "react";

/** Product comparison list, persisted per browser in localStorage. */
export const COMPARE_MAX = 3;
const KEY = "alkunooz:compare";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  if (cache !== null) return cache;
  try {
    cache = window.localStorage.getItem(KEY) ?? "";
  } catch {
    cache = "";
  }
  return cache;
}

function write(slugs: string[]) {
  cache = slugs.join(",");
  try {
    window.localStorage.setItem(KEY, cache);
  } catch {
    /* storage unavailable (private mode) — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCompareList(): string[] {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return raw ? raw.split(",").filter(Boolean) : [];
}

export const compareActions = {
  toggle(slug: string): boolean {
    const list = read().split(",").filter(Boolean);
    if (list.includes(slug)) {
      write(list.filter((s) => s !== slug));
      return true;
    }
    if (list.length >= COMPARE_MAX) return false;
    write([...list, slug]);
    return true;
  },
  remove(slug: string) {
    write(read().split(",").filter((s) => s && s !== slug));
  },
  set(slugs: string[]) {
    write(slugs.slice(0, COMPARE_MAX));
  },
  clear() {
    write([]);
  },
};
