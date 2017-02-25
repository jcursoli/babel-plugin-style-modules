import createMemberExpression from './createMemberExpression';

export default function (
  { styleImportName,
    classValue,
    computed = false,
    t } = {}
  ) {
  return t.jSXAttribute(
    t.jSXIdentifier('className'),
      t.jSXExpressionContainer(
        createMemberExpression({ t, importName: styleImportName, classValue, computed })
      )
    );
}
