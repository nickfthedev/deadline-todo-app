"use client";

import { api } from "~/trpc/react";
import { TimerCard } from "./TimerCard";
import { Flex } from "@radix-ui/themes";

export function TimerList() {
  const { data: timers, isLoading } = api.timer.getAllTimersByUserID.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
      {timers?.map((timer) => (
        <TimerCard key={timer.id} {...timer} />
      ))}
    </Flex>
  );
}
