function checkExtensions (exts, sourceName) {
	const extension = ~sourceName.indexOf('.') ? sourceName.split('.').pop() : null;
	if (!extension) { return false; }
	if (exts[extension] === false) { return false; }
	// TODO change .sass default to .css
	return sourceName.endsWith('.sass');
}
function CreateNewExpressioContainer (
	{ styleImportName = 'babelGeneratedName',
		computed = false,
		value,
		t, } = {}
	) {
  return t.jSXAttribute (
    t.jSXIdentifier ('className'),
    	t.jSXExpressionContainer (
        t.memberExpression (
          t.identifier (styleImportName),
          t.identifier (value),
					computed
        )
      )
    )
}
function editTernaryExpression({node, styleImportName, t}) {
	let { value: { expression } } = node;
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
			newNode.consequent = t.memberExpression (
														 t.identifier (styleImportName),
														 t.identifier (value)
													)
		}
		if (t.isStringLiteral(newNode.alternate)) {
			const { alternate: { value } } = newNode;
			newNode.alternate = t.memberExpression (
														t.identifier (styleImportName),
														t.identifier (value)
													)
			}
	}
	recurse(expression);
	return node;
}
function createTemplateElement(values, styleImportName, t) {
	const quasis = values.split(' ').map((value, index) => {
		if (index === 0) {
			return t.templateElement({ raw: '', cooked: '' }, false);
		}
		return t.templateElement({ raw: ' ', cooked: ' ' }, false)
	});
	quasis.push(t.templateElement({ raw: '', cooked: '' }, true));

	const expressions = values.split(' ').map((value, index) => {
		return t.memberExpression (
				 t.identifier (styleImportName),
				 t.identifier (value)
			)
	});
	return t.jSXAttribute (
		t.jSXIdentifier ('className'),
			t.jSXExpressionContainer (
				t.templateLiteral (quasis, expressions)
			)
		)
}
module.exports = function({ types: t }) {
	const styleImportName = 'babelGeneratedName';
	return {
		visitor: {
			ImportDeclaration (path, state) {
				if (path.node.source) {
					const { node: { source: { value } } } = path;
					const { opts } = state;
					if (checkExtensions(opts, value)) {
						path.node.specifiers = [
							t.importDefaultSpecifier (
								t.identifier (styleImportName)
							)
						];
					}
				}
			},
			JSXElement (path, state) {
				if (path.node.openingElement.attributes) {
					const { node: { openingElement: { attributes } } } = path;
					path.node.openingElement.attributes =
						attributes.map(function (node, index) {
							if (t.isJSXIdentifier (node.name, { name: 'styleName' } )) {
								if (t.isStringLiteral (node.value)) {
									const { value: { value } } = node;
									if (node.value.value.trim().split(' ').length > 1) {
										return createTemplateElement (node.value.value, styleImportName, t);
									}
									return CreateNewExpressioContainer({ styleImportName, value, t });
								 }
								 if (t.isJSXExpressionContainer (node.value)) {
									 // TemplateLiteral
									let { value: { expression } } = node;
									if (t.isStringLiteral (expression)) {
										return CreateNewExpressioContainer ({ styleImportName, value: expression.value, t });
									}
									if (t.isIdentifier (expression)) {
										return CreateNewExpressioContainer ({ styleImportName, value: expression.name, t, computed: true });
									}
									if (t.isConditionalExpression (expression)) {
										return editTernaryExpression ({ node, styleImportName, t });
									}
								}
							}
						return node;
					});
				}
			}
		}
	};
};
