"use client";

import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
} from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPin, LuPinOff, LuMenu, LuX, LuMoreHorizontal } from "react-icons/lu";
import { getServerAuthSession } from "~/server/auth";
import { AddTagDialog } from "./addTagDialog";
import { api } from "~/trpc/react";
import { Tags } from "@prisma/client";
import { EditTagDialog } from "./editTagDialog";
import { ConfirmDeleteTag } from "./confirmDeleteTag";

const SubHeading = ({ title }: { title: string }) => (
  <Flex direction="column" gap={"1"} pt={"2"}>
    <Heading className="ml-2 text-sm font-semibold text-base-300">
      {title}
    </Heading>
  </Flex>
);

const TagLink = ({
  tag,
  onEdit,
  onDelete,
}: {
  tag: Tags;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Link
    className="mr-1 mx-1 p-3 rounded-md items-center flex justify-between hover:bg-link-hover hover:text-white text-sm hover:shadow"
    href={`/timer/?tag=${tag.handle}`}
  >
    {tag.name}
    {tag.handle !== "all" && (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" size={"1"}>
            <LuMoreHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={onEdit}>Edit</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={onDelete} color="red">
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )}
  </Link>
);

export function Sidebar({ loggedIn }: { loggedIn: boolean }) {
  // Data Querys
  const tags = api.tags.getAllTagsByUserID.useQuery();

  // Open, Close, Pin Logic
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarPinned") === "true";
    }
    return false;
  });
  const [innerWidth, setInnerWidth] = useState(800);
  const [hasMounted, setHasMounted] = useState(false);

  // Edit Dialog Control
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTagForEdit, setSelectedTagForEdit] = useState<Tags | null>(
    null
  );
  const handleOpenEditDialog = (tag: Tags) => {
    setSelectedTagForEdit(tag);
    setIsEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => setIsEditDialogOpen(false);

  // Delete Dialog Control
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTagForDelete, setSelectedTagForDelete] = useState<Tags | null>(
    null
  );
  const handleOpenDeleteDialog = (tag: Tags) => {
    setSelectedTagForDelete(tag);
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

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
            <SubHeading title="Navigation" />
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
            {loggedIn && (
              <>
                <SubHeading title="Tags" />
                <TagLink
                  tag={{ id: "all", name: "All", userId: "", handle: "all" }}
                  onEdit={() =>
                    handleOpenEditDialog({
                      id: "all",
                      name: "All",
                      userId: "",
                      handle: "all",
                    })
                  }
                  onDelete={() =>
                    handleOpenDeleteDialog({
                      id: "all",
                      name: "All",
                      userId: "",
                      handle: "all",
                    })
                  }
                />
                {tags.data?.map((tag) => (
                  <>
                    <TagLink
                      key={tag.id}
                      tag={tag}
                      onEdit={() => handleOpenEditDialog(tag)}
                      onDelete={() => handleOpenDeleteDialog(tag)}
                    />
                    {selectedTagForEdit && (
                      <EditTagDialog
                        tag={selectedTagForEdit}
                        isOpen={isEditDialogOpen}
                        onClose={handleCloseEditDialog}
                      />
                    )}
                    {selectedTagForDelete && (
                      <ConfirmDeleteTag
                        tag={selectedTagForDelete}
                        isOpen={isDeleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                      />
                    )}
                  </>
                ))}
                <AddTagDialog />
              </>
            )}
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
