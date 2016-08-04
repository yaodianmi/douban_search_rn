// __tests__/DbSearch-test.js
import 'react-native';
import React from 'react';
import douban_search_rn from '../index.ios';

// Note: test renderer must be required after react-native.
import renderer from 'react/lib/ReactTestRenderer';

describe('douban_search_rn', () => {

  it('renders correctly', () => {
    const tree = renderer.create(
      <douban_search_rn />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});
