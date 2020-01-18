import React from 'react';
import {graphql} from 'gatsby';
import {SEO} from '../components/Seo';
import {DangerousContent} from '../components/DangerousContent';
import {Layout} from '../components/Layout';

const getTagMetadata = tags => {
  if (tags == null) {
    return [];
  } else {
    return tags.map(({name}) => ({name: 'article:tag', content: name}));
  }
};

const getSectionMetadata = categories => {
  if (categories == null) {
    return [];
  } else {
    return categories.map(({name}) => ({name: 'article:section', content: name}));
  }
};

const getTimeMetadata = (publishedAt, modifiedAt) => [
  {name: `og:updated_time`, content: modifiedAt},
  {name: `article:published_time`, content: publishedAt},
  {name: `article:modified_time`, content: modifiedAt}
];

const Post = ({data}) => (
  <Layout>
    <SEO
      title={data.wordpressPost.title}
      description={data.wordpressPost.simpleExcerpt}
      image={data.wordpressPost.featured_media != null ? data.wordpressPost.featured_media.localFile.publicURL : null}
      meta={[
        ...getTimeMetadata(data.wordpressPost.iso, data.wordpressPost.modified),
        ...getTagMetadata(data.wordpressPost.tags),
        ...getSectionMetadata(data.wordpressPost.categories)
      ]}/>
    <h1 className="page__title">{data.wordpressPost.title}</h1>
      <DangerousContent content={data.wordpressPost.content}/>
  </Layout>
);

export const query = graphql`
  query ($id: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    
    wordpressPost(id: {eq: $id}) {
      date(formatString: "MMMM Do, YYYY")
      iso: date
      modified
      title
      content
      simpleExcerpt
      slug
      featured_media {
        localFile {
          publicURL
        }
      }
      categories {
        name
      }
      tags {
        id
        slug
        name
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`;

export default Post;
