import React from 'react';
import get from 'lodash/get';
import { graphql } from 'gatsby';
import Masonry from 'react-masonry-css';
import { Global, css } from '@emotion/core';
import { Box } from 'theme';

import ArticleCard from '../components/ArticleCard';
import { CTABanner } from '../subscribe';
import { Page } from '../layout';

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

function Newsletters({ data }) {
  const posts = get(data, 'allMarkdownRemark.edges');
  return (
    <Page title="Newsletters">
      <Global styles={globalStyles} />
      <Page.Title>Newsletters</Page.Title>
      <Page.Content>
        <CTABanner />
        <Box>
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
      </Page.Content>
    </Page>
  );
}

export default Newsletters;

export const pageQuery = graphql`
  query NewslettersQuery {
    allMarkdownRemark(
      filter: { frontmatter: { category: { id: { eq: "newsletter" } } } }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 6
    ) {
      edges {
        node {
          id
          html
          fields {
            slug
          }
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
