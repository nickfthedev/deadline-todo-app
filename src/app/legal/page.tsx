import { Box, Heading, Text, Flex } from "@radix-ui/themes";

export default function LegalPage() {
  return (
    <Flex direction="column" className="min-h-screen">
      <Box className="container mx-auto px-4 py-12">
        <Heading size="8" className="mb-6 text-neutral-200">
          Legal Notice
        </Heading>
        <Text size="3" className="mb-4">
          ..
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          Owner
        </Heading>
        <Text size="3">..</Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          Address
        </Heading>

        <Text size="3">..</Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          Contact
        </Heading>
        <Text size="3">E-Mail: ..</Text>
      </Box>
    </Flex>
  );
}
