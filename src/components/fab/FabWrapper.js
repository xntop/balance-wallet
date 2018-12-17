import PropTypes from 'prop-types';
import React, { createElement } from 'react';
import { hoistStatics } from 'recompact';
import styled from 'styled-components/primitives';
import { withSafeAreaViewInsetValues } from '../../hoc';
import { FlexItem, Row } from '../layout';
import SendFab from './SendFab';
import WalletConnectFab from './WalletConnectFab';

const FabWrapperBottomPosition = 21;

const Wrapper = styled(Row)`
  bottom: ${({ bottomInset }) => (bottomInset + FabWrapperBottomPosition)};
  position: absolute;
  right: 12;
`;

const FabWrapper = ({
  children,
  disabled,
  fabs,
  safeAreaInset,
}) => (
  <FlexItem>
    {children}
    <Wrapper bottomInset={safeAreaInset.bottom} direction="row-reverse">
      {fabs.map((fab, index) => (
        createElement(fab, {
          disabled,
          key: index,
          style: {
            marginLeft: (index > 0) ? 12 : 0,
          },
        })
      ))}
    </Wrapper>
  </FlexItem>
);

FabWrapper.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fabs: PropTypes.arrayOf(PropTypes.func).isRequired,
  safeAreaInset: PropTypes.shape({ bottom: PropTypes.number }),
};

FabWrapper.defaultProps = {
  fabs: [SendFab],
};

FabWrapper.bottomPosition = FabWrapperBottomPosition;

export default hoistStatics(withSafeAreaViewInsetValues)(FabWrapper);
