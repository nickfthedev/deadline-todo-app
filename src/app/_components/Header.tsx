import { Box, Flex, Button, Avatar, DropdownMenu } from "@radix-ui/themes";
import Link from "next/link";
import { CreateTimerDialog } from "./createTimerDialog";
import { getServerAuthSession } from "~/server/auth";
import { ThemeSwitch } from "./ThemeSwitch";

export async function Header() {
  const session = await getServerAuthSession();
  return (
    <Box py="4" px="6" className="bg-base-100 h-[60px]">
      <Flex justify="between" align="center">
        <Box></Box>
        <Flex direction="row" gap={"3"} align={"center"}>
          <ThemeSwitch />
          {session && (
            <>
              <CreateTimerDialog />
              <Button variant="soft">
                <Link href={"/timer"}>My Timers</Link>
              </Button>
            </>
          )}
          {!session && (
            <Link href={"/api/auth/signin"}>
              <Button variant="soft">Sign in</Button>
            </Link>
          )}
          {session && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost">
                  <Avatar
                    src={session?.user?.image ?? undefined}
                    fallback={session?.user?.name?.[0] ?? "U"}
                  />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  Welcome {session?.user?.name}
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <Link href={"/timer"}>Your Timers</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href={"/settings"}>Settings</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <Link href={"/api/auth/signout"}>Sign out</Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
