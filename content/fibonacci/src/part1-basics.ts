import {
    assertEquals,
    assertThrows
} from "https://deno.land/std@0.173.0/testing/asserts.ts"
import {Seq, isNat, fib, fib_37, fib_10} from "./sequence.ts"
import {assertTimed, timed} from "./benchmark.ts"


assertEquals(isNat(0n), true)
assertEquals(isNat(-1n), false)


assertThrows(() => fib(-1n), `The Fibonacci sequence is only defined for non-negative indices, such as -1.`)


for (let n = 0; n <= 10; n++) {
    const fib_n = fib(BigInt(n))
    console.log(`fib(${n})=${fib_n}`)
}


assertEquals(timed(fib, 37), fib_37)


const unrecursifiedFib: Seq = n => {
    if (!isNat(n)) {
        throw new Error(`The Fibonacci sequence is only defined for non-negative indices, such as ${n}.`)
    }

    if (n < 2n) {
        return n
    }

    let [i, fib_i, fib_i_1] = [1n, 1n, 0n]
    while (i < n) {
        [i, fib_i, fib_i_1] = [i + 1n, fib_i + fib_i_1, fib_i]
    }
    return fib_i
}


assertTimed(unrecursifiedFib, 10, fib_10)
assertTimed(unrecursifiedFib, 37, fib_37)

