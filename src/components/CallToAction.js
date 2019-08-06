import React from 'react';
import styled from '@emotion/styled';
import {LinkButton, Spacer} from '../theme';

export const ActionDiv = styled.div`
  background-color: rgba(0, 0, 0, .05);
  padding: 2em 4em;
  display: flex;
  align-items: center;
  
  @media (max-width: 800px) {
    padding: 2em;
  }
`;

export const CallToAction = ({description, action, link}) => (
  <ActionDiv>
    <span>{description}</span>
    <Spacer/>
    <LinkButton to={link}>{action}</LinkButton>
  </ActionDiv>
);
