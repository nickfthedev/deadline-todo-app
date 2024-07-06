"use client";

import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface TimerCardProps {
  title: string;
  description: string;
  time: Date;
}

export function TimerCard({ title, description, time }: TimerCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const delta = time.getTime() - currentTime.getTime();
  const isNegative = delta < 0;
  const absDelta = Math.abs(delta);

  const years = Math.floor(absDelta / (1000 * 60 * 60 * 24 * 365));
  const weeks = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 7)
  );
  const days = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24)
  );
  const hours = Math.floor(
    (absDelta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((absDelta % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDelta % (1000 * 60)) / 1000);

  return (
    <Card>
      <Flex
        direction={"column"}
        style={{
          width: "350px",
          height: "150px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading as="h4" size={"4"}>
          {title}
        </Heading>
        <Text as="p">{description}</Text>
        <Text
          size={"7"}
          weight={"bold"}
          style={{
            fontFamily: "monospace",
            color: isNegative ? "red" : "inherit",
          }}
        >
          {isNegative && "-"}
          {years > 0 && <Text>{years}Y:</Text>}
          {weeks > 0 && <Text>{weeks}W:</Text>}
          {days > 0 && <Text>{days}D:</Text>}
          <Text>{hours.toString().padStart(2, "0")}H:</Text>
          <Text>{minutes.toString().padStart(2, "0")}M:</Text>
          <Text>{seconds.toString().padStart(2, "0")}S</Text>
        </Text>
      </Flex>
    </Card>
  );
}
