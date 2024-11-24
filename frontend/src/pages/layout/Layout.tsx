import React, { useContext, useEffect, useRef, useState } from 'react'
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
  const [logo, setLogo] = useState('')
  const [advancedSettings, setAdvancedSettings] = useState<any>(null)

  const [selectedModel, setSelectedModel] = useState<string>('')
  const [selectedTemperature, setSelectedTemperature] = useState<number>(0)
  const [selectedTopP, setSelectedTopP] = useState<number>(0)
  const [selectedSearchStrictness, setSelectedSearchStrictness] = useState<number>(0)
  const [selectedTopK, setSelectedTopK] = useState<number>(0)
  const [isEnableInDomain, setIsEnableInDomain] = useState<boolean>(false)

  const appStateContext = useContext(AppStateContext)
  const ui = appStateContext?.state.frontendSettings?.ui

  const settingsButtonRef = useRef<CommandBarButton | null>(null)

  useEffect(() => {
    const envVars = {
      azureOpenaiModelName: window.env.azureOpenaiModelName || '',
      azureOpenaiTopP: window.env.azureOpenaiTopP || 0,
      uiModelList: window.env.uiModelList || [],
      uiTemperatureLow: window.env.uiTemperatureLow || 0,
      uiTemperatureHigh: window.env.uiTemperatureHigh || 1,
      uiTopPLow: window.env.uiTopPLow || 0.1,
      uiTopPHigh: window.env.uiTopPHigh || 1,
      uiSearchStrictnessLow: window.env.uiSearchStrictnessLow || 1,
      uiSearchStrictnessHigh: window.env.uiSearchStrictnessHigh || 10,
      uiTopKLow: window.env.uiTopKLow || 1,
      uiTopKHigh: window.env.uiTopKHigh || 40,
      searchTopK: window.env.searchTopK || 10,
      searchStrictness: window.env.searchStrictness || 5,
      searchEnableInDomain: window.env.searchEnableInDomain === 'True',
      azureOpenaiTemperature: window.env.azureOpenaiTemperature || 10
    }

    const savedSettings = localStorage.getItem('advancedSettings')
    const localStorageSettings = savedSettings ? JSON.parse(savedSettings) : {}

    const settings = {
      ...envVars,
      ...localStorageSettings
    }

    setAdvancedSettings(settings)

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSelectedModel(parsedSettings.model || envVars.azureOpenaiModelName)
      setSelectedTemperature(parsedSettings.temperature || envVars.azureOpenaiTemperature)
      setSelectedTopP(parsedSettings.topP || envVars.azureOpenaiTopP)
      setSelectedSearchStrictness(parsedSettings.searchStrictness || envVars.searchStrictness)
      setSelectedTopK(parsedSettings.topK || envVars.searchTopK)
      setIsEnableInDomain(parsedSettings.enableInDomain ?? envVars.searchEnableInDomain)
    } else {
      setSelectedModel(envVars.azureOpenaiModelName as string)
      setSelectedTemperature(envVars.azureOpenaiTemperature as number)
      setSelectedTopP(envVars.azureOpenaiTopP as number)
      setSelectedSearchStrictness(envVars.searchStrictness as number)
      setSelectedTopK(envVars.searchTopK as number)
      setIsEnableInDomain(envVars.searchEnableInDomain as boolean)
    }

    if (!appStateContext?.state.isLoading) {
      setLogo(ui?.logo || Contoso)
    }
  }, [appStateContext?.state.isLoading, ui])

  useEffect(() => {
    const settings = {
      model: selectedModel,
      temperature: selectedTemperature,
      topP: selectedTopP,
      searchStrictness: selectedSearchStrictness,
      topK: selectedTopK,
      enableInDomain: isEnableInDomain
    }
    localStorage.setItem('advancedSettings', JSON.stringify(settings))
  }, [selectedModel, selectedTemperature, selectedTopP, selectedSearchStrictness, selectedTopK, isEnableInDomain])

  const handleSettingsClick = () => {
    setIsSettingsDialogOpen(true)
  }

  const handleSettingsDialogDismiss = () => {
    setIsSettingsDialogOpen(false)
  }

  if (!advancedSettings) return null

  return (
    <div className={styles.layout}>
      <header className={styles.header} role={'banner'}>
        <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            <img src={logo} className={styles.headerIcon} aria-hidden="true" alt="" />
            <Link to="/" className={styles.headerTitleContainer}>
              <h1 className={styles.headerTitle}>{ui?.title}</h1>
            </Link>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 4 }} className={styles.shareButtonContainer}>
            {appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured &&
              ui?.show_chat_history_button !== false && (
                <HistoryButton
                  onClick={() => appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })}
                  text={'Show/Hide History'}
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
          models={advancedSettings.uiModelList?.length ? advancedSettings.uiModelList?.split(',') : []}
          temperatureLow={advancedSettings.uiTemperatureLow}
          temperatureHigh={advancedSettings.uiTemperatureHigh}
          topPLow={advancedSettings.uiTopPLow}
          topPHigh={advancedSettings.uiTopPHigh}
          searchStrictnessLow={advancedSettings.uiSearchStrictnessLow}
          searchStrictnessHigh={advancedSettings.uiSearchStrictnessHigh}
          topKLow={advancedSettings.uiTopKLow}
          topKHigh={advancedSettings.uiTopKHigh}
          selectedModel={selectedModel}
          selectedTemperature={selectedTemperature}
          selectedTopP={selectedTopP}
          selectedSearchStrictness={selectedSearchStrictness}
          selectedTopK={selectedTopK}
          isEnableInDomain={isEnableInDomain}
          onModelChange={setSelectedModel}
          onTemperatureChange={setSelectedTemperature}
          onTopPChange={setSelectedTopP}
          onSearchStrictnessChange={setSelectedSearchStrictness}
          onTopKChange={setSelectedTopK}
          onEnableInDomainChange={setIsEnableInDomain}
        />
      </Dialog>
    </div>
  )
}

export default Layout
