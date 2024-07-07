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
  showToast: (message: string) => void;
}

export function TimerCard({
  id,
  title,
  description,
  date,
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

  const handleDeleteTimer = () => {
    mutateDeleteTimer.mutate({ id });
  };

  const handleMarkAsDone = () => {
    mutateMarkAsDone.mutate({ id });
  };

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return (
      <Card>
        <Flex
          direction={"column"}
          style={{
            width: "350px",
            height: "150px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Heading as="h4" size={"4"}>
            {title}
          </Heading>
          <Text as="p">{description}</Text>
          <Text
            size={"7"}
            weight={"bold"}
            style={{
              fontFamily: "monospace",
            }}
          >
            Loading...
          </Text>
        </Flex>
      </Card>
    );
  }

  const delta = date.getTime() - currentTime.getTime();
  const isNegative = delta < 0;
  const absDelta = Math.abs(delta);

  const years = Math.floor(absDelta / (1000 * 60 * 60 * 24 * 365));
  const weeks = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 7)
  );
  const days = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
  );
  const hours = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((absDelta % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDelta % (1000 * 60)) / 1000);

  return (
    <Card>
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
            <DropdownMenu.Item onSelect={handleOpenDialog}>
              Edit
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={handleMarkAsDone}>
              Mark as Done
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red" onSelect={handleDeleteTimer}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
      <Flex
        direction={"column"}
        style={{
          width: "350px",
          height: "150px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading as="h4" size={"4"}>
          {title}
        </Heading>
        <Text as="p">{description}</Text>
        <Text
          size={"7"}
          weight={"bold"}
          style={{
            fontFamily: "monospace",
            color: isNegative ? "red" : "inherit",
          }}
        >
          {isNegative && "-"}
          {years > 0 && <Text>{years}Y:</Text>}
          {weeks > 0 && <Text>{weeks}W:</Text>}
          {days > 0 && <Text>{days}D:</Text>}
          <Text>{hours.toString().padStart(2, "0")}H:</Text>
          <Text>{minutes.toString().padStart(2, "0")}M:</Text>
          <Text>{seconds.toString().padStart(2, "0")}S</Text>
        </Text>
      </Flex>
    </Card>
  );
}
