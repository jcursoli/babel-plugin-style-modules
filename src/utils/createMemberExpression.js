export default function (
  { importName = 'babelGeneratedName',
    classValue,
    computed = false,
    t, } = {}
) {
  const importIdentifier = ~classValue.indexOf('.') ? classValue.split('.').shift() : importName;
  const classNameIdentifier = ~classValue.indexOf('.') ? classValue.split('.').pop() : classValue;
  let property = t.identifier(classNameIdentifier);
  if (!computed && /[^A-Za-z]/.test(classNameIdentifier)) {
    computed = true;
    property = t.stringLiteral(classNameIdentifier);
  }

  return t.memberExpression(
       t.identifier(importIdentifier),
       property,
       computed
     );
}
