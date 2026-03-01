### 💡 Data Types

JavaScript has two main categories of data types: Primitive and Non-Primitive (Objects).

* **Primitive Types** (Value stored directly in the variable)
* **`Number`**: Represents both integer and floating-point values, standard is 64-bit floating point.
* **`String`**: Sequences of characters enclosed in double quotes (`""`) or single quotes (`''`). They are functionally the same.
* **`Boolean`**: Logical entity with two values: `true` or `false`.
* **`undefined`**: A value automatically assigned to variables that have been declared but not yet assigned a value, or for missing function arguments.
* **`null`**: An intentional absence of any object value. It must be explicitly set.
* **`BigInt`** (ES2019): Used to represent whole numbers larger than $2^{53} - 1$ (the maximum safe integer for `Number`). Limited only by available heap memory.
* **`Symbol`** (ES2015): A unique and immutable data type often used to create unique object property keys.


* **Non-Primitive Types** (Reference types)
* **`Object`**: The most fundamental non-primitive type. Used to store collections of key-value pairs.
* **`Array`**: An ordered list of values, functionally an object with number indices.
* **`Function`**: A callable object.



### 🏷️ Variable Declaration (`var`, `let`, `const`)

| Feature | `var` (Old) | `let` (ES6) | `const` (ES6) |
| --- | --- | --- | --- |
| **Scope** | Function-scoped. | Block-scoped. | Block-scoped. |
| **Redeclaration** | **Allowed** within the same scope. | **Not allowed** in the same scope. | **Not allowed** in the same scope. |
| **Reassignment** | Allowed. | Allowed. | **Not allowed** (Must be initialized). |
| **Hoisting** | Hoisted, initialized with `undefined`. | Hoisted, but not initialized (leads to TDZ). | Hoisted, but not initialized (leads to TDZ). |

* **Temporal Dead Zone (TDZ)**: The period of time during which `let` and `const` variables exist but cannot be accessed, starting from the beginning of their scope until their declaration is processed.

### ❓ Type Checking

* **`typeof`**: An **operator** that returns a string indicating the data type of an operand (e.g., `'string'`, `'number'`, `'boolean'`). *Note: `typeof null` returns `'object'`, which is a historical bug.*
* **`instanceof`**: An **operator** that tests whether an object in its prototype chain has the `prototype` property of a constructor. Used to check if an object is an instance of a particular class or constructor.

### ⚙️ Functions

* **Higher-Order Functions (HOF)**: A function that either:
1. Takes one or more functions as arguments (e.g., `map`, `filter`, `setTimeout`).
2. Returns a function as its result.


* **Closure**: A function that "remembers" its lexical (static/written) scope even when the function is executed outside that lexical scope. This allows the inner function to access variables from its containing (outer) function, even after the outer function has finished execution and been removed from the call stack.

---

## 🔁 Asynchronous JavaScript, Event Loop, and Concurrency

### 🧵 Execution Model

* JavaScript (in the browser or Node.js) is fundamentally **Single-Threaded**.
* All user code runs on the **Call Stack**.
* **Node.js/Browser API (Web API)**: External environments that handle asynchronous tasks (e.g., timers, network requests, file I/O) off the main JS thread.

### 🔄 Event Loop Mechanism

* **Asynchronous Architecture**: Node.js handles multiple tasks concurrently using an event-driven, non-blocking I/O model.
* **Process**:
1. An asynchronous function is invoked on the **Call Stack** and immediately removed (non-blocking).
2. The task is executed in the **Node/Web API** environment.
3. Once the asynchronous task is complete, its **callback** is moved to a queue.
4. The **Event Loop** constantly checks if the Call Stack is empty. If it is, the Event Loop pushes the waiting callback from the queue onto the Call Stack for execution.



### 🤝 Asynchronous Patterns

* **Callbacks (CBs)**: Functions passed as arguments to be executed later.
* **Callback Hell (Nesting)**: Deeply nested callbacks for sequential async operations (solvable by linearizing the code).
* **Inversion of Control**: The async function (often from a third-party library) is responsible for calling the callback, potentially leading to issues if it calls it multiple times or not at all.


