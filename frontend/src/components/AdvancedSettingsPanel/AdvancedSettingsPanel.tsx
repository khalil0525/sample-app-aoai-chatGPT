import React, { useState, useEffect } from 'react'
import { Stack, Dropdown, IDropdownOption, Slider, Checkbox } from '@fluentui/react'
import styles from './AdvancedSettingsPanel.module.css'

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
  onModelChange: (model: string) => void
  onTemperatureChange: (temperature: number) => void
  onTopPChange: (topP: number) => void
  onSearchStrictnessChange: (searchStrictness: number) => void
  onTopKChange: (topK: number) => void
  onEnableInDomainChange: (enableInDomain: boolean) => void
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
  isEnableInDomain,
  onModelChange,
  onTemperatureChange,
  onTopPChange,
  onSearchStrictnessChange,
  onTopKChange,
  onEnableInDomainChange
}) => {
  const handleModelChange = (_: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) onModelChange(option.key as string)
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} className={styles.container}>
      <Dropdown
        label="Select Model"
        options={models.map(model => ({ key: model, text: model }))}
        selectedKey={selectedModel}
        defaultSelectedKey={selectedModel}
        onChange={handleModelChange}
        placeholder="Choose a model"
        className={styles.chatGroup}
      />
      <Slider
        label="Temperature"
        min={temperatureLow}
        max={temperatureHigh}
        step={0.01}
        value={selectedTemperature}
        onChange={onTemperatureChange}
        className={styles.chatGroup}
      />
      <Slider
        label="Top P"
        min={topPLow}
        max={topPHigh}
        step={0.01}
        value={selectedTopP}
        onChange={onTopPChange}
        className={styles.chatGroup}
      />
      <Slider
        label="Search Strictness"
        min={searchStrictnessLow}
        max={searchStrictnessHigh}
        step={1}
        value={selectedSearchStrictness}
        onChange={onSearchStrictnessChange}
        className={styles.chatGroup}
      />
      <Slider
        label="Top K"
        min={topKLow}
        max={topKHigh}
        step={1}
        value={selectedTopK}
        onChange={onTopKChange}
        className={styles.chatGroup}
      />
      <Checkbox
        label="Enable In Domain"
        checked={isEnableInDomain}
        onChange={(_, checked) => onEnableInDomainChange(!!checked)}
        className={styles.chatGroup}
      />
    </Stack>
  )
}

export default AdvancedSettingsPanel
