import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {
  Box,
  Flex,
  Heading,
  Text,
  Separator,
  TextField,
  Button,
  Dialog,
} from "@radix-ui/themes";
import { TimerCard } from "./_components/TimerCard";
import Link from "next/link";
import { CreateTimerDialog } from "./_components/createTimerDialog";
import { TimerList } from "./_components/TimerList";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <Flex direction="column" style={{ minHeight: "100vh" }}>
        <Box py="4" px="6" style={{ backgroundColor: "var(--gray-3)" }}>
          <Flex justify="between" align="center">
            <Heading size="5">Header</Heading>
            <Flex direction="row" gap={"3"} align={"center"}>
              {session && <span>Logged in as {session.user?.name}</span>}
              {session && <CreateTimerDialog />}
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                style={{ marginLeft: "1rem" }}
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </Flex>
          </Flex>
        </Box>
        <Separator size="4" />
        <Box py="6" px="6" style={{ flex: 1 }}>
          <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
            <TimerList />
          </Flex>
          <Flex justify={"center"} mt={"4"}>
            <CreateTimerDialog />
          </Flex>
        </Box>
        <Separator size="4" />
        <Box py="4" px="6" style={{ backgroundColor: "var(--gray-3)" }}>
          <Text as="p">Footer © 2024</Text>
        </Box>
      </Flex>
    </HydrateClient>
  );
}
