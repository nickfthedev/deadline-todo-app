import type { Tags } from "@prisma/client";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { api } from "~/trpc/react";

export function ConfirmDeleteTag({
  tag,
  isOpen,
  onClose,
}: {
  tag: Tags;
  isOpen: boolean;
  onClose: () => void;
}) {
  const utils = api.useUtils();

  const deleteTagMutation = api.tags.deleteTag.useMutation({
    onSuccess: async () => {
      await utils.tags.getAllTagsByUserID.invalidate();
    },
  });

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onClose}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Tag</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This tag will be deleted and any timers associated with
          it will be untagged.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              onClick={() => deleteTagMutation.mutate({ id: tag.id })}
            >
              Delete Tag
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
