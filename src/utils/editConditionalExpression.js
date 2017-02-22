import createMemberExpression from './createMemberExpression';

export default function ({ node, styleImportName, t }) {
  const { value: { expression } } = node;
  node.name.name = 'className';
  function recurse(newNode) {
    if (t.isConditionalExpression(newNode.consequent)) {
      recurse(newNode.consequent);
    }
    if (t.isConditionalExpression(newNode.alternate)) {
      recurse(newNode.alternate);
    }
    if (t.isStringLiteral(newNode.consequent)) {
      const { consequent: { value } } = newNode;
      newNode.consequent = createMemberExpression({ t, importName: styleImportName, classValue: value });
    }
    if (t.isStringLiteral(newNode.alternate)) {
      const { alternate: { value } } = newNode;
      newNode.alternate = createMemberExpression({ t, importName: styleImportName, classValue: value });
    }
  }
  recurse(expression);
  return node;
}
