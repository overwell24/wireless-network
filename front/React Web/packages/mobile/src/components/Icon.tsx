// src/components/Icon.tsx
import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import type { LucideProps as BaseLucideProps } from 'lucide-react-native';

type IconNames = keyof typeof LucideIcons;

interface LucideProps extends BaseLucideProps {
  strokeWidth?: number;
  stroke?: string;
}

interface CustomIconProps extends Omit<LucideProps, 'color'> {
  name: IconNames;
  color?: string;
  size?: number;
}

export const Icon = ({ name, color = 'black', size = 24, ...props }: CustomIconProps) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<LucideProps>;
  return <IconComponent strokeWidth={2} stroke={color} size={size} {...props} />;
};
