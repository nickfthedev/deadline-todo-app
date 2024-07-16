"use client";

import type { Tags } from "@prisma/client";
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

export function EditTagDialog({
  tag,
  isOpen,
  onClose,
}: {
  tag: Tags;
  isOpen: boolean;
  onClose: () => void;
}) {
  const utils = api.useUtils();

  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const editTagMutation = api.tags.editTag.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Tag edited successfully");
      setName("");
      await utils.tags.getAllTagsByUserID.invalidate();
    },
    onError: () => {
      setErrorMessage("There was an error editing the tag");
    },
  });

  const handleSubmit = () => {
    editTagMutation.mutate({
      name,
      id: tag.id,
    });
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSuccessMessage(null);
          setErrorMessage(null);
        }
        onClose();
      }}
    >
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Tag</Dialog.Title>
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
            Edit your tag.
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
            {editTagMutation.error?.data?.zodError?.fieldErrors.name && (
              <Text color="red">
                {editTagMutation.error.data.zodError.fieldErrors.name}
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

          <Button onClick={handleSubmit} disabled={editTagMutation.isPending}>
            {editTagMutation.isPending ? "Editing..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
