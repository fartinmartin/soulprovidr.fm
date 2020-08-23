import React from 'react';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Masonry from 'react-masonry-css';
import { Global, css } from '@emotion/core';

import ArticleCard from '@/articles/components/ArticleCard';
import SubscribeWidget from '@/common/components/SubscribeWidget';
import PlayerCard from '@/player/components/PlayerCard';
import { Container, Box, Heading } from '@/ui';

const globalStyles = css`
  .masonry-container {
    display: flex;
    margin-left: -30px;
  }

  .masonry-column {
    padding-left: 30px;
    background-clip: padding-box;
  }
`;

// const radioArticle = {

// };

function Home({ data }) {
  const posts = get(data, 'allMarkdownRemark.edges');
  return (
    <Container as="main" display={['block']}>
      <Helmet title="Home" />
      <Global styles={globalStyles} />
      <Box width={[1, 1 / 2]} mx={[0, 'auto']} mb={[5, 0]}>
        <PlayerCard />
      </Box>
      <SubscribeWidget />
      <Box width={[1]} mt={5}>
        <Heading as="h5" mb={4}>
          LATEST CONTENT:
        </Heading>
        <Masonry
          breakpointCols={{
            default: 3,
            768: 1
          }}
          className="masonry-container"
          columnClassName="masonry-column"
        >
          {posts.map(({ node: post }) => (
            <ArticleCard
              post={post}
              key={post.frontmatter.title}
              sx={{ mb: 4 }}
            />
          ))}
        </Masonry>
      </Box>
    </Container>
  );
}

export default Home;

export const pageQuery = graphql`
  query HomeQuery {
    allMarkdownRemark(
      sort: { fields: frontmatter___date, order: DESC }
      limit: 6
    ) {
      edges {
        node {
          id
          html
          frontmatter {
            title
            author {
              id
              name
            }
            category {
              id
              label
              colour
            }
            date
            description
            soundCloudUrl
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
    }
  }
`;
