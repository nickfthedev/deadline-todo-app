"use client";

import { Box, Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Sidebar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Flex direction="column">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className={`${isVisible ? "hidden" : "block"}`}
      >
        Show Menu
      </Button>
      <Box
        className={`w-[200px] h-full bg-gray-950 dark:bg-gray-200 ${
          isVisible ? "block" : "hidden"
        }`}
        style={{ backgroundColor: "var(--gray-2)" }}
      >
        <Flex justify="end">
          <Button onClick={() => setIsVisible(false)}>Hide Menu</Button>
        </Flex>
        <Flex direction="column">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </Flex>
      </Box>
    </Flex>
  );
}
