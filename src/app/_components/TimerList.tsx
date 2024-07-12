"use client";

import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import { api } from "~/trpc/react";
import { TimerCard } from "./TimerCard";
import { Button, Flex, Text } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import { CreateTimerDialog } from "./createTimerDialog";
import { TimerCardSkeleton } from "./TimerCardSkeleton";

export function TimerList() {
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get('tag');

  const { data: timers, isLoading } = api.timer.getAllTimersByUserID.useQuery({
    showDone: false,
    tag: tagFilter ?? undefined,
  });

  const [loadDoneTimers, setLoadDoneTimers] = useState(false);
  const { data: doneTimers, isLoading: doneTimersLoading } =
    api.timer.getAllTimersByUserID.useQuery(
      {
        showDone: true,
        tag: tagFilter ?? undefined,
      },
      {
        enabled: loadDoneTimers, // Only run the query when loadDoneTimers is true
      },
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
      <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
        <TimerCardSkeleton />
        <TimerCardSkeleton />
      </Flex>
    );
  // TODO: Move up the toast to layout
  return (
    <>
      {tagFilter && (
        <Flex justify="center" mb="4">
          <Text>Filtering by tag: {tagFilter}</Text>
        </Flex>
      )}
      <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
        {timers?.map((timer) => (
          <TimerCard
            key={timer.id}
            {...timer}
            showToast={showToast}
            updatedAt={timer.updatedAt}
          />
        ))}
      </Flex>
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
      </Flex>
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
    </>
  );
}
