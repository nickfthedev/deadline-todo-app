"use client";

import {
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

interface TimerCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  doneMode?: boolean;
  updatedAt?: Date;
  showToast: (message: string) => void;
}

export function TimerCard({
  id,
  title,
  description,
  updatedAt,
  date,
  doneMode = false,
  showToast,
}: TimerCardProps) {
  const utils = api.useUtils();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const mutateDeleteTimer = api.timer.deleteTimer.useMutation({
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
      showToast("Timer deleted successfully");
    },
  });

  const mutateMarkAsDone = api.timer.markAsDone.useMutation({
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
      showToast("Timer marked as done");
    },
  });

  const mutateMarkAsUndone = api.timer.markAsUndone.useMutation({
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
      showToast("Timer marked as undone");
    },
  });

  const handleDeleteTimer = () => {
    mutateDeleteTimer.mutate({ id });
  };

  const handleMarkAsDone = () => {
    mutateMarkAsDone.mutate({ id });
  };

  const handleMarkAsUndone = () => {
    mutateMarkAsUndone.mutate({ id });
  };

  if (!doneMode) {
    useEffect(() => {
      setIsClient(true);
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }, []);
  } else {
    useEffect(() => {
      setIsClient(true);
    }, []);
  }

  if (!isClient) {
    return (
      <Card className="bg-base-300">
        <Flex
          direction={"column"}
          className="w-[350px] h-[150px] justify-center items-center"
        >
          <Heading as="h4" size={"4"}>
            {title}
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
  let isPositive = delta > 0;

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
    <Card className="bg-base-300">
      <EditTimerDialog
        timer={{ id, title, description, date }}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
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
            <DropdownMenu.Item color="red" onSelect={handleDeleteTimer}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
      <Flex
        direction={"column"}
        className="w-[350px] h-[150px] justify-center items-center"
      >
        <Heading as="h4" size={"4"}>
          {title}
        </Heading>
        <Text as="p">{description}</Text>
        <Text
          size={"7"}
          weight={"bold"}
          className={`font-monospace ${
            !doneMode && isNegative
              ? "text-error"
              : !doneMode && days === 0 && weeks === 0 && years === 0
              ? "text-warning"
              : "text-neutral-100"
          } 
          ${doneMode && (years > 0 || weeks > 0 || days > 0) && " text-red-500"}
          ${
            doneMode &&
            !isNegative &&
            years === 0 &&
            weeks === 0 &&
            days === 0 &&
            hours > 1 &&
            " text-warning"
          }
          ${doneMode && isNegative && " text-green-400"}
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
    </Card>
  );
}
