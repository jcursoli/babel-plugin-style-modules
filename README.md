# babel-plugin-style-modules
A babel plugin designed to allow your className's to be more intuitive and easier to reason about
# Usage

By using the styleName prop you can automatically chain classes and perform conditional expressions without having to prefix your class names such as `styles.main`. Chaining css module classes have never looked any better from ``` {`${styles.main} ${styles.border}`} ``` to `'main border'`. This plugin doesn't require any css extension/preprocessor configurations, just tell us what you are going to use (e.g. sass, scss, less) and let your Webpack config take care of the rest.
```JSX
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
If you want to import multiple style modules then you will have to take a few more steps.  
&nbsp;&nbsp;&nbsp;&nbsp;1) explicitly define your imports (e.g. `import style1 from './cssfile.css'`)  
&nbsp;&nbsp;&nbsp;&nbsp;2) prefix your classNames with the object it is associated with (e.g. `<div styleName='style1.green style1.border'>check</div>`)

# Configuration
In your .babelrc file add
`"plugins": [
    ["babel-plugin-style-modules", { "sass": true, "css": true } ]
  ]`.
By indicating false on a extension name babel-plugin-style-modules will not operate on the import statement. babel-plugin-style-modules only looks for .css file extensions by default any others will have to be added to the options object in the .babelrc file.

# Why?
Why not use babel-plugin-react-css-modules? I just want a simple transformer, nothing that handles preprocessor transpilation or className hashing. I believe most of the heavy lifting should be done within your own webpack implementation.

# Limitations
At the moment you cannot define a className from a variable if you are importing multiple style modules   
```JSX
const color = true ? 'app.green' : 'app.red';
<div styleName={color}>Hello</div>
```
