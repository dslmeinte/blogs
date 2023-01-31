type Nat = bigint
const isNat = (num: Nat): num is Nat =>
    num >= 0


type Seq = (n: Nat) => bigint


const fib: Seq = n => {
    if (!isNat(n)) {
        throw new Error(`The Fibonacci sequence is only defined for non-negative indices, such as ${n}.`)
    }
    return n < 2n
        ? n
        : fib(n - 1n) + fib(n - 2n)
}


const fib_10 = 55n
const fib_37 = 24157817n
const fib_42 = 267914296n
const fib_78 = 8944394323791464n


export type { Nat, Seq }
export { isNat, fib, fib_10, fib_37, fib_42, fib_78 }

