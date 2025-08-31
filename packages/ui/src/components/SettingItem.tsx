import type { IconProps } from '@tamagui/helpers-icon'
import {
  SizableText,
  type ThemeName,
  XStack,
  YGroup,
  YStack,
  type YStackProps,
  styled,
} from 'tamagui'

import { ChevronRight } from '@tamagui/lucide-icons'

export type SettingItemProps = YStackProps & {
  icon: React.FC<IconProps>
  rightLabel?: string
  accentTheme?: ThemeName
  isActive?: boolean
}

export const SettingItem = ({
  icon: Icon,
  children,
  rightLabel,
  isActive,
  accentTheme,
  ...props
}: SettingItemProps) => {
  return (
    <YGroup.Item {...props}>
      <SettingItemFrame isActive={!!isActive} {...props}>
        <YStack theme={accentTheme} bg="$color11" p="$2" br="$5">
          <Icon o={2} size={16} color={'$white1'}/>
        </YStack>

        <SizableText size="$4" f={1}>
          {children}
        </SizableText>

        {rightLabel ? (
          <XStack br="$10" px="$3" py="$1.5">
            <SizableText size="$3" tt="capitalize" color="$gray11">
              {rightLabel}
            </SizableText>
          </XStack>
        ) : <ChevronRight size={16} color={'$color8'} />

        }
      </SettingItemFrame>
    </YGroup.Item>
  )
}

const SettingItemFrame = styled(XStack, {
  ai: 'center',
  jc: 'center',
  px: '$3',
  py: '$4',
  cur: 'pointer',
  gap: '$3',
  br: '$10',

  variants: {
    isActive: {
      true: {
        bg: '$backgroundFocus',

        hoverStyle: {
          bg: '$backgroundHover',
        },
        pressStyle: {
          bg: '$backgroundPress',
        },
      },
    },
  } as const,
})
