type Value = number | boolean | undefined | Value[]

const isValue = (value: unknown): value is Value =>
       typeof value === "number"
    || typeof value === "boolean"
    || value === undefined
    || (Array.isArray(value) && value.every(isValue))


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


const evaluate = (expr: Expr, input: Value): Value => {
    if (isValue(expr)) {
        return expr
    }
    switch (expr.kind) {
        case "at": {
            return Array.isArray(input)
                ? input[expr.index]
                : undefined
        }
        case "binOp": {
            const evalLeft = evaluate(expr.left, input)
            const evalRight = evaluate(expr.right, input)
            switch (expr.op) {
                case "<": return (typeof evalLeft === "number" && typeof evalRight === "number")
                    ? evalLeft < evalRight
                    : undefined
                // More to follow?
            }
            // never reached:
            return undefined
        }
        case "if": {
            const evalGuard = evaluate(expr.guard, input)
            const evalThen = evaluate(expr.then, input)
            const evalElse = evaluate(expr.else, input)
            return evalGuard
                ? evalThen
                : evalElse
        }
    }
}


import {assertEquals} from "https://deno.land/std@0.187.0/testing/asserts.ts"

Deno.test("[iteration 1] evaluate function", async (tctx) => {

    await tctx.step("idempotency of values", () => {
        const assertIdempotent = (value: Value): void => {
            assertEquals(evaluate(value, undefined), value)
        }
        assertIdempotent(-1)
        assertIdempotent(0)
        assertIdempotent(1)
        assertIdempotent(false)
        assertIdempotent(true)
        assertIdempotent(undefined)
        assertIdempotent([])
        assertIdempotent([-1, 0, 1])
    })

    await tctx.step("@ operator", () => {
        assertEquals(evaluate(at(0), 0), undefined)
        assertEquals(evaluate(at(0), true), undefined)
        assertEquals(evaluate(at(0), false), undefined)
        assertEquals(evaluate(at(0), undefined), undefined)
        assertEquals(evaluate(at(0), []), undefined)
        assertEquals(evaluate(at(0), [37]), 37)
        assertEquals(evaluate(at(-1), [37]), undefined)
        assertEquals(evaluate(at(1), [37]), undefined)
    })

    await tctx.step("< operator", () => {
        assertEquals(evaluate(binOp(0, 1), undefined), true)
        assertEquals(evaluate(binOp(0, 0), undefined), false)
        assertEquals(evaluate(binOp(0, -1), undefined), false)
        assertEquals(evaluate(binOp(false, true), undefined), undefined)
    })

    await tctx.step("if operator w.r.t. JS-truthy vs. -falsy)", () => {
        assertEquals(evaluate(if_(true, 1, -1), undefined), 1)
        assertEquals(evaluate(if_(false, 1, -1), undefined), -1)
        assertEquals(evaluate(if_(undefined, 1, -1), undefined), -1)
        assertEquals(evaluate(if_(0, 1, -1), undefined), -1)
        assertEquals(evaluate(if_(1, 1, -1), undefined), 1)
        assertEquals(evaluate(if_(-1, 1, -1), undefined), 1)
        assertEquals(evaluate(if_([], 1, -1), undefined), 1)
    })

    await tctx.step("actual use case", () => {
        const expr = if_(at(0), binOp(at(0), at(1)), undefined)
        assertEquals(evaluate(expr, []), undefined)
        assertEquals(evaluate(expr, [1, 2]), true)
        assertEquals(evaluate(expr, [1, 0]), false)
    })

})
