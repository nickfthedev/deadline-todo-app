import { getServerAuthSession } from "~/server/auth";
import { Box, Flex } from "@radix-ui/themes";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <Flex direction="column" style={{ flex: 1 }}>
      <Box py="6" px="6">
        Landing Page
      </Box>
      <h1 className="text-3xl font-bold underline bg-red-500">Hello world!</h1>
    </Flex>
  );
}
