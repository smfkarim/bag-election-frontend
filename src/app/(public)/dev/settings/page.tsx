"use client";

import {
    Box,
    Button,
    Paper,
    Stack,
    Switch,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDevSettings } from "@/store/dev-settings-store";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DevSettingsPage() {
    const devSettings = useDevSettings();
    const router = useRouter();

    // Local states
    const [localApiUrl, setLocalApiUrl] = useState("");
    const [localAdminUrl, setLocalAdminUrl] = useState("");

    // Load after hydration to avoid SSR mismatch
    useEffect(() => {
        setLocalApiUrl(devSettings.apiBaseUrl);
        setLocalAdminUrl(devSettings.adminBaseUrl);
    }, [devSettings.apiBaseUrl, devSettings.adminBaseUrl]);

    const handleSave = () => {
        devSettings.setApiBaseUrl(localApiUrl);
        devSettings.setAdminBaseUrl(localAdminUrl);

        setTimeout(() => {}, 1000);

        notifications.show({
            title: "Saved",
            message: "Developer settings updated successfully!",
            color: "green",
        });
    };

    return (
        <Box p="lg" maw={600} mx="auto">
            <Title order={2} mb="lg">
                Developer Settings
            </Title>

            <Paper shadow="md" p="xl" radius="lg" withBorder>
                <Stack gap="lg">
                    <Text fw={500}>API Base URL</Text>
                    <TextInput
                        placeholder="API Base URL"
                        value={localApiUrl}
                        onChange={(e) => setLocalApiUrl(e.target.value)}
                    />

                    <Text fw={500}>Admin Panel URL</Text>
                    <TextInput
                        placeholder="Admin Panel URL"
                        value={localAdminUrl}
                        onChange={(e) => setLocalAdminUrl(e.target.value)}
                    />

                    <Switch
                        label="Enable Debug Mode"
                        checked={devSettings.enableDebug}
                        onChange={(e) =>
                            devSettings.setEnableDebug(e.currentTarget.checked)
                        }
                    />

                    <Switch
                        label="Enable Logs"
                        checked={devSettings.enableLogs}
                        onChange={(e) =>
                            devSettings.setEnableLogs(e.currentTarget.checked)
                        }
                    />

                    <Button
                        fullWidth
                        radius="md"
                        size="lg"
                        onClick={handleSave}
                    >
                        Save Settings
                    </Button>

                    <Button
                        fullWidth
                        variant="light"
                        color="red"
                        radius="md"
                        onClick={() => {
                            localStorage.removeItem("dev-settings");
                            window.location.reload();
                        }}
                    >
                        Reset to Default (ENV)
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
