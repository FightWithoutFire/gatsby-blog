import React from 'react';
import './Button.css';
import {Link} from 'gatsby';
import {OutboundLink} from 'gatsby-plugin-google-analytics';

export const Button = ({isLink, isOutbound, isSimple, children, className, ...props}) => (
  <>
    {isLink && !isOutbound &&
      <Link
        className={isSimple ? `button button__link--simple ${className}` : `button button__link ${className}`}
        {...props}>
        {children}
      </Link>}
    {isLink && isOutbound &&
    <OutboundLink
      target="_blank"
      rel="noopener noreferrer"
      className={isSimple ? `button button__link--simple ${className}` : `button button__link ${className}`}
      {...props}>
      {children}
    </OutboundLink>}
    {!isLink && !isOutbound && <button
        className={isSimple ? `button button__normal--simple ${className}` : `button button__normal ${className}`}
        {...props}>
        {children}
      </button>}
  </>
);
