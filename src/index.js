import checkConfigOptions from './utils/checkConfigOptions';
import createNewExpressionContainer from './utils/createNewExpressionContainer';
import editConditionalExpression from './utils/editConditionalExpression';
import throwIfNoImportNameExist from './utils/throwIfNoImportNameExist';
import createTemplateElement from './utils/createTemplateElement';

module.exports = function ({ types: t }) {
  const globalImports = {};
  const styleImportName = 'babelGeneratedName';
  return {
    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.source) {
          const { node: { source: { value } } } = path;
          const { opts } = state;
          if (checkConfigOptions(opts, value)) {
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
                  return createNewExpressionContainer({ styleImportName, value, t });
                }
                if (t.isJSXExpressionContainer(node.value)) {
                  const { value: { expression } } = node;
                  if (t.isStringLiteral(expression)) {
                    return createNewExpressionContainer({ styleImportName, value: expression.value, t });
                  }
                  if (t.isIdentifier(expression)) {
                    return createNewExpressionContainer({ styleImportName, value: expression.name, t, computed: true });
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
