"use client";

import {
  Dialog,
  Button,
  Text,
  Flex,
  TextField,
  Callout,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface Timer {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export function EditTimerDialog({
  timer,
  isOpen,
  onClose,
}: {
  timer: Timer;
  isOpen: boolean;
  onClose: () => void;
}) {
  const utils = api.useUtils();

  const [title, setTitle] = useState(timer.title);
  const [description, setDescription] = useState(timer.description);
  const [date, setDate] = useState(timer.date.toISOString().split("T")[0]);
  const [time, setTime] = useState(
    timer.date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const editTimerMutation = api.timer.editTimer.useMutation({
    onSuccess: () => {
      utils.timer.getAllTimersByUserID.invalidate();
    },
  });

  const handleSubmit = () => {
    editTimerMutation.mutate({
      id: timer.id,
      title,
      description,
      date: new Date(date + "T" + time),
    });
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Timer</Dialog.Title>
        <Flex direction="column" gap="3">
          {editTimerMutation.error && (
            <Callout.Root color="red">
              <Callout.Text>There was an error editing the timer</Callout.Text>
            </Callout.Root>
          )}
          {editTimerMutation.data && (
            <Callout.Root color="green">
              <Callout.Text>Timer edited successfully</Callout.Text>
            </Callout.Root>
          )}
          <Dialog.Description size="2" mb="4">
            Edit the details for your timer.
          </Dialog.Description>
        </Flex>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <TextField.Root
              placeholder="Enter the timer title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {editTimerMutation.error?.data?.zodError?.fieldErrors.title && (
              <Text color="red">
                {editTimerMutation.error.data.zodError.fieldErrors.title}
              </Text>
            )}
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter the timer description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Date
            </Text>
            <TextField.Root
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {editTimerMutation.error?.data?.zodError?.fieldErrors.date && (
              <Text color="red">
                {editTimerMutation.error.data.zodError.fieldErrors.date}
              </Text>
            )}
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Time
            </Text>
            <TextField.Root
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            {editTimerMutation.error?.data?.zodError?.fieldErrors.time && (
              <Text color="red">
                {editTimerMutation.error.data.zodError.fieldErrors.time}
              </Text>
            )}
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" id="cancel-button">
              Close
            </Button>
          </Dialog.Close>

          <Button onClick={handleSubmit} disabled={editTimerMutation.isPending}>
            {editTimerMutation.isPending ? "Editing..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
