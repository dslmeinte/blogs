import {
    assertEquals
} from "https://deno.land/std@0.173.0/testing/asserts.ts"
import {Seq} from "./sequence.ts"


const timed = (seq: Seq, n: number): bigint => {
    const t0 = performance.now()
    const value = seq(BigInt(n))

    const t1 = performance.now()
    const elapsedInMs = t1 - t0

    console.log(`${seq.name}(${n}) = ${value}  took ${elapsedInMs.toFixed(3)}ms`)

    return value
}


const assertTimed = (seq: Seq, n: number, expected: bigint) => {
    assertEquals(timed(seq, n), expected)
}


export { timed, assertTimed }

