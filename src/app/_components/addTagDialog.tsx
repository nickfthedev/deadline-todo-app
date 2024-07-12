"use client";

import {
  Dialog,
  Button,
  Text,
  Flex,
  TextField,
  Callout,
} from "@radix-ui/themes";
import { useState } from "react";
import { api } from "~/trpc/react";

export function AddTagDialog() {
  const utils = api.useUtils();

  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createTagMutation = api.tags.createTag.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Tag created successfully");
      setName("");
      await utils.tags.getAllTagsByUserID.invalidate();
    },
    onError: () => {
      setErrorMessage("There was an error creating the tag");
    },
  });

  const handleSubmit = () => {
    createTagMutation.mutate({
      name,
    });
  };

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setSuccessMessage(null);
          setErrorMessage(null);
        }
      }}
    >
      <Dialog.Trigger>
        <Button variant="outline" className="mx-2">
          Add Tags
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create Tag</Dialog.Title>
        <Flex direction="column" gap="3">
          {errorMessage && (
            <Callout.Root color="red">
              <Callout.Text>{errorMessage}</Callout.Text>
            </Callout.Root>
          )}
          {successMessage && (
            <Callout.Root color="green">
              <Callout.Text>{successMessage}</Callout.Text>
            </Callout.Root>
          )}

          <Dialog.Description size="2" mb="4">
            Enter the details for your new tag.
          </Dialog.Description>
        </Flex>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              placeholder="Enter the tags name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {createTagMutation.error?.data?.zodError?.fieldErrors.name && (
              <Text color="red">
                {createTagMutation.error.data.zodError.fieldErrors.name}
              </Text>
            )}
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" id="cancel-button">
              Close
            </Button>
          </Dialog.Close>

          <Button onClick={handleSubmit} disabled={createTagMutation.isPending}>
            {createTagMutation.isPending ? "Creating..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
