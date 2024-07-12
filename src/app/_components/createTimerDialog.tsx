"use client";

import {
  Dialog,
  Button,
  Text,
  Flex,
  TextField,
  Callout,
} from "@radix-ui/themes";
import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateTimerDialog() {
  const utils = api.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createTimerMutation = api.timer.createTimer.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Timer created successfully");
      await utils.timer.getAllTimersByUserID.invalidate();
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    },
    onError: () => {
      setErrorMessage("There was an error creating the timer");
    },
  });

  const handleSubmit = () => {
    createTimerMutation.mutate({
      title,
      description,
      date: new Date(date + "T" + time),
    });
  };

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setSuccessMessage(null);
          setErrorMessage(null);
        }
      }}
    >
      <Dialog.Trigger>
        <Button variant="soft">Create Timer</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create Timer</Dialog.Title>
        <Flex direction="column" gap="3">
          {errorMessage && (
            <Callout.Root color="red">
              <Callout.Text>{errorMessage}</Callout.Text>
            </Callout.Root>
          )}
          {successMessage && (
            <Callout.Root color="green">
              <Callout.Text>{successMessage}</Callout.Text>
            </Callout.Root>
          )}

          <Dialog.Description size="2" mb="4">
            Enter the details for your new timer.
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
            {createTimerMutation.error?.data?.zodError?.fieldErrors.title && (
              <Text color="red">
                {createTimerMutation.error.data.zodError.fieldErrors.title}
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
            {createTimerMutation.error?.data?.zodError?.fieldErrors.date && (
              <Text color="red">
                {createTimerMutation.error.data.zodError.fieldErrors.date}
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
            {createTimerMutation.error?.data?.zodError?.fieldErrors.time && (
              <Text color="red">
                {createTimerMutation.error.data.zodError.fieldErrors.time}
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

          <Button
            onClick={handleSubmit}
            disabled={createTimerMutation.isPending}
          >
            {createTimerMutation.isPending ? "Creating..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
