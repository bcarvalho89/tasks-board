"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "./ui/button";

// The server doesn't know the theme, so the icon only renders after mounting
// to avoid a hydration mismatch.
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

// Three states, so the user can always go back to following the system.
const next = { system: "light", light: "dark", dark: "system" } as const;
const labels = { system: "system", light: "light", dark: "dark" } as const;
const icons = { system: Monitor, light: Sun, dark: Moon } as const;

type Choice = keyof typeof next;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const current: Choice =
    mounted && theme && theme in next ? (theme as Choice) : "system";
  const Icon = icons[current];

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${labels[current]} theme. Switch to ${labels[next[current]]} theme`}
      title={`${labels[current]} theme`}
      className="text-muted-foreground"
      onClick={() => setTheme(next[current])}
    >
      {mounted && <Icon aria-hidden="true" />}
    </Button>
  );
};
