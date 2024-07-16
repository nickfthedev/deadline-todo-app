import { Box, Heading, Text, Flex } from "@radix-ui/themes";

export default function PrivacyPolicyPage() {
  return (
    <Flex direction="column" className="min-h-screen">
      <Box className="container mx-auto px-4 py-12">
        <Heading size="8" className="mb-6 text-neutral-200">
          Privacy Policy
        </Heading>
        <Text size="3" className="mb-4">
          Last updated: 2024-07-16
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          1. Introduction
        </Heading>
        <Text size="3">
          This Privacy Policy explains how DueDo.app ("we", "us", or "our")
          collects, uses, and protects your personal information. We are
          committed to ensuring the privacy and security of our users.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          2. Data Collection
        </Heading>
        <Text size="3">
          Our app is designed with privacy in mind. We do not collect any
          tracking data or personal information beyond what is strictly
          necessary for the app's functionality.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          3. Local Storage
        </Heading>
        <Text size="3">
          We use local storage on your device to remember your app settings,
          including:
        </Text>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>View preference (list or card view)</li>
          <li>Sidebar state (pinned or unpinned)</li>
        </ul>
        <Text size="3" className="mt-2">
          This information is stored locally on your device and is not
          transmitted to our servers.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          4. Authentication
        </Heading>
        <Text size="3">For user authentication, we use OAuth providers:</Text>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>GitHub</li>
          <li>Discord</li>
        </ul>
        <Text size="3" className="mt-2">
          When you choose to log in, you will be redirected to the respective
          provider's login page. We only receive the information necessary to
          create and manage your account, as authorized by you during the OAuth
          process.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          5. Data Usage
        </Heading>
        <Text size="3">
          The information we receive through OAuth is used solely for the
          purpose of providing and improving our service. We do not sell, rent,
          or share this information with third parties.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          6. Data Protection
        </Heading>
        <Text size="3">
          We implement appropriate technical and organizational measures to
          ensure a level of security appropriate to the risk of processing your
          personal information.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          7. Your Rights
        </Heading>
        <Text size="3">
          You have the right to access, correct, or delete your personal
          information. To exercise these rights, please contact us at
          info@duedo.app.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          8. Changes to This Policy
        </Heading>
        <Text size="3">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page.
        </Text>

        <Heading size="5" className="mt-6 mb-2 text-neutral-200">
          9. Contact Us
        </Heading>
        <Text size="3">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </Text>
        <Text size="3" className="mt-2">
          Email: info@duedo.app
        </Text>
      </Box>
    </Flex>
  );
}
