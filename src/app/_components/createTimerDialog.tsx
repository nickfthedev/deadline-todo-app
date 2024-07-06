import { Dialog, Button, Text, Flex, TextField } from "@radix-ui/themes";

export function CreateTimerDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="solid">Create Timer</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create Timer</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Enter the details for your new timer.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <TextField.Root placeholder="Enter the timer title" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root placeholder="Enter the timer description" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Date
            </Text>
            <TextField.Root
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Time
            </Text>
            <TextField.Root
              type="time"
              defaultValue={new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
