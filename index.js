function checkExtensions(exts, sourceName) {
  const extension = ~sourceName.indexOf('.') ? sourceName.split('.').pop() : null;
  if (!extension) { return false; }
  if (exts[extension] === false) { return false; }
  if (exts[extension] === true) { return true; }
  return sourceName.endsWith('.css');
}
function createMemberExpression(
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
function CreateNewExpressioContainer(
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
function editConditionalExpression({ node, styleImportName, t }) {
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
function throwIfNoImportNameExist({ imports, key, classNames }) {
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
function createTemplateElement({ value: values, styleImportName, t }) {
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
module.exports = function ({ types: t }) {
  const globalImports = {};
  const styleImportName = 'babelGeneratedName';
  return {
    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.source) {
          const { node: { source: { value } } } = path;
          const { opts } = state;
          if (checkExtensions(opts, value)) {
            if (path.node.specifiers.length) {
              const { node: { specifiers }, hub: { file: { opts: { filename } } } } = path;
              globalImports[filename] = globalImports[filename] ?
                [...globalImports[filename], specifiers[0].local.name] :
                [specifiers[0].local.name];
              return;
            }
            path.node.specifiers = [
              t.importDefaultSpecifier(
                t.identifier(styleImportName)
              ),
            ];
          }
        }
      },
      JSXElement(path, state) {
        if (path.node.openingElement.attributes) {
          const { node: { openingElement: { attributes } } } = path;
          path.node.openingElement.attributes =
            attributes.map((node) => {
              if (t.isJSXIdentifier(node.name, { name: 'styleName' })) {
                if (t.isStringLiteral(node.value)) {
                  const { value: { value } } = node;
                  if (value.trim().split(' ').length > 1) {
                    const { hub: { file: { opts: { filename } } } } = path;
                    throwIfNoImportNameExist({ key: filename, imports: globalImports, classNames: value });
                    return createTemplateElement({ value, styleImportName, t });
                  }
                  return CreateNewExpressioContainer({ styleImportName, value, t });
                }
                if (t.isJSXExpressionContainer(node.value)) {
                  const { value: { expression } } = node;
                  if (t.isStringLiteral(expression)) {
                    return CreateNewExpressioContainer({ styleImportName, value: expression.value, t });
                  }
                  if (t.isIdentifier(expression)) {
                    return CreateNewExpressioContainer({ styleImportName, value: expression.name, t, computed: true });
                  }
                  if (t.isConditionalExpression(expression)) {
                    return editConditionalExpression({ node, styleImportName, t });
                  }
                }
              }
              return node;
            });
        }
      },
    },
  };
};
