import { Box, Heading, Text, Flex } from "@radix-ui/themes";

export default function LegalPage() {
  return (
    <Flex direction="column" className="min-h-screen">
      <Box className="container mx-auto px-4 py-12">
        <Heading size="8" className="mb-6 text-neutral-200">
          Legal Notice
        </Heading>
        <Text size="3" className="mb-4">
          DueDo.app
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          Owner
        </Heading>
        <Text size="3">Nick Friedrich</Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          Address
        </Heading>

        <Text size="3">Butterbauernstieg, 22339 Hamburg, Germany</Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          Contact
        </Heading>
        <Text size="3">E-Mail: info@duedo.app</Text>

        <Box className="mt-8">
          <Text size="3" className="text-neutral-200">
            Verantwortliche/r im Sinne von § 18 Abs. 2 MStV: Nick Friedrich,
            Butterbauernstieg, 22339 Hamburg
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
