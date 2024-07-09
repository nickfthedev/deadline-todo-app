"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { IconButton } from "@radix-ui/themes";

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div>
      <IconButton
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        variant="soft"
      >
        {theme === "light" ? <FiSun /> : <FiMoon />}
      </IconButton>
    </div>
  );
};

export default ThemeSwitch;
{
  /* <button onClick={() => setTheme("system")} aria-label="System Mode">
        <FiMonitor />
      </button> */
}
