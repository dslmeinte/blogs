import {fib_10, fib_42, fib_78, Nat, Seq} from "./sequence.ts"
import {assertTimed} from "./benchmark.ts"
import {fibLifted, LiftedSeq} from "./part3-better.ts"


type Register = [
    /** value of Sequence @ number that's this entry's key */
    value: bigint,
    /** the number of times that key has been the Sequence's argument */
    nCalled: number
]
type CountingMemory = { [number: string]: Register }
const memoisedWithCountingMemory = (F: LiftedSeq): Seq & { memory: CountingMemory } => {
    const memory: CountingMemory = {}
    const f = (n: Nat) => {
        let entry = memory["" + n]
        if (entry === undefined) {
            entry = [ F(f)(n), 1 ]
            memory["" + n] = entry
        } else {
            entry[1]++
        }
        return entry[0]
    }
    f.memory = memory
    return f
}

const memoisedFibWithCountingMemory = memoisedWithCountingMemory(fibLifted)

assertTimed(memoisedFibWithCountingMemory, 10, fib_10)
assertTimed(memoisedFibWithCountingMemory,42, fib_42)
assertTimed(memoisedFibWithCountingMemory,78, fib_78)

console.dir(memoisedFibWithCountingMemory.memory)

