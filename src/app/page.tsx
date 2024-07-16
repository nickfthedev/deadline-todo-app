import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";
import CountdownTimer from "~/app/_components/CountDownTimer";
import Link from "next/link";

export default async function Home() {
  return (
    <Flex direction="column" className="min-h-screen">
      <Box className="container mx-auto px-4 py-12">
        <Flex direction="column" align="center" className="text-center">
          <Heading className="mt-5  mb-4 text-neutral-100 text-5xl ">
            Get ready to get productive again!
          </Heading>
          <Text size="5" className="mb-8 text-gray-700">
            Stop wasting your time on unproductive, overwhelming productivity
            tools.
          </Text>

          <CountdownTimer initialMinutes={5} initialSeconds={0} />

          <Link href="/timer">
            <Button
              size="4"
              className="mt-8 bg-secondary hover:bg-accent text-white px-8 py-2 rounded-full transition duration-300"
            >
              Get Started Now (it&apos;s free)
            </Button>
          </Link>
        </Flex>
      </Box>

      <Box className="container mx-auto px-4 py-12">
        <Flex gap="8" className="justify-center">
          <Box className="text-center">
            <Heading size="6" className="mb-2 text-neutral-100">
              Free
            </Heading>
            <Text className="text-gray-600">
              I&#39;ve built this for my personal use and I&#39;m sharing it
              with you. It&#39;s free to use. Maybe there will be paid features
              in the future.
            </Text>
          </Box>
          <Box className="text-center">
            <Heading size="6" className="mb-2 text-neutral-100">
              Easy
            </Heading>
            <Text className="text-gray-600">
              If you are like me and you have enough of dozens of blown up
              productivity tools, you will love this.
            </Text>
          </Box>
          <Box className="text-center">
            <Heading size="6" className="mb-2 text-neutral-100">
              Productive
            </Heading>
            <Text className="text-gray-600">
              I&#39;ve built this with the intention of getting my work done.
              The builtin timer for every task helps me getting my work done in
              a timely manner.
            </Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
