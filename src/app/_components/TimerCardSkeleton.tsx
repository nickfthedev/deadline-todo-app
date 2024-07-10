import { Skeleton, Flex, Heading, Text, Card } from "@radix-ui/themes";

export function TimerCardSkeleton() {
  return (
    <Card className="bg-base-300">
      <Flex
        direction={"column"}
        className="w-[350px] h-[150px] justify-center items-center"
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
