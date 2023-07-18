import {isValue, isVar, Value} from "./values.ts"
import {Expr} from "./expressions.ts"


const evaluate = (expr: Expr, input: Value): Expr => {
    if (isValue(expr)) {
        return expr
    }
    switch (expr.kind) {
        case "at": {
            if (isVar((input))) {
                return expr
            }
            return Array.isArray(input)
                ? input[expr.index]
                : undefined
        }
        case "binOp": {
            const evalLeft = evaluate(expr.left, input)
            const evalRight = evaluate(expr.right, input)
            if (isVar(evalLeft) || isVar(evalRight)) {
                return { kind: "binOp", op: "<", left: evalLeft, right: evalRight }
            }
            switch (expr.op) {
                case "<": return (typeof evalLeft === "number" && typeof evalRight === "number")
                    ? evalLeft < evalRight
                    : undefined
            }
            // never reached:
            return undefined
        }
        case "if": {
            const evalGuard = evaluate(expr.guard, input)
            const evalThen = evaluate(expr.then, input)
            const evalElse = evaluate(expr.else, input)
            if (isVar(evalGuard)) {
                return { kind: "if", guard: evalGuard, then: evalThen, "else": evalElse }
            }
            return evalGuard
                ? evalThen
                : evalElse
        }
    }
}


export {
    evaluate
}

