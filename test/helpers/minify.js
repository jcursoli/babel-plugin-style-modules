export default function(input) {
  if (typeof input === 'string') {
    return input.replace(/\s/g,'');
  }
  throw(`minify expects a string, you passed in a type of ${ typeof input }`)
}
