"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon,
  PauseIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

type StepperControlsProps = {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  onStepForward: () => void
  onStepBackward: () => void
  onTogglePlay: () => void
  onReset: () => void
}

export function StepperControls({
  currentStep,
  totalSteps,
  isPlaying,
  onStepForward,
  onStepBackward,
  onTogglePlay,
  onReset,
}: StepperControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onStepBackward}
        disabled={currentStep <= 0}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onTogglePlay}>
        <HugeiconsIcon
          icon={isPlaying ? PauseIcon : PlayIcon}
          className="size-3.5"
        />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onStepForward}
        disabled={currentStep >= totalSteps - 1}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
      </Button>
      <span className="min-w-12 text-center text-xs tabular-nums text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={onReset}>
        <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
      </Button>
    </div>
  )
}
