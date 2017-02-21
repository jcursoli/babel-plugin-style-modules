export default function ({ imports, key, classNames }) {
  if (!~classNames.indexOf('.')) {
    // if no reference to an imported style object then return early
    return;
  }
  if (!imports[key]) {
    console.warn('you need to explicetly assign your imports if you have more than one style import');
    throw(`reference error: you tried calling a className that does not exist ${classNames}`)
  }
  classNames.split(' ').forEach((className) => {
    const name = className.split('.').pop();
    const importName = className.split('.').shift();
    if (!~imports[key].indexOf(importName)) {
      console.warn('you need to explicetly assign your imports if you have more than one style import');
      throw(`reference error: you tried calling a className that does not exist ${importName}.${name}`)
    }
  });
}
