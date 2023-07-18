import {isValue, Value, valueAsText} from "./values.ts"


type At = {
    kind: "at"
    index: number
}
const at = (index: number): At => ({ kind: "at", index })

type BinOp = {
    kind: "binOp"
    op: "<"
    left: Expr
    right: Expr
}
const binOp = (left: Expr, right: Expr): BinOp => ({ kind: "binOp", op: "<", left, right })

type If = {
    kind: "if"
    guard: Expr
    then: Expr
    else: Expr
}
const if_ = (guard: Expr, then: Expr, else_: Expr): If => ({ kind: "if", guard, then, "else": else_ })


type Expr = Value | At | If | BinOp


const exprAsAsciiDoc = (expr: Expr): string => {
    if (isValue(expr)) {
        return valueAsText(expr)
    }
    const q = (keyword: string) => `\`${keyword}\``
    switch (expr.kind) {
        case "at": return `${q("@")}${expr.index}`
        case "binOp": return `${exprAsAsciiDoc(expr.left)} ${q("<")} ${exprAsAsciiDoc(expr.right)}`
        case "if": return `${q("if")} ${exprAsAsciiDoc(expr.guard)} ${q("then")} ${exprAsAsciiDoc(expr.then)} ${q("else")} ${exprAsAsciiDoc(expr.else)}`
    }
}


export type {
    At, BinOp, Expr, If
}

export {
    at, binOp, if_,
    exprAsAsciiDoc
}

