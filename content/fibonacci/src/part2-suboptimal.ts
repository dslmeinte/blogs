import {
    assertEquals
} from "https://deno.land/std@0.173.0/testing/asserts.ts"
import {fib, fib_37, fib_78, isNat, Nat, Seq} from "./sequence.ts"
import {assertTimed} from "./benchmark.ts"


type Memory = { [number: string]: bigint }
const memoisingFib: Seq = n => {

    const memory: Memory = {}

    const fib: Seq = n => {
        if (!isNat(n)) {
            throw new Error(`The Fibonacci sequence is not defined for non-negative indices such as ${n}.`)
        }
        return n < 2n
            ? n
            : F(n-1n) + F(n-2n)
    }

    const F: Seq = n => {
        let storedValue = memory["" + n]
        if (storedValue === undefined) {
            storedValue = fib(n)
            memory["" + n] = storedValue
        }
        return storedValue
    }

    return F(n)
}

assertTimed(memoisingFib, 78, fib_78)


const fib2 = (F: Seq, n: Nat) => {
    if (!isNat(n)) {
        throw new Error(`The Fibonacci sequence is not defined for non-negative indices such as ${n}.`)
    }
    return n < 2n
        ? n
        : F(n-1n) + F(n-2n)
}


// benchmark via other means than `time`/`assert`:
assertEquals(fib2(fib, 37n), fib_37)


const memoisedSeq2 = (F: (seq: Seq, n: Nat) => bigint): Seq => {
    const memory: Memory = {}
    const mF: Seq = n => {
        let storedValue = memory["" + n]
        if (storedValue === undefined) {
            storedValue = F(mF, n)
            memory["" + n] = storedValue
        }
        return storedValue
    }
    return mF
}


const memoisedFib2 = memoisedSeq2(fib2)
assertTimed(memoisedFib2, 37, fib_37)


// export for other files' benefit:
export type {
    Memory
}

