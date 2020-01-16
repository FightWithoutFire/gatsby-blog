import React from "react"
import {graphql} from "gatsby"
import {SEO} from '../components/Seo';

const Posts = ({data, pageContext}) => (
  <main>
    <SEO title={pageContext.name}/>
    {data.allWordpressPost.edges.map(({node}) => (
      <p key={node.id}>{node.excerpt}</p>
    ))}
    {/*<Pagination*/}
    {/*  pageCount={pageContext.pageCount}*/}
    {/*  currentPage={pageContext.currentPage}*/}
    {/*  base={pageContext.base}/>*/}
  </main>
);

export const query = graphql`
  query($skip: Int!, $limit: Int!, $id: String!) {    
    allWordpressPost(sort: {fields: [date], order:DESC}, limit: $limit, skip: $skip, filter: {categories: {elemMatch: {id: {eq: $id}}}}) {
      edges {
        node {
          id
          date(formatString: "MMMM Do, YYYY")
          title
          excerpt
          slug
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
    }
  }
`;

export default Posts;
