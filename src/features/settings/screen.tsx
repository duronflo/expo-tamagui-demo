import { YStack, Settings } from "@my/ui";
import { Cog, Lock, Mail, Moon, LogOut, Info, Book } from "@tamagui/lucide-icons";
import { useAuth } from "@src/features/auth/useAuth";
import { Appearance } from 'react-native'
import { useColorScheme } from 'react-native'
import { color } from "@my/ui/src/themes/token-colors";

export function SettingsScreen() {
    const { signOut } = useAuth();
    const colorScheme = useColorScheme();
    return (
        <YStack f={1}>
            <Settings>
                <Settings.Items>

                    <Settings.Group>
                        <Settings.Item
                            icon={Cog}
                            accentTheme="green"
                        >
                            General
                        </Settings.Item>
                        <Settings.Item
                            icon={Lock}
                            accentTheme="green"
                        >
                            Change Password
                        </Settings.Item>
                    </Settings.Group>

                    <Settings.Group>
                        <Settings.Item
                            icon={Book}
                            accentTheme="purple"
                        >
                            Privacy Policy & Terms of Service
                        </Settings.Item>
                        <Settings.Item
                            icon={Info}
                            accentTheme="blue"
                        >
                            About
                        </Settings.Item>
                    </Settings.Group>

                    <Settings.Group>
                        <Settings.Item
                            icon={Moon}
                            accentTheme="blue"
                            onPress={() => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                            rightLabel={colorScheme === 'dark' ? 'Dark' : 'Light'}
                        >
                            Theme
                        </Settings.Item>
                        <Settings.Item
                            icon={LogOut}
                            accentTheme="red"
                            onPress={() => signOut()}
                        >
                            LogOut
                        </Settings.Item>
                    </Settings.Group>
                </Settings.Items>
            </Settings>
        </YStack>
    );
}
