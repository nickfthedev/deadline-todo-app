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
    <Flex direction="column" className="mr-5">
      <IconButton
        onClick={() => setIsVisible(!isVisible)}
        className={`${
          isVisible ? "invisible" : "visible"
        } flex justify-center items-center mt-5 ml-2`}
        color="gray"
        variant="soft"
      >
        <LuMenu />
      </IconButton>
      <Box className="flex-1 h-full" onMouseEnter={handleMouseEnter}>
        <Box
          onMouseLeave={handleMouseLeave}
          className={`w-[200px] h-full shadow bg-base-200 z-50 transition-transform duration-300 
          ${
            isVisible
              ? isPinned
                ? "block mt-10"
                : "absolute top-0 left-0 h-[calc(100vh-65px)] transform translate-x-0"
              : "absolute top-0 left-0 h-[calc(100vh-65px)] transform -translate-x-full"
          }
          `}
        >
          <Flex justify="end">
            {window.innerWidth >= 1024 && (
              <IconButton
                color="gray"
                className="mt-1 mr-1"
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
          <Flex direction="column" gap={"1"} pt={"2"}>
            <Link
              className="mr-1 mx-1 p-3 rounded-md hover:bg-link-hover hover:text-white text-sm hover:shadow"
              href="/"
            >
              Home
            </Link>
            <Link
              className="mr-1 mx-1 p-3 rounded-md hover:bg-link-hover hover:text-white text-sm hover:shadow"
              href="/about"
            >
              About
            </Link>
            <Link
              className="mr-1 mx-1 p-3 rounded-md hover:bg-link-hover hover:text-white text-sm hover:shadow"
              href="/contact"
            >
              Contact
            </Link>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
