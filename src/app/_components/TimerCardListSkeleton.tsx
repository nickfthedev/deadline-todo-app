import { Skeleton, Flex, Heading, Text, Card } from "@radix-ui/themes";

export function TimerCardListSkeleton() {
  return (
    <Card className="bg-base-300 w-full">
      <Flex
        direction={"column"}
        className="w-[350px] h-[65px] justify-center items-center"
      >
        <Heading as="h4" size={"4"}>
          <Skeleton>Title TitleTitle Title Title</Skeleton>
        </Heading>
        <Text as="p">
          <Skeleton>Description</Skeleton>
        </Text>
        <Text size={"7"} weight={"bold"} className={`font-monospace`}>
          <Skeleton>00:00:00:00</Skeleton>
        </Text>
      </Flex>
    </Card>
  );
}
