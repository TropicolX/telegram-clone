import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-opacity': 'var(--color-primary-opacity)',
        'primary-opacity-hover': 'var(--color-primary-opacity-hover)',
        'primary-tint': 'var(--color-primary-tint)',
        'primary-shade': 'var(--color-primary-shade)',
        background: 'var(--color-background)',
        'background-compact-menu': 'var(--color-background-compact-menu)',
        'background-secondary': 'var(--color-background-secondary)',
        'background-own': 'var(--color-background-own)',
        'background-selected': 'var(--color-background-selected)',
        'chat-hover': 'var(--color-chat-hover)',
        'chat-active': 'var(--color-chat-active)',
        'chat-active-greyed': 'var(--color-chat-active-greyed)',
        'color-item-active': 'var(--color-item-active)',
        'color-item-hover': 'var(--color-item-hover)',
        'color-text': 'var(--color-text)',
        'color-text-secondary': 'var(--color-text-secondary)',
        'color-borders': 'var(--color-borders)',
        dividers: 'var(--color-dividers)',
        links: 'var(--color-links)',
        gray: 'var(--color-gray)',
        green: 'var(--color-green)',
        'green-darker': 'var(--color-green-darker)',
        success: 'var(--color-success)',
        'reply-hover': 'var(--color-reply-hover)',
        'reply-own-hover': 'var(--color-reply-own-hover)',
        'reply-own-active': 'var(--color-reply-own-active)',
        'accent-own': 'var(--color-accent-own)',
        code: 'var(--color-code)',
        'code-bg': 'var(--color-code-bg)',
        'message-reaction': 'var(--color-message-reaction)',
        'voice-transcribe-button': 'var(--color-voice-transcribe-button)',
        'peer-7': 'var(--color-peer-7)',
        'peer-bg-7': 'var(--color-peer-bg-7)',
        'peer-gradient-7': 'var(--color-peer-gradient-7)',
        'peer-8': 'var(--color-peer-8)',
        'peer-bg-8': 'var(--color-peer-bg-8)',
        'peer-gradient-8': 'var(--color-peer-gradient-8)',
        'peer-9': 'var(--color-peer-9)',
        'peer-bg-9': 'var(--color-peer-bg-9)',
        'peer-gradient-9': 'var(--color-peer-gradient-9)',
        'peer-10': 'var(--color-peer-10)',
        'peer-bg-10': 'var(--color-peer-bg-10)',
        'peer-gradient-10': 'var(--color-peer-gradient-10)',
        'peer-11': 'var(--color-peer-11)',
        'peer-bg-11': 'var(--color-peer-bg-11)',
        'peer-gradient-11': 'var(--color-peer-gradient-11)',
        'peer-12': 'var(--color-peer-12)',
        'peer-bg-12': 'var(--color-peer-bg-12)',
        'peer-gradient-12': 'var(--color-peer-gradient-12)',
        'peer-13': 'var(--color-peer-13)',
        'peer-bg-13': 'var(--color-peer-bg-13)',
        'peer-gradient-13': 'var(--color-peer-gradient-13)',
        'peer-14': 'var(--color-peer-14)',
        'peer-bg-14': 'var(--color-peer-bg-14)',
        'peer-gradient-14': 'var(--color-peer-gradient-14)',
        'peer-15': 'var(--color-peer-15)',
        'peer-bg-15': 'var(--color-peer-bg-15)',
        'peer-gradient-15': 'var(--color-peer-gradient-15)',
        'peer-16': 'var(--color-peer-16)',
        'peer-bg-16': 'var(--color-peer-bg-16)',
        'peer-gradient-16': 'var(--color-peer-gradient-16)',
        'peer-17': 'var(--color-peer-17)',
        'peer-bg-17': 'var(--color-peer-bg-17)',
        'peer-bg-active-17': 'var(--color-peer-bg-active-17)',
        'peer-gradient-17': 'var(--color-peer-gradient-17)',
        'peer-18': 'var(--color-peer-18)',
        'peer-bg-18': 'var(--color-peer-bg-18)',
        'peer-bg-active-18': 'var(--color-peer-bg-active-18)',
        'peer-gradient-18': 'var(--color-peer-gradient-18)',
        'peer-19': 'var(--color-peer-19)',
        'peer-bg-19': 'var(--color-peer-bg-19)',
        'peer-bg-active-19': 'var(--color-peer-bg-active-19)',
        'peer-gradient-19': 'var(--color-peer-gradient-19)',
        'peer-20': 'var(--color-peer-20)',
        'peer-bg-20': 'var(--color-peer-bg-20)',
        'peer-bg-active-20': 'var(--color-peer-bg-active-20)',
        'peer-gradient-20': 'var(--color-peer-gradient-20)',
        'webpage-initial-background': 'var(--color-webpage-initial-background)',
        'color-borders-alternate': 'var(--color-borders-alternate)',
        'color-text-meta-apple': 'var(--color-text-meta-apple)',
        'color-text-green': 'var(--color-text-green)',
        'color-text-green-rgb': 'var(--color-text-green-rgb)',
        'color-text-meta': 'var(--color-text-meta)',
        'color-text-meta-rgb': 'var(--color-text-meta-rgb)',
        'color-text-lighter': 'var(--color-text-lighter)',
        accent: 'var(--accent-color)',
        'accent-background': 'var(--accent-background-color)',
        'accent-background-active': 'var(--accent-background-active-color)',
        'interactive-active': 'var(--color-interactive-active)',
        'interactive-inactive': 'var(--color-interactive-inactive)',
        'interactive-buffered': 'var(--color-interactive-buffered)',
        'interactive-element-hover': 'var(--color-interactive-element-hover)',
        'theme-background': 'var(--theme-background-color)',
      },
    },
  },
  plugins: [],
} satisfies Config;
