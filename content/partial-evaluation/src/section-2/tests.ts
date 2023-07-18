import {assertEquals} from "https://deno.land/std@0.187.0/testing/asserts.ts"

import {evaluate} from "./evaluator.ts"
import {at, binOp, if_} from "./expressions.ts"
import {var_} from "./values.ts"


Deno.test("[iteration 2] evaluate function", async (tctx) => {

    await tctx.step("use case", () => {
        const expr = if_(at(0), binOp(at(1), at(2)), -1)
        const v = var_("v")
        const data = [1, var_("v"), 2]
        assertEquals(evaluate(expr, data), binOp(v, 2))
    })


    await tctx.step("idempotency of an unknown", () => {
        const v = var_("v")
        assertEquals(evaluate(v, undefined), v)
    })

    await tctx.step("@ operator with unknowns", () => {
        const v = var_("v")
        const expr = at(0)
        assertEquals(evaluate(expr, v), expr)
        assertEquals(evaluate(expr, [v]), v)
    })

    await tctx.step("< operator with unknowns", () => {
        const l = var_("l")
        const r = var_("r")
        assertEquals(evaluate(binOp(l, at(1)), [true, false]), binOp(l, false))
        assertEquals(evaluate(binOp(at(0), r), [true, false]), binOp(true, r))
        assertEquals(evaluate(binOp(l, r), [true, false]), binOp(l, r))
    })

    await tctx.step("if operator with unknowns", () => {
        const v = var_("v")
        assertEquals(
            evaluate(
                if_(at(0), at(1), at(2)),
                [v, 1, -1]
            ),
            if_(v, 1, -1)
        )
    })

})

