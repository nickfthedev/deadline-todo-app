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
import { TimerCard } from "./_components/timer";
import Link from "next/link";
import { CreateTimerDialog } from "./_components/createTimerDialog";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Flex direction="column" style={{ minHeight: "100vh" }}>
        <Box py="4" px="6" style={{ backgroundColor: "var(--gray-3)" }}>
          <Flex justify="between" align="center">
            <Heading size="5">Header</Heading>
            <div>
              {session && <span>Logged in as {session.user?.name}</span>}
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                style={{ marginLeft: "1rem" }}
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </Flex>
        </Box>
        <Separator size="4" />
        <Box py="6" px="6" style={{ flex: 1 }}>
          <Heading size="4">Main Content</Heading>
          <Text as="p">This is where your main content goes.</Text>
          <Flex gap={"3"} justify={"center"} wrap={"wrap"}>
            <TimerCard
              title="Timer 1"
              description="Description 1"
              time={new Date(new Date().setDate(new Date().getDate() + 1))}
            />
            <TimerCard
              title="Timer 2"
              description="Description 2"
              time={new Date(new Date().setDate(new Date().getDate() + 2))}
            />
            <TimerCard
              title="Timer 3"
              description="Description 3"
              time={new Date(new Date().setDate(new Date().getDate() + 3))}
            />
            <TimerCard
              title="Timer 4"
              description="Description 4"
              time={new Date(new Date().getTime() - 1 * 60 * 60 * 1000)}
            />
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
