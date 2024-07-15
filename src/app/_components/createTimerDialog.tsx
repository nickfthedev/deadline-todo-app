"use client";

import { Tags } from "@prisma/client";
import {
  Dialog,
  Button,
  Text,
  Flex,
  TextField,
  Callout,
  DropdownMenu,
  Box,
  TextArea,
} from "@radix-ui/themes";
import { useEffect, useState, useRef } from "react";
import { api } from "~/trpc/react";

export function CreateTimerDialog() {
  const utils = api.useUtils();

  //Handle Tag List
  const [isOpen, setIsOpen] = useState(false);
  const { data: tagList, isLoading: tagsLoading } =
    api.tags.getAllTagsByUserID.useQuery(undefined, {
      enabled: isOpen,
    });

  //Handle Input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [description]);

  const createTimerMutation = api.timer.createTimer.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Timer created successfully");
      await utils.timer.getAllTimersByUserID.invalidate();
      await utils.timer.getTimerByTimerID.invalidate();
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setCheckedTags([]);
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
      tagId: checkedTags,
    });
  };

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        setIsOpen(open);
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
            <Box className="border border-base-300 rounded-lg">
              <TextArea
                ref={textareaRef}
                placeholder="Enter the timer description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  adjustTextareaHeight();
                }}
                style={{
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                  resize: "none",
                  minHeight: "100px",
                }}
              />
            </Box>
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="soft">
                Select Tags
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {tagList?.map((tag) => (
                <DropdownMenu.CheckboxItem
                  key={tag.id}
                  checked={checkedTags.includes(tag.id)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={(e) => {
                    setCheckedTags(
                      e
                        ? [...checkedTags, tag.id]
                        : checkedTags.filter((id) => id !== tag.id)
                    );
                  }}
                >
                  {tag.name}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
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
