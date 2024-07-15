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
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  FiMoreHorizontal,
  FiArrowLeft,
  FiTrash,
  FiSave,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";
import { EditTimerDialog } from "~/app/_components/editTimerDialog";
import { ToastComponent } from "~/app/_components/toast";
import { api } from "~/trpc/react";

interface Timer {
  id: string;
  title: string;
  description: string;
  date: Date;
}

interface Tag {
  id: string;
  name: string;
}

export default function TimerDetails() {
  // Data fetching
  const { id } = useParams();
  const { data: timer, isLoading } = api.timer.getTimerByTimerID.useQuery({
    id: id as string,
  });

  const utils = api.useUtils();
  const router = useRouter();

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
      router.push("/timer");
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

  // Form Control
  const editTimerMutation = api.timer.editTimer.useMutation({
    onSuccess: async () => {
      await utils.timer.getAllTimersByUserID.invalidate();
      await utils.timer.getTimerByTimerID.invalidate();
      showToast("Timer edited successfully");
    },
    onError: () => {
      showToast("There was an error editing the timer");
    },
  });
  const [title, setTitle] = useState(timer?.title || "");
  const [description, setDescription] = useState(timer?.description || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(
    timer?.date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }) || ""
  );
  //Handle Tag List
  const [tagsOpen, setTagsOpen] = useState(false);
  const { data: tagList, isLoading: tagsLoading } =
    api.tags.getAllTagsByUserID.useQuery(undefined, {
      enabled: tagsOpen,
    });
  const [checkedTags, setCheckedTags] = useState<string[]>(
    timer?.tags.map((tag) => tag.id) || []
  );
  const handleSave = () => {
    editTimerMutation.mutate({
      id: timer?.id || "",
      title,
      description: description.replace(/"/g, ""),
      date: new Date(date + "T" + time),
      tagId: checkedTags,
    });
  };

  useEffect(() => {
    setTitle(timer?.title || "");
    setDescription(timer?.description || "");
    // Format the date correctly
    if (timer?.date) {
      const formattedDate = timer.date.toISOString().split("T")[0] ?? "";
      setDate(formattedDate);
    }
    setTime(
      timer?.date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }) || ""
    );
    setCheckedTags(timer?.tags.map((tag) => tag.id) || []);
  }, [timer]);

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

  // Auto grow textarea
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
    <Flex direction={"column"} gap={"4"} mt={"6"} mx={"6"}>
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
      <Flex direction={"row"} justify={"between"} align={"center"}>
        <IconButton variant="ghost" onClick={() => router.back()}>
          <FiArrowLeft size={"20"} color="gray" />
        </IconButton>

        <input
          className="text-3xl font-semibold tracking-tight h-fit text-center rounded-2xl p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
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
      <Flex justify={"center"}>
        <Flex gap={"1"} direction={"row"}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="ghost">
                {tagList
                  ?.filter((tag) => checkedTags.includes(tag.id))
                  .map((tag) => (
                    <Badge key={tag.id} size="1" color="indigo">
                      {tag.name}
                    </Badge>
                  ))}
                {(tagList?.filter((tag) => checkedTags.includes(tag.id))
                  ?.length ?? 0) <= 0 && (
                  <Badge size="1" color="gray">
                    Click to add a tag
                  </Badge>
                )}
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
      </Flex>
      <Flex justify={"center"}>
        <Card className="bg-base-300" mt={"4"}>
          <Flex
            direction={"column"}
            className="w-[550px] h-[150px] justify-center items-center"
          >
            <Text
              weight={"bold"}
              className={`text-5xl font-monospace ${
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
        </Card>
      </Flex>
      <Flex justify={"center"} direction={"column"} className="mt-2 gap-2">
        <Flex direction={"row"} justify={"center"} gap={"2"}>
          <label>
            <Text as="div" size="2" mb="1">
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
            <Text as="div" size="2" mb="1">
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
        <Heading className="text-xl text-center font-semibold tracking-tight">
          Description
        </Heading>
        <Box className="border border-base-300 rounded-lg">
          <TextArea
            ref={textareaRef}
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
      </Flex>
      <Flex justify={"between"} gap={"2"}>
        <Flex direction={"row"} gap={"2"}>
          <Button onClick={handleSave}>
            <FiSave />
            Save
          </Button>
          {!timer.done && (
            <Button variant="soft" onClick={handleMarkAsDone}>
              <FiCheckCircle />
              Mark as Done
            </Button>
          )}
          {timer.done && (
            <Button variant="soft" onClick={handleMarkAsUndone}>
              <FiCircle />
              Mark as Undone
            </Button>
          )}
        </Flex>
        <Button variant="soft" color="red" onClick={handleOpenDeleteDialog}>
          <FiTrash />
          Delete
        </Button>
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
    </Flex>
  );
}
