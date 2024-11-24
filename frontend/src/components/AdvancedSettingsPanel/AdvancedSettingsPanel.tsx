import React, { useState, useEffect } from 'react'
import { Stack, Dropdown, IDropdownOption, Slider, Checkbox } from '@fluentui/react'
import styles from './AdvancedSettingsPanel.module.css' // Ensure this is your provided CSS

interface AdvancedSettingsPanelProps {
  models: string[]
  temperatureLow: number
  temperatureHigh: number
  topPLow: number
  topPHigh: number
  searchStrictnessLow: number
  searchStrictnessHigh: number
  topKLow: number
  topKHigh: number
  selectedModel: string
  selectedTemperature: number
  selectedTopP: number
  selectedSearchStrictness: number
  selectedTopK: number
  isEnableInDomain: boolean
}

const AdvancedSettingsPanel: React.FC<AdvancedSettingsPanelProps> = ({
  models,
  temperatureLow,
  temperatureHigh,
  topPLow,
  topPHigh,
  searchStrictnessLow,
  searchStrictnessHigh,
  topKLow,
  topKHigh,
  selectedModel,
  selectedTemperature,
  selectedTopP,
  selectedSearchStrictness,
  selectedTopK,
  isEnableInDomain
}) => {
  const [model, setModel] = useState(selectedModel)
  const [temperature, setTemperature] = useState(selectedTemperature)
  const [topP, setTopP] = useState(selectedTopP)
  const [searchStrictness, setSearchStrictness] = useState(selectedSearchStrictness)
  const [topK, setTopK] = useState(selectedTopK)
  const [enableInDomain, setEnableInDomain] = useState(isEnableInDomain)

  // Save settings to local storage
  useEffect(() => {
    const settings = {
      model,
      temperature,
      topP,
      searchStrictness,
      topK,
      enableInDomain
    }
    localStorage.setItem('advancedSettings', JSON.stringify(settings))
  }, [model, temperature, topP, searchStrictness, topK, enableInDomain])

  const handleModelChange = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) setModel(option.key as string)
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} className={styles.container}>
      <Dropdown
        label="Select Model"
        options={models.map(model => ({ key: model, text: model }))}
        selectedKey={model}
        onChange={handleModelChange}
        placeholder="Choose a model"
        className={styles.chatGroup}
      />
      <Slider
        label="Temperature"
        min={temperatureLow}
        max={temperatureHigh}
        step={0.01}
        value={temperature}
        onChange={setTemperature}
        className={styles.chatGroup}
      />
      <Slider
        label="Top P"
        min={topPLow}
        max={topPHigh}
        step={0.01}
        value={topP}
        onChange={setTopP}
        className={styles.chatGroup}
      />
      <Slider
        label="Search Strictness"
        min={searchStrictnessLow}
        max={searchStrictnessHigh}
        step={1}
        value={searchStrictness}
        onChange={setSearchStrictness}
        className={styles.chatGroup}
      />
      <Slider
        label="Top K"
        min={topKLow}
        max={topKHigh}
        step={1}
        value={topK}
        onChange={setTopK}
        className={styles.chatGroup}
      />
      <Checkbox
        label="Enable In Domain"
        checked={enableInDomain}
        onChange={(_, checked) => setEnableInDomain(!!checked)}
        className={styles.chatGroup}
      />
    </Stack>
  )
}

export default AdvancedSettingsPanel
