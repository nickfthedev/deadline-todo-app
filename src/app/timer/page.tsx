"use server";

import { getServerAuthSession } from "~/server/auth";
import { Box, Flex } from "@radix-ui/themes";
import { CreateTimerDialog } from "~/app/_components/createTimerDialog";
import { TimerList } from "~/app/_components/TimerList";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <Flex direction="column" style={{ flex: 1 }}>
      <Box py="6" px="6">
        <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
          <TimerList />
        </Flex>
      </Box>
    </Flex>
  );
}
