/**
 * Web Haptics — wraps the browser Vibration API (navigator.vibrate)
 *
 * Works on: Android Chrome/Firefox, Samsung Internet
 * Silently no-ops on: iOS Safari (Apple blocks vibration from web),
 *                      desktop browsers, environments without Vibration API
 *
 * Pattern library mirrors native mobile haptic conventions:
 *  selection  — tiny blip for UI selections/toggles (8ms)
 *  light      — subtle tap feedback (14ms)
 *  medium     — standard button press (25ms)
 *  heavy      — important action (45ms)
 *  success    — short double-pulse for confirmations
 *  error      — rumble pattern for failures
 *  impact     — single strong impact (60ms)
 */

export type HapticPattern =
  | "selection"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "error"
  | "impact"

const patterns: Record<HapticPattern, number | number[]> = {
  selection: 8,
  light:     14,
  medium:    25,
  heavy:     45,
  impact:    60,
  success:   [30, 60, 30],
  error:     [80, 40, 80, 40, 120],
}

/** Fire haptic feedback. Safe to call anywhere — no-ops on unsupported devices. */
export function haptic(pattern: HapticPattern = "light"): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return
  try {
    navigator.vibrate(patterns[pattern])
  } catch {
    // Some browsers expose the API but throw in certain contexts
  }
}

/** React hook returning named haptic triggers. */
export function useHaptics() {
  return {
    haptic,
    selection: () => haptic("selection"),
    light:     () => haptic("light"),
    medium:    () => haptic("medium"),
    heavy:     () => haptic("heavy"),
    impact:    () => haptic("impact"),
    success:   () => haptic("success"),
    error:     () => haptic("error"),
  }
}
