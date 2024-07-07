"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TimerCard } from "./TimerCard";
import { Flex } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import "../_components/ToastStyle.css";
export function TimerList() {
  const { data: timers, isLoading } = api.timer.getAllTimersByUserID.useQuery({
    showDone: false,
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
        {timers?.map((timer) => (
          <TimerCard key={timer.id} {...timer} showToast={showToast} />
        ))}
      </Flex>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="ToastRoot"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title className="ToastTitle">{toastMessage}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </>
  );
}
