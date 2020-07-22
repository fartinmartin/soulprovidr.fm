import React from 'react';

import { Badge, Box } from '@/ui';

const transitionTimingFn = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

const cardStyles = {
  position: 'relative',
  cursor: 'pointer',
  transition: `transform 200ms ${transitionTimingFn}`,
  '&:hover': {
    transform: 'translate3d(0, -2px, 0)'
  }
};

const badgeStyles = {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1
};

const overlayStyles = {
  bg: 'rgba(0, 0, 0, 0.2)',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1,
  transition: `opacity 200ms ${transitionTimingFn}`,
  opacity: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    opacity: 1
  }
};

export const ContentCard = ({
  badgeColour,
  badgeText,
  children,
  image,
  onClick,
  overlayContent,
  sx = {},
  ...props
}) => {
  const customCardStyles = { ...cardStyles, ...sx };
  return (
    <Box onClick={onClick} sx={customCardStyles} {...props}>
      <Badge bg={badgeColour} sx={badgeStyles}>
        {badgeText}
      </Badge>
      <Box position="relative">
        {overlayContent && <Box sx={overlayStyles}>{overlayContent}</Box>}
        {image}
      </Box>
      <Box py={2}>{children}</Box>
    </Box>
  );
};

export const FeatureCard = ({
  badgeColour,
  badgeText,
  children,
  image,
  onClick,
  overlayContent,
  sx = {},
  ...props
}) => {
  const customBadgeStyles = { ...badgeStyles, bg: badgeColour };
  const customCardStyles = { ...cardStyles, ...sx };
  return (
    <Box onClick={onClick} sx={customCardStyles} {...props}>
      <Badge sx={customBadgeStyles}>{badgeText}</Badge>
      <Box position="relative">
        {overlayContent && <Box sx={overlayStyles}>{overlayContent}</Box>}
        {image}
      </Box>
      {children && <Box py={2}>{children}</Box>}
    </Box>
  );
};