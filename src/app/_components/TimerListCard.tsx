"use client";

import {
  AlertDialog,
  Badge,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { EditTimerDialog } from "./editTimerDialog";
import { api } from "~/trpc/react";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
}

interface TimerCardProps {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  doneMode?: boolean;
  updatedAt?: Date;
  tags: Tag[];
  showToast: (message: string) => void;
}

export function TimerListCard({
  id,
  title,
  description,
  updatedAt,
  date,
  doneMode = false,
  showToast,
  tags,
}: TimerCardProps) {
  const utils = api.useUtils();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  // Edit Dialog Control
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  // Delete Dialog Control
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const handleOpenDeleteDialog = () => setIsDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const mutateDeleteTimer = api.timer.deleteTimer.useMutation({
    onSuccess: async () => {
      await utils.timer.getAllTimersByUserID.invalidate();
      showToast("Timer deleted successfully");
    },
  });

  const mutateMarkAsDone = api.timer.markAsDone.useMutation({
    onSuccess: async () => {
      await utils.timer.getAllTimersByUserID.invalidate();
      showToast("Timer marked as done");
    },
  });

  const mutateMarkAsUndone = api.timer.markAsUndone.useMutation({
    onSuccess: async () => {
      await utils.timer.getAllTimersByUserID.invalidate();
      showToast("Timer marked as undone");
    },
  });

  const handleDeleteTimer = () => {
    mutateDeleteTimer.mutate(
      { id },
      {
        onError: (error) => {
          console.error("Error deleting timer:", error);
          showToast("Failed to delete timer");
        },
      }
    );
  };

  const handleMarkAsDone = () => {
    mutateMarkAsDone.mutate(
      { id },
      {
        onError: (error) => {
          console.error("Error marking timer as done:", error);
          showToast("Failed to mark timer as done");
        },
      }
    );
  };

  const handleMarkAsUndone = () => {
    mutateMarkAsUndone.mutate(
      { id },
      {
        onError: (error) => {
          console.error("Error marking timer as undone:", error);
          showToast("Failed to mark timer as undone");
        },
      }
    );
  };

  useEffect(() => {
    setIsClient(true);
    if (!doneMode) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [doneMode]);

  if (!isClient) {
    return (
      <Card className="bg-base-300">
        <Flex
          direction={"column"}
          className="w-[350px] h-[150px] justify-center items-center"
        >
          <Heading as="h4" size={"4"}>
            {title.length > 40 ? `${title.slice(0, 40)}...` : title}
          </Heading>
          <Text as="p">{description}</Text>
          <Text size={"7"} weight={"bold"} className="font-monospace">
            Loading...
          </Text>
        </Flex>
      </Card>
    );
  }

  const delta = date.getTime() - currentTime.getTime();
  const absDelta = Math.abs(delta);
  let isNegative = delta < 0;

  let years = Math.floor(absDelta / (1000 * 60 * 60 * 24 * 365));
  let weeks = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 7)
  );
  let days = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
  );
  let hours = Math.floor((absDelta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((absDelta % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((absDelta % (1000 * 60)) / 1000);

  // Calc the delta between updatedat and time when in done mode
  if (doneMode && updatedAt) {
    const updatedDelta = updatedAt.getTime() - date.getTime();
    const updatedAbsDelta = Math.abs(updatedDelta);
    isNegative = updatedDelta < 0;

    years = Math.floor(updatedAbsDelta / (1000 * 60 * 60 * 24 * 365));
    weeks = Math.floor(
      (updatedAbsDelta % (1000 * 60 * 60 * 24 * 365)) /
        (1000 * 60 * 60 * 24 * 7)
    );
    days = Math.floor(
      (updatedAbsDelta % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
    );
    hours = Math.floor(
      (updatedAbsDelta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    minutes = Math.floor((updatedAbsDelta % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((updatedAbsDelta % (1000 * 60)) / 1000);
  }

  return (
    <Card className="bg-base-300 w-full p-4">
      <EditTimerDialog
        timer={{ id, title, description, date }}
        tags={tags}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      <Flex
        direction={"row"}
        justify={"between"}
        className="w-full h-[75px]"
        gap={"2"}
      >
        <Flex direction={"column"} gap={"2"} className=" w-7/12">
          <Flex gap={"1"} direction={"row"}>
            {tags.map((tag) => (
              <Badge key={tag.id} size="1" color="indigo">
                {tag.name}
              </Badge>
            ))}
          </Flex>
          <Heading as="h4" size={"4"}>
            <Link href={`/timer/${id}`}>
              {title.length > 40 ? `${title.slice(0, 40)}...` : title}
            </Link>
          </Heading>
          <Text as="p" className="text-sm">
            {typeof description === "string" && description.length > 50
              ? `${description.slice(0, 50)}...`
              : typeof description === "string"
              ? description.split("\n")[0]?.slice(0, 50) ?? description
              : ""}
          </Text>
        </Flex>
        <Flex direction={"column"} gap={"2"} align={"start"} className="w-5/12">
          <Text
            size={"6"}
            weight={"bold"}
            className={` rounded-xl bg-base-300 p-2 font-monospace ${
              !doneMode && isNegative
                ? "text-error"
                : !doneMode && days === 0 && weeks === 0 && years === 0
                ? "text-warning"
                : "text-neutral-100"
            }
          ${
            doneMode &&
            !isNegative &&
            (years > 0 || weeks > 0 || days > 0) &&
            " text-red-500"
          }
          ${
            doneMode &&
            !isNegative &&
            years === 0 &&
            weeks === 0 &&
            days === 0 &&
            hours > 1 &&
            " text-warning"
          }
          ${doneMode && isNegative && " text-green-500"}
          `}
          >
            {isNegative && "-"}
            {years > 0 && <Text>{years}Y:</Text>}
            {weeks > 0 && <Text>{weeks}W:</Text>}
            {days > 0 && <Text>{days}D:</Text>}
            <Text>{hours.toString().padStart(2, "0")}H:</Text>
            <Text>{minutes.toString().padStart(2, "0")}M:</Text>
            <Text>{seconds.toString().padStart(2, "0")}S</Text>
          </Text>
          <Flex direction={"column"}>
            <Text size={"1"} className="opacity-50 font-semibold">
              Due: {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </Text>
            {doneMode && (
              <Text size={"1"} className="opacity-50 font-semibold">
                Done: {updatedAt?.toLocaleDateString()} at{" "}
                {updatedAt?.toLocaleTimeString()}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex justify={"end"}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="ghost">
                <FiMoreHorizontal size={"20"} color="gray" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {!doneMode && (
                <DropdownMenu.Item onSelect={handleOpenDialog}>
                  Edit
                </DropdownMenu.Item>
              )}
              {!doneMode && (
                <DropdownMenu.Item onSelect={handleMarkAsDone}>
                  Mark as Done
                </DropdownMenu.Item>
              )}
              {doneMode && (
                <DropdownMenu.Item onSelect={handleMarkAsUndone}>
                  Mark as Undone
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Separator />
              <DropdownMenu.Item color="red" onSelect={handleOpenDeleteDialog}>
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>

      <AlertDialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={handleCloseDeleteDialog}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete Tag</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This tag will be deleted and any timers associated
            with it will be untagged.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleDeleteTimer}>
                Delete Tag
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Card>
  );
}
