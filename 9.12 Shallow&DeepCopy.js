var arr = [
    {name: 'Sarah', address: {houseNo: '10A', street: "Oak Lane", city: "Los Angeles", state:"California"}},
    {name: 'Michael', address: {houseNo: 'B-5', street: "River Road", city: "Chicago", state:"Illinois"}},
    {name: 'Emily', address: {houseNo: '42', street: "Maple Ave", city: "Toronto", state:"Ontario"}}
]

arr2 = [...arr]
arr2[0].name = 'ketan'
arr2[0].address.state = 'Telangana'
console.log(arr[0] === arr2[0])
//true

info = {...arr[2]};
info.name = 'ketan'
info.address.state = 'Telangana'
console.log(arr[2] === info)
//false

//write deepCopy function
function deepCopy(value, cache = new WeakMap()) {
    // 1. Handle Primitives and non-copyable types (null, undefined, functions)
    if (value === null || typeof value !== 'object') {
        return value;
    }
    // 2. Handle known built-in objects that need special copying
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    if (value instanceof RegExp) {
        // Create a new RegExp with the same source and flags
        return new RegExp(value.source, value.flags);
    }

    // 3. Handle Circular References (check cache)
    // If the object is already in the cache, it means we have encountered it before
    // (it's a circular reference), so return the existing copy.
    if (cache.has(value)) {
        return cache.get(value);
    }

    // 4. Initialize the copied structure (array or object)
    const copy = Array.isArray(value) ? [] : {};

    // 5. Store the copy in the cache *before* iterating over its properties.
    // This is essential to prevent infinite recursion if the object references itself
    // later in the iteration cycle (e.g., obj.self = obj).
    cache.set(value, copy);

    // 6. Recursively copy all properties
    for (const key in value) {
        // Ensure we only copy own properties
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            // Recursively call deepCopy for the property value
            copy[key] = deepCopy(value[key], cache);
        }
    }

    return copy;
}
