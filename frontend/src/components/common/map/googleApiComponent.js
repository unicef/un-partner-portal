
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ScriptCache } from '../../../helpers/google/ScriptCache';
import GoogleApi from '../../../helpers/google/GoogleApi';


const defaultCreateCache = (options = {}) => {
  const apiKey = options.apiKey;
  const libraries = options.libraries || ['places'];
  const version = options.version || '3.24';
  const language = options.language || 'en';

  return ScriptCache({
    google: GoogleApi({
      apiKey,
      language,
      libraries,
      version,
    }),
  });
};

export const wrapper = options => (WrappedComponent) => {
  const apiKey = options.apiKey;
  const libraries = options.libraries || ['places'];
  const version = options.version || '3';
  const createCache = options.createCache || defaultCreateCache;

  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.scriptCache = createCache(options);
      this.scriptCache.google.onLoad(this.onLoad.bind(this));

      this.state = {
        loaded: false,
        map: null,
        google: null,
      };
    }

    onLoad(err, tag) {
      this.setState({
        loaded: true,
        google: window.google,
      });
    }

    render() {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        google: this.state.google,
      });
      return (
        <div>
          <WrappedComponent {...props} />
          <div
            ref={(node) => { this.map = node; }}
            style={{
              width: 500,
              height: 300,
            }}
          />
        </div>
      );
    }
  }

  return Wrapper;
};

export default wrapper;
