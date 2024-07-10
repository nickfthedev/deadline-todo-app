"use client";

import { Box, Button, Flex, Heading, IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff, LuMenu, LuX } from "react-icons/lu";

export function Sidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarPinned") === "true";
    }
    return false;
  });
  const [innerWidth, setInnerWidth] = useState(800);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setInnerWidth(window.innerWidth);
    if (window.innerWidth >= 1024) {
      const savedPinnedState = localStorage.getItem("sidebarPinned") === "true";
      console.log("Saved State:", savedPinnedState);
      if (savedPinnedState) {
        setIsVisible(true);
        setIsPinned(true);
      } else {
        setIsVisible(false);
        setIsPinned(false);
      }
    } else {
      setIsVisible(false);
      setIsPinned(false);
    }
  };

  // Save pinned state to localStorage whenever it changes
  useEffect(() => {
    console.log("Setting Pinned State:", isPinned);
    localStorage.setItem("sidebarPinned", String(isPinned));
  }, [isPinned]);

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

  if (!hasMounted) {
    return null;
  }

  return (
    <Flex direction="column" className="mr-5">
      <Flex
        direction={"row"}
        className={`${
          isPinned ? "flex-row justify-center items-center" : "absolute "
        } mt-5 ml-2 justify-center items-center`}
        gap={"2"}
      >
        <IconButton
          onClick={() => setIsVisible(!isVisible)}
          className={`${isVisible ? "invisible" : "visible"}
          ${isPinned ? "hidden" : "visible"}
          flex justify-center items-center`}
          color="gray"
          variant="soft"
        >
          <LuMenu />
        </IconButton>
        <Heading size="5">
          <Link href={"/"} className="text-neutral-200">
            Header
          </Link>
        </Heading>
      </Flex>
      <Box
        className={`flex-1 h-full ${isPinned ? "" : "w-10"}`}
        onMouseEnter={handleMouseEnter}
      >
        <Box
          onMouseLeave={handleMouseLeave}
          className={`w-[200px] h-full shadow bg-base-200 z-50 transition-transform duration-300 
          ${
            isVisible
              ? isPinned
                ? "block mt-5"
                : "absolute top-0 left-0 h-[calc(100vh-65px)] transform translate-x-0"
              : "absolute top-0 left-0 h-[calc(100vh-65px)] transform -translate-x-full"
          }
          `}
        >
          <Flex justify="end">
            {innerWidth >= 1024 && (
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
            {innerWidth < 1024 && (
              <IconButton onClick={() => setIsVisible(false)} color="gray">
                <LuX width={20} height={20} />
              </IconButton>
            )}
          </Flex>
          <Flex direction="column" gap={"1"} pt={"2"}>
            {!isPinned && (
              <Flex justify={"center"} mb={"4"} className=" text-center">
                <Heading size="5" align={"center"}>
                  <Link href={"/"} className="text-neutral-200 text-center">
                    Header
                  </Link>
                </Heading>
              </Flex>
            )}
            <Heading className="ml-2 text-sm font-semibold text-base-300">
              Subheader
            </Heading>
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
