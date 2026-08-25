import { IntegrationProviderId } from '../types';

export type SponsorProviderId = 'elevenlabs' | 'dodo_payments' | 'freshworks_studio';

export interface ProviderConfig {
  id: SponsorProviderId;
  shortName: string;
  productName: string;
  accent: string;
  glow: string;
  border: string;
  bg: string;
}

export const PROVIDER_CONFIG: Record<SponsorProviderId, ProviderConfig> = {
  elevenlabs: {
    id: 'elevenlabs',
    shortName: 'ElevenLabs',
    productName: 'ElevenAgents',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.35)',
    bg: 'rgba(56, 189, 248, 0.08)',
  },
  freshworks_studio: {
    id: 'freshworks_studio',
    shortName: 'Freshworks',
    productName: 'Freddy AI Agent Studio',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.35)',
    bg: 'rgba(168, 85, 247, 0.08)',
  },
  dodo_payments: {
    id: 'dodo_payments',
    shortName: 'Dodo Payments',
    productName: 'Dodo Payments Agents',
    accent: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.15)',
    border: 'rgba(251, 191, 36, 0.35)',
    bg: 'rgba(251, 191, 36, 0.08)',
  },
};

export const SPONSOR_ORDER: SponsorProviderId[] = [
  'elevenlabs',
  'freshworks_studio',
  'dodo_payments',
];

export function isSponsorProvider(id?: IntegrationProviderId | string): id is SponsorProviderId {
  return id === 'elevenlabs' || id === 'dodo_payments' || id === 'freshworks_studio';
}

export function getProviderConfig(id?: IntegrationProviderId | string): ProviderConfig | null {
  if (!isSponsorProvider(id)) return null;
  return PROVIDER_CONFIG[id];
}
