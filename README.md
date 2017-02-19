# babel-plugin-style-modules
A babel plugin designed to allow your className's to be more intuitive and easier to reason about
# Usage
```
import React, { Component } from 'react';
import './app.sass';

class App extends Component {
  render() {
    const color = true ? 'green' : 'red';
    return (
      <div styleName='main border'>
        <div styleName={'red'}>Hello</div>
        <div styleName='yellow'>Hello</div>
        <div styleName='green border'>check</div>
        <div styleName={true ? 'blue' : 'orange'}>Hello</div>
        <div styleName={color}>Hello</div>
      </div>
    )
  }
}
export default App;
```
By using the styleName prop you can automatically chain classes and perform conditional expressions without having to prefix your class names such as `styles.main`. Chaining css module classes have never looked any better from ``${styles.main} ${styles.border}`` to `'main border'`. This plugin doesn't require any css extension preprocessor config files, just tell us what you are going to use (e.g. sass, scss, post-css).
