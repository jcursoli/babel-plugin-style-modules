export default function (
  { t,
    importName,
    classValue = 'babelGeneratedName',
    computed = false } = {}
) {
  const importIdentifier = ~classValue.indexOf('.') ? classValue.split('.').shift() : importName;
  const classNameIdentifier = ~classValue.indexOf('.') ? classValue.split('.').pop() : classValue;
  return t.memberExpression(
       t.identifier(importIdentifier),
       t.identifier(classNameIdentifier),
       computed
     );
}
