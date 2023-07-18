type Var = {
    name: string
}
const var_ = (name: string) => ({ name })


const isVar = (value: unknown): value is Var =>
    typeof value === "object" && value !== null && "name" in value



type Value = number | boolean | undefined | Value[] | Var

const isValue = (value: unknown): value is Value =>
       typeof value === "number"
    || typeof value === "boolean"
    || value === undefined
    || (Array.isArray(value) && value.every(isValue))
    || isVar(value)


const valueAsText = (value: Value): string => {
    if (isVar(value)) {
        return value.name
    }
    if (Array.isArray(value)) {
        return `[${value.map(valueAsText).join(", ")}]`
    }
    return `${value}`
}


export type {
    Value,
    Var
}

export {
    isValue,
    isVar,
    valueAsText,
    var_
}

