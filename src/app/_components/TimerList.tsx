"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { TimerCard } from "./TimerCard";
import { Badge, Button, Flex, IconButton, Text } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import { CreateTimerDialog } from "./createTimerDialog";
import { TimerCardSkeleton } from "./TimerCardSkeleton";
import { LuCandyOff } from "react-icons/lu";
import { FiGrid, FiList } from "react-icons/fi";
import { TimerListCard } from "./TimerListCard";
import { TimerCardListSkeleton } from "./TimerCardListSkeleton";

function TimerListEmpty() {
  return (
    <Flex
      gap={"3"}
      justify={"center"}
      wrap={"wrap"}
      className="my-12"
      align={"center"}
    >
      <LuCandyOff className=" text-3xl text-neutral-300" />
      <Text className="text-neutral-300 text-2xl">No timers found</Text>
    </Flex>
  );
}

export function TimerList() {
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get("tag");
  const { data: tag } = api.tags.getTagByHandle.useQuery(
    {
      handle: tagFilter ?? "",
    },
    {
      enabled:
        tagFilter !== null &&
        tagFilter !== undefined &&
        tagFilter != "" &&
        tagFilter !== "all",
    }
  );

  const [view, setView] = useState(
    () => localStorage.getItem("view") || "card"
  );

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  const updateView = (newView: string) => {
    setView(newView);
    const url = new URL(window.location.href);
    url.searchParams.set("view", newView);
    window.history.pushState({}, "", url);
  };

  const { data: timers, isLoading } = api.timer.getAllTimersByUserID.useQuery({
    showDone: false,
    tagHandle: tagFilter ?? undefined,
  });

  const [loadDoneTimers, setLoadDoneTimers] = useState(false);
  const { data: doneTimers, isLoading: doneTimersLoading } =
    api.timer.getAllTimersByUserID.useQuery(
      {
        showDone: true,
        tagHandle: tagFilter ?? undefined,
      },
      {
        enabled: loadDoneTimers, // Only run the query when loadDoneTimers is true
      }
    );

  // TODO Prefetch? See page copy.tsx

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  if (isLoading)
    return (
      <Flex direction={"column"} gap={"4"} className="w-full">
        {view === "card" && (
          <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
            <TimerCardSkeleton />
            <TimerCardSkeleton />
          </Flex>
        )}
        {view === "list" && (
          <Flex direction={"column"} gap={"4"} className="w-full">
            <TimerCardListSkeleton />
            <TimerCardListSkeleton />
          </Flex>
        )}
      </Flex>
    );
  // TODO: Move up the toast to layout
  return (
    <Flex direction={"column"} gap={"4"} className="w-full">
      <Flex direction={"row"} justify={"between"} align={"center"} gap={"2"}>
        {tagFilter && tag && (
          <Flex justify="center" align={"center"} gap={"2"}>
            <Text className="text-neutral-300 text-sm">Tag:</Text>
            <Badge size="2" color="indigo">
              {tag.name}
            </Badge>
          </Flex>
        )}
        <Flex align={"end"} justify={"end"} gap={"2"}>
          <IconButton
            variant="soft"
            color={view === "card" ? "indigo" : "gray"}
            onClick={() => updateView("card")}
          >
            <FiGrid />
          </IconButton>
          <IconButton
            variant="soft"
            color={view === "list" ? "indigo" : "gray"}
            onClick={() => updateView("list")}
          >
            <FiList />
          </IconButton>
        </Flex>
      </Flex>
      {view === "card" && (
        <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
          {timers?.map((timer) => (
            <TimerCard
              key={timer.id}
              {...timer}
              tags={timer.tags}
              showToast={showToast}
              updatedAt={timer.updatedAt}
            />
          ))}
          {timers?.length === 0 && <TimerListEmpty />}
        </Flex>
      )}

      {view === "list" && (
        <Flex gap={"3"} justify={"center"} direction={"column"}>
          {timers?.map((timer) => (
            <TimerListCard
              key={timer.id}
              {...timer}
              tags={timer.tags}
              showToast={showToast}
              updatedAt={timer.updatedAt}
            />
          ))}
          {timers?.length === 0 && <TimerListEmpty />}
        </Flex>
      )}
      <Flex justify={"center"} mt={"4"} gap={"4"}>
        <CreateTimerDialog />
        <Button
          variant="soft"
          color="gray"
          onClick={() => setLoadDoneTimers(!loadDoneTimers)}
        >
          {loadDoneTimers ? "Hide Done Tasks" : "Show Done Tasks"}
        </Button>
      </Flex>
      {view === "card" && (
        <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
          {doneTimersLoading && (
            <>
              <TimerCardSkeleton />
              <TimerCardSkeleton />
            </>
          )}
          {loadDoneTimers &&
            doneTimers?.map((timer) => (
              <TimerCard
                key={timer.id}
                {...timer}
                showToast={showToast}
                doneMode={true}
                updatedAt={timer.updatedAt}
              />
            ))}
          {loadDoneTimers && doneTimers?.length === 0 && <TimerListEmpty />}
        </Flex>
      )}
      {view === "list" && (
        <Flex gap={"3"} justify={"center"} direction={"column"}>
          {doneTimersLoading && (
            <>
              <TimerCardSkeleton />
              <TimerCardSkeleton />
            </>
          )}
          {loadDoneTimers &&
            doneTimers?.map((timer) => (
              <TimerListCard
                key={timer.id}
                {...timer}
                showToast={showToast}
                doneMode={true}
                updatedAt={timer.updatedAt}
              />
            ))}
          {loadDoneTimers && doneTimers?.length === 0 && <TimerListEmpty />}
        </Flex>
      )}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-neutral-200 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-base-200 text-[15px]">
            {toastMessage}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
      </Toast.Provider>
    </Flex>
  );
}
