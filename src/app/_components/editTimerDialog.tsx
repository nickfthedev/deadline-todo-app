"use client";

import {
  Dialog,
  Button,
  Text,
  Flex,
  TextField,
  Callout,
  DropdownMenu,
  TextArea,
  Box,
} from "@radix-ui/themes";
import { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";

interface Timer {
  id: string;
  title: string;
  description: string | null;
  date: Date;
}

interface Tag {
  id: string;
  name: string;
}

export function EditTimerDialog({
  timer,
  isOpen,
  onClose,
  tags,
}: {
  timer: Timer;
  tags: Tag[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const utils = api.useUtils();

  //Handle Tag List
  // const { data: tagList, isLoading: tagsLoading } =
  const { data: tagList } = api.tags.getAllTagsByUserID.useQuery(undefined, {
    enabled: isOpen,
  });

  const [title, setTitle] = useState(timer.title);
  const [description, setDescription] = useState(timer.description);
  const [date, setDate] = useState(timer.date.toISOString().split("T")[0]);
  const [time, setTime] = useState(
    timer.date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [checkedTags, setCheckedTags] = useState<string[]>(
    tags.map((tag) => tag.id)
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const editTimerMutation = api.timer.editTimer.useMutation({
    onSuccess: async () => {
      await utils.timer.getAllTimersByUserID.invalidate();
      await utils.timer.getTimerByTimerID.invalidate();
      setSuccessMessage("Timer edited successfully");
    },
    onError: () => {
      setErrorMessage("There was an error editing the timer");
    },
  });

  const handleSubmit = () => {
    editTimerMutation.mutate({
      id: timer.id,
      title,
      description: description ?? "",
      date: new Date(date + "T" + time),
      tagId: checkedTags,
    });
  };

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

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSuccessMessage(null);
          setErrorMessage(null);
        }
        onClose();
      }}
    >
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Timer</Dialog.Title>
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
            <Box className="border border-base-300 rounded-lg">
              <TextArea
                ref={textareaRef}
                placeholder="Enter the timer description"
                value={description ?? ""}
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

          <Button onClick={handleSubmit} disabled={editTimerMutation.isPending}>
            {editTimerMutation.isPending ? "Editing..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
