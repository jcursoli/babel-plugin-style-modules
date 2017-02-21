export default function ({ value: values, styleImportName, t }) {
  const quasis = values.trim().split(' ').map((value, index) => {
    if (index === 0) {
      return t.templateElement({ raw: '', cooked: '' }, false);
    }
    return t.templateElement({ raw: ' ', cooked: ' ' }, false);
  });
  quasis.push(t.templateElement({ raw: '', cooked: '' }, true));

  const expressions = values.trim().split(' ').map((value) => (
    createMemberExpression({ t, importName: styleImportName, classValue: value })
    )
  );
  return t.jSXAttribute(
    t.jSXIdentifier('className'),
      t.jSXExpressionContainer(
        t.templateLiteral(quasis, expressions)
      )
    );
}
