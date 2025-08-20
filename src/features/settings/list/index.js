import SectionListExtended from "../../../../components/sectionlistextended";
import { useState } from "react";
import { useUser } from "../../user/hooks";
import { useThemeMode } from '@rneui/themed';
import { logoutFirebase } from "../../../services/firebase";


// helper component for having a proper configuration
export default SettingsList = () => {
    const [design, setDesign] = useState(true);
    const { mode, setMode } = useThemeMode('dark');
    const { userState } = useUser();

    const profileScreenConfig = [{
        title: "General",
        data: [
            {
                type: "button",
                title: "Language",
                result: "System",
                buttonDisabled: true,
                actionHandler: () => { }
            },
            {
                type: "switch",
                title: "Appereance",
                result: mode === 'dark' ? false : true,
                buttonDisabled: true,
                actionHandler: () => mode === 'dark' ? setMode('light') : setMode('dark')
            },

        ],
    },
    {
        title: "Account",
        data: [
            {
                type: "info",
                title: `Name: ${userState.firstName} ${userState.lastName}`,
                buttonDisabled: true,
            },
            {
                type: "info",
                title: `Email: ${userState.email}`,
                buttonDisabled: true,
            },
            {
                type: "button",
                title: "Logout",
                result: "click here...",
                buttonDisabled: false,
                actionHandler: () => logoutFirebase()
            },

        ],
    },
    {
        title: "myMonji Information",
        data: [
            {
                type: "info",
                title: "developer: duronflo",
                buttonDisabled: true,
            },
            {
                type: "info",
                title: "desginer: sara",
                buttonDisabled: true,
            },

        ]
    }
    ]

    return (
        <SectionListExtended
            config={profileScreenConfig}
        />
    )




};