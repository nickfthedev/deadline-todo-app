"use client";

import React, { useState, useEffect } from "react";
import { Text } from "@radix-ui/themes";

interface CountdownTimerProps {
  initialMinutes: number;
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  initialSeconds,
}) => {
  const [hours, setHours] = useState(Math.floor(initialMinutes / 60));
  const [minutes, setMinutes] = useState(initialMinutes % 60);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hours, minutes, seconds]);

  return (
    <Text size="9" className="font-bold text-blue-800">
      {hours.toString().padStart(2, "0")}H:
      {minutes.toString().padStart(2, "0")}M:
      {seconds.toString().padStart(2, "0")}S
    </Text>
  );
};

export default CountdownTimer;
