import { Box, Text } from "@radix-ui/themes";

export function Footer() {
  return (
    <Box py="4" px="6" className="bg-base-200 h-30">
      <Text as="p" className="text-neutral-100">
        Footer © 2024
      </Text>
    </Box>
  );
}
