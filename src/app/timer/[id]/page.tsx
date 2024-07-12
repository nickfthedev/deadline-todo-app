"use client";

import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { EditTimerDialog } from "~/app/_components/editTimerDialog";
import { ToastComponent } from "~/app/_components/toast";
import { api } from "~/trpc/react";

export default function TimerDetails() {
  // Data fetching
  const { id } = useParams();
  const { data: timer, isLoading } = api.timer.getTimerByTimerID.useQuery({
    id: id as string,
  });

  const utils = api.useUtils();

  // Toast handling
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

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
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
      utils.timer.getTimerByTimerID.invalidate();
      showToast("Timer deleted successfully");
    },
  });

  const mutateMarkAsDone = api.timer.markAsDone.useMutation({
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
      utils.timer.getTimerByTimerID.invalidate();
      showToast("Timer marked as done");
    },
  });

  const mutateMarkAsUndone = api.timer.markAsUndone.useMutation({
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
      utils.timer.getTimerByTimerID.invalidate();
      showToast("Timer marked as undone");
    },
  });

  const handleDeleteTimer = () => {
    mutateDeleteTimer.mutate({ id: timer?.id || "" });
  };

  const handleMarkAsDone = () => {
    mutateMarkAsDone.mutate({ id: timer?.id || "" });
  };

  const handleMarkAsUndone = () => {
    mutateMarkAsUndone.mutate({ id: timer?.id || "" });
  };

  if (!timer?.done) {
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

  // Return early if loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Return early if timer not found
  if (!timer) {
    return <div>Timer not found</div>;
  }

  // Calculate the delta
  const delta = timer.date.getTime() - currentTime.getTime();
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
  if (timer.done && timer.updatedAt) {
    const updatedDelta = timer.updatedAt.getTime() - timer.date.getTime();
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
      <ToastComponent
        toastOpen={toastOpen}
        setToastOpen={setToastOpen}
        toastMessage={toastMessage}
      />
      <EditTimerDialog
        timer={timer}
        tags={timer.tags}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />

      <Flex justify={"between"}>
        <Flex gap={"1"} direction={"row"}>
          {timer.tags.map((tag) => (
            <Badge key={tag.id} size="1" color="indigo">
              {tag.name}
            </Badge>
          ))}
        </Flex>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost">
              <FiMoreHorizontal size={"20"} color="gray" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {!timer.done && (
              <DropdownMenu.Item onSelect={handleOpenDialog}>
                Edit
              </DropdownMenu.Item>
            )}
            {!timer.done && (
              <DropdownMenu.Item onSelect={handleMarkAsDone}>
                Mark as Done
              </DropdownMenu.Item>
            )}
            {timer.done && (
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
      <Flex
        direction={"column"}
        className="w-[350px] h-[150px] justify-center items-center"
      >
        <Heading as="h4" size={"4"}>
          {timer.title}
        </Heading>
        <Text as="p">{timer.description}</Text>
        <Text
          size={"7"}
          weight={"bold"}
          className={`font-monospace ${
            !timer.done && isNegative
              ? "text-error"
              : !timer.done && days === 0 && weeks === 0 && years === 0
              ? "text-warning"
              : "text-neutral-100"
          } 
          ${
            timer.done &&
            !isNegative &&
            (years > 0 || weeks > 0 || days > 0) &&
            " text-red-500"
          }
          ${
            timer.done &&
            !isNegative &&
            years === 0 &&
            weeks === 0 &&
            days === 0 &&
            hours > 1 &&
            " text-warning"
          }
          ${timer.done && isNegative && " text-green-500"}
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
            Due: {timer.date.toLocaleDateString()} at{" "}
            {timer.date.toLocaleTimeString()}
          </Text>
          {timer.done && (
            <Text size={"1"} className="opacity-50 font-semibold">
              Done: {timer.updatedAt?.toLocaleDateString()} at{" "}
              {timer.updatedAt?.toLocaleTimeString()}
            </Text>
          )}
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