* **Promises (ES6)**: Objects representing the eventual completion (or failure) of an asynchronous operation and its resulting value.
* **Chaining**: Solves nesting by allowing subsequent `.then()` calls on the returned Promise.
* **Inversion of Control Solved**: The `.then()` and `.catch()` methods are controlled by the JS engine/Promise implementation, not the third-party library, ensuring the callback is called correctly.
* **Microtask Queue**: Promises use a separate queue (the Microtask Queue) for their callbacks (the functions inside `.then()`/`.catch()`). The **Microtask Queue has higher priority** than the standard Callback (Macrotask) Queue.


* **`async/await` (ES2017)**: Syntactic sugar built on top of Promises to make asynchronous code appear and behave more like synchronous code, improving readability.
* An `async` function implicitly returns a **Promise**.
* The `await` keyword pauses the execution of the `async` function until the Promise it is applied to is resolved or rejected.



---

## 🧠 Advanced Theoretical JS Q&A

### Q1: What is the difference between *Shallow Copy* and *Deep Copy* in JavaScript, and why is this relevant for non-primitive types?

**A:**

* **Shallow Copy**: Creates a new object/array, but **copies the references** of nested objects. Changes in a nested object in the copy will affect the original, as they point to the same memory location.
* *Methods*: Spread operator (`...`), `Object.assign()`.


* **Deep Copy**: Creates a new object/array and **recursively copies all nested values**. The copied object is fully independent of the original.
* *Methods*: For simple objects, `JSON.parse(JSON.stringify(object))` works, but fails with functions, Dates, `undefined`, and Symbols. A proper deep copy requires a recursive utility function or a library like Lodash's `cloneDeep`.


* **Relevance**: Non-primitive types (Objects/Arrays) are reference types. Modifying a property in a shallow copy often leads to unintended side effects on the original object, which deep copying prevents.

### Q2: Explain *Prototypal Inheritance* and the role of the `__proto__` and `prototype` properties.

**A:**

* **Prototypal Inheritance**: JavaScript's mechanism for inheritance. Instead of classes, objects inherit features from other objects through a **prototype chain**.
* **`prototype` (Property on Functions/Constructors)**: This property is used to set up the prototype chain. The object assigned to a constructor's `prototype` property will become the parent for all instances created by that constructor.
* **`__proto__` (Internal/Legacy Property on Instances)**: This (or the standard `Object.getPrototypeOf()`) is the actual link in the chain. It points to the prototype object of the constructor that created the instance.
* **Chain**: When you try to access a property on an object, if it's not found, the search continues up the `__proto__` chain until it reaches `null` (the end of the chain).

### Q3: What is *Lexical Scoping* and how does it relate to Closures?

**A:**

* **Lexical Scoping**: The rule that determines where variables are accessible. It means the scope of a variable is defined by its physical location (where it is written) within the code, not where it is called.
* **Relation to Closure**: When a function is defined, it *lexically* encloses (captures) its surrounding environment (variables from its outer function). A **closure** is the practical outcome of lexical scoping: the inner function maintains access to these captured variables even after the outer function's execution context is destroyed.

### Q4: Why is a Promise callback considered a *Microtask* and how does this affect the Event Loop execution order?

**A:**

* **Microtask Queue**: A separate queue that holds tasks like resolved Promises (`.then()`, `.catch()`, `.finally()`) and `MutationObserver` callbacks.
* **Priority**: The **Event Loop prioritizes the Microtask Queue** over the standard **Macrotask Queue** (or Callback Queue, which holds tasks like `setTimeout`, `setInterval`, I/O).
* **Execution Order**: After the Call Stack is empty, the Event Loop will empty the entire **Microtask Queue** before it processes *one* task from the **Macrotask Queue**. This ensures Promise resolutions are handled more immediately than I/O or timer events.

### Q5: Explain the difference between *Coercion* and *Casting*.

**A:**

* **Coercion**: **Implicit** type conversion performed automatically by JavaScript when operators are applied to values of different types (e.g., `1 + '2'` results in `'12'`).
* *Types*: **To Boolean** (e.g., in an `if` statement), **To String** (e.g., using `+` with a string), **To Number** (e.g., in a math operation).


* **Casting**: **Explicit** type conversion performed by the programmer using built-in functions (e.g., `Number('1')`, `String(1)`, `Boolean(0)`).
* **Key Distinction**: Coercion is *automatic*, Casting is *manual*.
