"use client";

import { Box, Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className={`${isVisible ? "hidden" : "block"}`}
      >
        Show Menu
      </Button>
      <Box className="flex-1 bg-red-400" onMouseEnter={handleMouseEnter}>
        <Box className="w-[100px] h-1"></Box>
        <Box
          onMouseLeave={handleMouseLeave}
          className={`w-[200px] h-screen bg-base-200 z-50 ${
            isVisible
              ? isPinned
                ? "block"
                : "absolute top-30 left-0"
              : "hidden"
          }`}
        >
          <Flex justify="end">
            {window.innerWidth >= 1024 && (
              <Button
                onClick={() => {
                  if (isPinned) {
                    setIsVisible(false);
                  }
                  setIsPinned(!isPinned);
                }}
              >
                {isPinned ? "Unpin" : "Pin"}
              </Button>
            )}
            {window.innerWidth < 1024 && (
              <Button onClick={() => setIsVisible(false)}>Hide Menu</Button>
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
