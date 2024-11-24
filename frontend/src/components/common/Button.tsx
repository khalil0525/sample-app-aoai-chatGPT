import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react'
import { CommandBarButton, DefaultButton, IButton, IButtonProps, IRefObject } from '@fluentui/react'
import styles from './Button.module.css'

interface ButtonProps extends IButtonProps {
  onClick: () => void
  text: string | undefined
}

interface SettingsButtonProps extends IButtonProps {
  onClick: () => void
  text: string
}

export const SettingsButton = forwardRef<CommandBarButton, SettingsButtonProps>((props, ref) => {
  const { onClick, text, ...restProps } = props
  const buttonRef = useRef<CommandBarButton>(null)

  useImperativeHandle(ref, () => buttonRef.current as CommandBarButton)

  return (
    <CommandBarButton
      ref={buttonRef}
      className={styles.shareButtonRoot}
      iconProps={{ iconName: 'Settings' }}
      onClick={onClick}
      text={text}
      {...restProps}
    />
  )
})
export const ShareButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <CommandBarButton
      className={styles.shareButtonRoot}
      iconProps={{ iconName: 'Share' }}
      onClick={onClick}
      text={text}
    />
  )
}

export const HistoryButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <DefaultButton
      className={styles.historyButtonRoot}
      text={text}
      iconProps={{ iconName: 'History' }}
      onClick={onClick}
    />
  )
}
