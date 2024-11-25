import React, { useContext, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { CommandBarButton, Dialog, Stack } from '@fluentui/react'
import { AppStateContext } from '../../state/AppProvider'
import Contoso from '../../assets/Contoso.svg'
import { HistoryButton, SettingsButton } from '../../components/common/Button'
import { CosmosDBStatus } from '../../api'
import AdvancedSettingsPanel from '../../components/AdvancedSettingsPanel/AdvancedSettingsPanel'
import styles from './Layout.module.css'

const Layout = () => {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState<boolean>(false)

  const appStateContext = useContext(AppStateContext)
  const { state } = appStateContext || {}
  const { frontendSettings, advancedSettings } = state || {}

  const ui = frontendSettings?.ui
  const settingsButtonRef = useRef<CommandBarButton | null>(null)
  const logo = ui?.logo || Contoso

  const handleSettingsClick = () => {
    setIsSettingsDialogOpen(true)
  }

  const handleSettingsDialogDismiss = () => {
    setIsSettingsDialogOpen(false)
  }

  if (!advancedSettings) return null

  return (
    <div className={styles.layout}>
      <header className={styles.header} role="banner">
        <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            <img src={logo} className={styles.headerIcon} aria-hidden="true" alt="" />
            <Link to="/" className={styles.headerTitleContainer}>
              <h1 className={styles.headerTitle}>{ui?.title}</h1>
            </Link>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 4 }} className={styles.shareButtonContainer}>
            {state?.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured &&
              ui?.show_chat_history_button !== false && (
                <HistoryButton
                  onClick={() => appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })}
                  text="Show/Hide History"
                />
              )}
            <SettingsButton onClick={handleSettingsClick} text="Settings" ref={settingsButtonRef} />
          </Stack>
        </Stack>
      </header>
      <Outlet />
      <Dialog
        onDismiss={handleSettingsDialogDismiss}
        hidden={!isSettingsDialogOpen}
        styles={{
          main: [
            {
              position: 'absolute',
              top: '36px',
              right: '8px',
              transform: 'translateY(10px)',
              selectors: {
                '@media (min-width: 480px)': {
                  maxWidth: '600px',
                  background: '#FFFFFF',
                  boxShadow: '0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  maxHeight: '90vh',
                  minHeight: '200px'
                }
              }
            }
          ]
        }}
        dialogContentProps={{
          title: 'Advanced Settings',
          showCloseButton: true
        }}>
        <AdvancedSettingsPanel
          models={
            Array.isArray(advancedSettings.ui_model_list)
              ? advancedSettings.ui_model_list
              : typeof advancedSettings.ui_model_list === 'string' && advancedSettings.ui_model_list.length > 0
                ? advancedSettings.ui_model_list.split(',')
                : []
          }
          temperatureLow={Number(advancedSettings.ui_temperature_low) || 0}
          temperatureHigh={Number(advancedSettings.ui_temperature_high) || 1}
          topPLow={Number(advancedSettings.ui_top_plow) || 0}
          topPHigh={Number(advancedSettings.ui_top_phigh) || 1}
          searchStrictnessLow={Number(advancedSettings.ui_search_stricwtness_low) || 0}
          searchStrictnessHigh={Number(advancedSettings.ui_search_strictness_high) || 1}
          topKLow={Number(advancedSettings.ui_top_klow) || 0}
          topKHigh={Number(advancedSettings.ui_top_khigh) || 10}
          selectedModel={String(advancedSettings.azure_openai_model_name)}
          selectedTemperature={Number(advancedSettings.azure_openai_temperature) || 0}
          selectedTopP={Number(advancedSettings.azure_openai_top_p) || 0}
          selectedSearchStrictness={Number(advancedSettings.search_strictness) || 0}
          selectedTopK={Number(advancedSettings.search_top_k) || 0}
          isEnableInDomain={Boolean(advancedSettings.search_enable_in_domain)}
          onModelChange={value =>
            appStateContext?.dispatch({
              type: 'UPDATE_ADVANCED_SETTINGS',
              payload: { ...advancedSettings, azure_openai_model_name: String(value) }
            })
          }
          onTemperatureChange={value =>
            appStateContext?.dispatch({
              type: 'UPDATE_ADVANCED_SETTINGS',
              payload: { ...advancedSettings, azure_openai_temperature: Number(value) }
            })
          }
          onTopPChange={value =>
            appStateContext?.dispatch({
              type: 'UPDATE_ADVANCED_SETTINGS',
              payload: { ...advancedSettings, azure_openai_top_p: Number(value) }
            })
          }
          onSearchStrictnessChange={value =>
            appStateContext?.dispatch({
              type: 'UPDATE_ADVANCED_SETTINGS',
              payload: { ...advancedSettings, search_strictness: Number(value) }
            })
          }
          onTopKChange={value =>
            appStateContext?.dispatch({
              type: 'UPDATE_ADVANCED_SETTINGS',
              payload: { ...advancedSettings, search_top_k: Number(value) }
            })
          }
          onEnableInDomainChange={value =>
            appStateContext?.dispatch({
              type: 'UPDATE_ADVANCED_SETTINGS',
              payload: { ...advancedSettings, search_enable_in_domain: Boolean(value) }
            })
          }
        />
      </Dialog>
    </div>
  )
}

export default Layout
