import React from 'react';
import Link from 'gatsby-link';
import styled from '@emotion/styled';
import css from '@styled-system/css';

import { Flex, Heading, Logo } from 'theme';

import { Links } from './Links';
import { Icons } from './Icons';

const HeaderContainer = styled('header')(
  css({
    bg: 'bg',
    borderBottom: 0,
    fontFamily: 'heading',
    position: ['fixed', 'relative'],
    top: 0,
    right: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: [2, 5],
    py: [2, 4],
    zIndex: 2,
    'a, a:active, a:visited': {
      color: 'textPrimary'
    }
  })
);

const HeaderNavigation = styled('div')(
  css({
    display: ['none', 'flex']
  })
);

const HeaderIcons = styled(Icons)(
  css({
    display: ['none', null, null, 'flex']
  })
);

const HeaderLinks = styled(Links)(
  css({
    ml: 4
  })
);

export const Header = () => (
  <HeaderContainer>
    <Flex alignItems="center">
      <Link to="/">
        <Logo mr={3} />
      </Link>
      <Heading as="h3" p={0}>
        <Link to="/">SOUL PROVIDER</Link>
      </Heading>
    </Flex>
    <HeaderNavigation>
      <HeaderIcons />
      <HeaderLinks />
    </HeaderNavigation>
  </HeaderContainer>
);
