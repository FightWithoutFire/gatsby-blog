import React from 'react';
import {Link} from 'gatsby';
import './Tags.css';

export const Tags = ({tags}) => (
  <ul className="tags">
    {tags != null && tags.map(({id, name, slug, count}) => (
      <li key={id}>
        <Link to={`/tag/${slug}`}>
          {name}
          {` `}
          {count && <strong>{count}</strong>}
        </Link>
      </li>
    ))}
  </ul>
);
