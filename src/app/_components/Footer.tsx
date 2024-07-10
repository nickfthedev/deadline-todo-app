import { Box, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

export const pageInfo = {
  pageName: "Personal Portfolio of Nick Friedrich",
  pageOwner: "Nick Friedrich",
  pageOwnerLink: "https://www.nick-friedrich.de",
  currentYear: new Date().getFullYear().toString(),
  githubProfile: "https://www.github.com/nickfthedev",
};

export function Footer() {
  return (
    <Flex py="4" px="6" className="bg-base-200 h-30" justify={"between"}>
      <Box>
        <Text>Copyright {pageInfo.currentYear} - </Text>
        <Link target="_blank" href={pageInfo.pageOwnerLink}>
          {pageInfo.pageOwner}
        </Link>
      </Box>
      <Flex direction={"row"} gap={"3"}>
        <Link href="/legal">Legal Notice</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link target="_blank" href={pageInfo.githubProfile}>
          Github
        </Link>
      </Flex>
    </Flex>
  );
}
