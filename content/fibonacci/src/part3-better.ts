import {fib_10, fib_42, fib_78, isNat, Seq} from "./sequence.ts"
import {assertTimed} from "./benchmark.ts"
import {Memory} from "./part2-suboptimal.ts"


const fibLifted = (F: Seq): Seq => n => {
    if (!isNat(n)) {
        throw new Error(`The Fibonacci sequence is not defined for non-negative indices such as ${n}.`)
    }
    return n < 2n
        ? n
        : F(n-1n) + F(n-2n)
}


type LiftedSeq = (seq: Seq) => Seq

const fibLifted_typecheck: LiftedSeq = fibLifted


const memoised = (F: LiftedSeq): Seq => {
    const memory: Memory = {}
    const mF: Seq = n => {
        let storedValue = memory["" + n]
        if (storedValue === undefined) {
            storedValue = F(mF)(n)
            memory["" + n] = storedValue
        }
        return storedValue
    }
    return mF
}

const memoisedFib = memoised(fibLifted)

assertTimed(memoisedFib, 42, fib_42)
assertTimed(memoisedFib, 78, fib_78)


const identity = (F: LiftedSeq): Seq => {
    const f: Seq = n => F(f)(n)
    return f
}

assertTimed(identity(fibLifted), 10, fib_10)


export type { LiftedSeq }
export { fibLifted }

