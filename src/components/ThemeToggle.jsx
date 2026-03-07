import React from "react";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      title="Toggle dark/light mode"
    >
      {theme === "light" ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
    </button>
  );
};

export default ThemeToggle;
