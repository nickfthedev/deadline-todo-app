import { getServerAuthSession } from "~/server/auth";
import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";
import CountdownTimer from "~/app/_components/CountDownTimer";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <Flex direction="column" className="min-h-screen">
      <Box className="container mx-auto px-4 py-12">
        <Flex direction="column" align="center" className="text-center">
          <Heading size="9" className="mt-5  mb-4 text-neutral-100 ">
            Get ready to get productive again!
          </Heading>
          <Text size="5" className="mb-8 text-gray-700">
            Stop wasting your time on unproductive, overwhelming productivity
            tools.
          </Text>

          <CountdownTimer initialMinutes={5} initialSeconds={0} />

          <Button
            size="4"
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full transition duration-300"
          >
            Get Started Now
          </Button>
        </Flex>
      </Box>

      <Box className="container mx-auto px-4 py-12">
        <Flex gap="8" className="justify-center">
          <Box className="text-center">
            <Heading size="6" className="mb-2 text-blue-800">
              Feature 1
            </Heading>
            <Text className="text-gray-600">Description of feature 1</Text>
          </Box>
          <Box className="text-center">
            <Heading size="6" className="mb-2 text-blue-800">
              Feature 2
            </Heading>
            <Text className="text-gray-600">Description of feature 2</Text>
          </Box>
          <Box className="text-center">
            <Heading size="6" className="mb-2 text-blue-800">
              Feature 3
            </Heading>
            <Text className="text-gray-600">Description of feature 3</Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
