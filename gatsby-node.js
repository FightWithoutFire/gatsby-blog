const path = require('path');
const workboxBuild = require('workbox-build');

const allPostsQuery = `{
  allWordpressPost {
    edges {
      node {
        id
        slug
        title
      }
    }
  }
  
  allWordpressPage {
    edges {
      node {
        id
        slug
      }
    }
  }
  
  allWordpressCategory {
    edges {
      node {
        id
        count
        slug
        name
      }
    }
  }
  
  allWordpressTag {
    edges {
      node {
        id
        count
        slug
        name
      }
    }
  }  
}`;

const createPaginationPages = (component, totalItems, base, context, createPage) => {
  const pageSize = 10;
  const pageCount = Math.ceil(totalItems / pageSize);
  const pages = Array.from({length: pageCount}).map((_, index) => createPage({
    path: `${base}/page/${index + 1}`,
    component,
    context: {
      base,
      limit: pageSize,
      skip: index * pageSize,
      pageCount,
      currentPage: index + 1,
      ...context
    },
  }));
  const firstPage = pageCount > 0 && createPage({
    path: base,
    component,
    context: {
      base,
      limit: pageSize,
      skip: 0,
      pageCount,
      currentPage: 1,
      ...context
    }
  });
  return [...pages, firstPage];
};

const createPostPages = ({allWordpressPost}, createPage) => {
  return allWordpressPost.edges.map(({node}) => createPage({
    path: node.slug,
    component: path.resolve('./src/templates/post.js'),
    context: {id: node.id}
  }));
};

const createPagePages = ({allWordpressPage}, createPage) => {
  return allWordpressPage.edges.map(({node}) => createPage({
    path: node.slug,
    component: path.resolve('./src/templates/page.js'),
    context: {id: node.id}
  }));
};

const createPostsPages = ({allWordpressPost}, createPage) => createPaginationPages(
  path.resolve('./src/templates/posts.js'),
  allWordpressPost.edges.length,
  '/posts',
  {},
  createPage
);

const createCategoryPostsPages = ({allWordpressCategory}, createPage) => {
  return allWordpressCategory.edges.map(({node}) => createPaginationPages(
    path.resolve('./src/templates/categoryPosts.js'),
    node.count,
    `/category/${node.slug}`,
    node,
    createPage
  ));
};

const createTagPostsPages = ({allWordpressTag}, createPage) => {
  return allWordpressTag.edges.map(({node}) => createPaginationPages(
    path.resolve('./src/templates/tagPosts.js'),
    node.count,
    `/tag/${node.slug}`,
    node,
    createPage
  ));
};

const createAppShellPage = (createPage) => {
  return process.env.NODE_ENV === 'production' && createPage({
    path: `/offline-plugin-app-shell-fallback`,
    component: path.resolve(`./src/app-shell.js`)
  });
};

exports.createPages = ({graphql, actions: {createPage}}) => {
  return graphql(allPostsQuery).then(({errors, data}) => {
    if (errors) throw errors;
    else {
      return [
        createPagePages(data, createPage),
        createPostPages(data, createPage),
        createPostsPages(data, createPage),
        createCategoryPostsPages(data, createPage),
        createTagPostsPages(data, createPage),
        createAppShellPage(createPage)
      ];
    }
  });
};

exports.onPostBuild = () => {
  return workboxBuild.injectManifest({
    swSrc: `./src/sw.js`,
    swDest: `public/sw.js`,
    globDirectory: `public`,
    globPatterns: [
      `offline-plugin-app-shell-fallback/index.html`,
      `**/*.woff2`,
      `app-*.js`,
      `commons-*.js`,
      `webpack-runtime-*.js`,
      `manifest.webmanifest`,
      `component---src-app-shell-js-*.js`
    ]
  }).then(({ count, size, warnings }) => {
    if (warnings) warnings.forEach(warning => console.warn(warning));
  });
};
