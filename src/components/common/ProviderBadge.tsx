import React from 'react';
import { cn } from '../../utils/cn';
import { getProviderConfig, isSponsorProvider } from '../../utils/providerConfig';
import { IntegrationProviderId } from '../../types';

interface ProviderBadgeProps {
  provider?: IntegrationProviderId | string;
  size?: 'sm' | 'md';
  showProduct?: boolean;
  className?: string;
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({
  provider,
  size = 'sm',
  showProduct = false,
  className,
}) => {
  if (!isSponsorProvider(provider)) return null;

  const config = getProviderConfig(provider)!;
  const label = showProduct ? config.productName : config.shortName;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium shrink-0',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className
      )}
      style={{
        color: config.accent,
        borderColor: config.border,
        backgroundColor: config.bg,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.accent }}
      />
      {label}
    </span>
  );
};
