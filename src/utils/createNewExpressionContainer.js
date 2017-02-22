import createMemberExpression from './createMemberExpression';

export default function (
  { styleImportName,
    value,
    computed = false,
    t } = {}
  ) {
  return t.jSXAttribute(
    t.jSXIdentifier('className'),
      t.jSXExpressionContainer(
        createMemberExpression({ t, importName: styleImportName, classValue: value, computed })
      )
    );
}
