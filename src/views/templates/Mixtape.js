import React, { useMemo } from 'react';
import get from 'lodash.get';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import css from '@styled-system/css';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  msToTime,
  useIsPlaying,
  useIsListening,
  useListen,
  usePlayerProgress
} from 'modules/player';
import { Waveform, useTrack } from 'modules/soundcloud';
import { MarqueeContainer as Marquee } from '@/packages/marquee';
import {
  Box,
  Breakpoints,
  Button,
  Logo,
  Spinner,
  Text,
  usePageWidth
} from 'theme';
import { CoverImage } from '../components/CoverImage';
import { Tracklist } from '../components/Tracklist';
import { Page } from '../layout';
import { PlayerIcon } from '../player';

const MixtapeContainer = styled('div')(
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: ['column']
  })
);

const MixtapeTitle = styled.div`
  ${css({
    borderBottom: 'container',
    pt: 4,
    pb: 3,
    mb: 4
  })}
`;

const MixtapeImage = styled.div`
  position: relative;
  flex-grow: 1;
  width: 60%;
`;

const MixtapeContent = styled(Box)`
  ${css({
    mb: 3,
    pb: 5,
    width: ['100%', '60%']
  })}
`;

const StyledPageTitle = styled(Page.Title)(
  css({
    fontSize: [5, 6],
    lineHeight: 1.25,
    pb: 2,
    textTransform: 'none'
  })
);

const StyledLogo = styled(Logo)`
  display: inline-block;
  margin-right: 7px;
  vertical-align: middle;
`;

const StyledMarquee = styled(Marquee)`
  ${css({ pb: 0 })}
`;

const MixtapeText = styled(Text)(
  css({
    mb: 3,
    pb: 2,
    // pt: 2,
    'a, a:active, a:visited': {
      color: 'accent'
    }
  }),
  {
    p: {
      textAlign: 'justify'
    }
  }
);

const WaveformControls = styled('div')(
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '26px',
    borderBottom: 'container'
  })
);

const StyledButton = styled(Button)(
  css({
    cursor: 'pointer',
    minWidth: 80
  })
);

const StyledPlayerIcon = styled(PlayerIcon)(
  css({
    height: 18,
    mr: 1,
    width: 15,
    svg: {
      verticalAlign: 'middle'
    }
  })
);

const MixtapeTemplate = ({ data, ...props }) => {
  const post = get(data, 'markdownRemark', null);

  const { frontmatter, html } = post;
  const {
    category,
    date,
    description,
    image,
    soundCloudUrl,
    title,
    tracklist = null
  } = frontmatter;

  const track = useTrack(soundCloudUrl);
  const tracklistJson = get(tracklist, 'childrenTracklistJson', null);
  const src = track?.stream_url ?? null;
  const meta = useMemo(
    () =>
      track
        ? {
            artist: track.user.username,
            cover: image.childImageSharp.fluid.src,
            duration: track.duration,
            title
          }
        : null,
    [track]
  );

  const isPlaying = useIsPlaying(src);
  const isListening = useIsListening(src);
  const progress = usePlayerProgress();
  const listenFunc = useListen(src, meta);
  const pageWidth = usePageWidth();

  const onClick = () => listenFunc();
  const onSeek = (progress) => listenFunc(progress);

  const memoizedDate = useMemo(
    () => formatDistanceToNowStrict(new Date(date)),
    []
  );
  const memoizedDuration = useMemo(() => msToTime(track?.duration), [
    track?.duration
  ]);
  const memoizedTitle = useMemo(
    () => <StyledPageTitle key={title}>{title}</StyledPageTitle>,
    []
  );

  const isSmallScreen = pageWidth <= Breakpoints.SM;

  return (
    <Page description={description} title={title} {...props}>
      <MixtapeContainer>
        <MixtapeImage>
          <CoverImage
            category={category}
            forceOverlay={isPlaying || isSmallScreen}
            onClick={onClick}
            image={image}
            mediaSrc={src}
          />
        </MixtapeImage>
        <MixtapeContent width={[1, 3 / 5]}>
          <MixtapeTitle>
            <StyledMarquee>{memoizedTitle}</StyledMarquee>
            <Text color="text.secondary" fontSize={4} p={0}>
              {description}
            </Text>
            <Text fontSize={2} pt="24px">
              <StyledLogo size={25} />
              Soul Provider ·{' '}
              <Text as="span" color="text.secondary">
                {memoizedDate} ago
              </Text>
            </Text>
          </MixtapeTitle>
          {!!html.length && (
            <MixtapeText as="div" dangerouslySetInnerHTML={{ __html: html }} />
          )}
          <Waveform
            duration={track?.duration}
            height={90}
            numSamples={120}
            onSeek={onSeek}
            progress={isListening ? progress : 0}
            waveformUrl={track?.waveform_url}
          />
          <WaveformControls>
            <StyledButton variant="primary" size="sm" onClick={onClick}>
              {track ? (
                <>
                  <StyledPlayerIcon size={12} src={src} />
                  {isPlaying ? 'Pause' : 'Listen'}
                </>
              ) : (
                <Spinner color="white" size={12} />
              )}
            </StyledButton>
            <Text color="text.secondary" pb={0}>
              {msToTime(isPlaying ? progress : null)} / {memoizedDuration}
            </Text>
          </WaveformControls>
          {tracklistJson && !isSmallScreen && (
            <>
              {/* <Heading as="h3">Tracklist</Heading> */}
              <Tracklist
                isPlaying={isPlaying}
                onSeek={onSeek}
                progress={isListening ? progress : 0}
                tracklist={tracklistJson}
              />
            </>
          )}
        </MixtapeContent>
      </MixtapeContainer>
    </Page>
  );
};

export default MixtapeTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        title
        category {
          id
          label
          colour
        }
        date
        description
        soundCloudUrl
        tracklist {
          childrenTracklistJson {
            artist
            start
            title
          }
        }
        image {
          childImageSharp {
            fluid(maxWidth: 768) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
  }
`;
