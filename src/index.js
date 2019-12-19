/**
 * _.get(data, 'content')
 *
 * -->
 *
 * data?.content
 *
 */
module.exports = function ({ types: t }) {
	return {
		visitor: {
			ExpressionStatement(path) {

				if (t.isOptionalMemberExpression(path.node.expression)) return;
				if (
					(typeof path.node.expression.callee !== 'undefined' &&
					!!path.node.expression.callee) &&
					t.isIdentifier(path.node.expression.callee.object, { name: '_' }) &&
					t.isIdentifier(path.node.expression.callee.property, { name: 'get' })
				) {
          const obj = path.node.expression.arguments[0].name
          const prop = path.node.expression.arguments[1].value
					const expression = makeOptionalMemberExpression(obj, prop, t)

					path.replaceWith(
						t.ExpressionStatement(expression)
					);

					console.log('over ---->')
				}
			}
		}
	}
}

function makeOptionalMemberExpression(a, b, t) {
	// const optionalMemberExpression = {
	// 	type: 'OptionalMemberExpression',
	// 	object: {
	// 		type: 'Identifier',
	// 		name: a
	// 	},
	// 	property: {
	// 		type: "Identifier",
	// 		name: b
	// 	},
	// 	computed: false,
	// 	optional: true
	// }
	const object = t.toExpression({
		type: 'Identifier',
		name: a
	})
	const property = t.identifier(b)

	return t.optionalMemberExpression(object, property, false, true)
}
