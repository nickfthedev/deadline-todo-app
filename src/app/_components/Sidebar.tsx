"use client";

import { Box, Button, Flex, IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff, LuMenu, LuX } from "react-icons/lu";

export function Sidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsVisible(true);
      setIsPinned(true);
    } else {
      setIsVisible(false);
      setIsPinned(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isPinned && window.innerWidth >= 1024) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    // Not pinned and screen is large, prevent autoclose on mobile we dont want that
    if (!isPinned && window.innerWidth >= 1024) {
      setIsVisible(false);
    }
  };

  return (
    <Flex direction="column">
      <IconButton
        onClick={() => setIsVisible(!isVisible)}
        className={`${
          isVisible ? "hidden" : "block"
        } ml-2 flex justify-center items-center`}
        color="gray"
        variant="soft"
      >
        <LuMenu />
      </IconButton>
      <Box className="flex-1 h-full" onMouseEnter={handleMouseEnter}>
        <Box className="w-[100px] h-1"></Box>
        <Box
          onMouseLeave={handleMouseLeave}
          className={`w-[200px] h-full bg-base-200 z-50 rounded-r-xl
          ${
            isVisible
              ? isPinned
                ? "block"
                : "absolute top-30 left-0 h-[calc(100vh-65px)]"
              : "hidden"
          }`}
        >
          <Flex justify="end">
            {window.innerWidth >= 1024 && (
              <IconButton
                color="gray"
                onClick={() => {
                  if (isPinned) {
                    setIsVisible(false);
                  }
                  setIsPinned(!isPinned);
                }}
              >
                {isPinned ? <LuPinOff /> : <LuPin />}
              </IconButton>
            )}
            {window.innerWidth < 1024 && (
              <IconButton onClick={() => setIsVisible(false)} color="gray">
                <LuX width={20} height={20} />
              </IconButton>
            )}
          </Flex>
          <Flex direction="column">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
