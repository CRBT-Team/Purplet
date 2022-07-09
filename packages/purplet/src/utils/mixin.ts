/**
 * Copies all methods, getters, and setters from `baseClass` to `derivedClass`. Use carefully.
 *
 * - Does not copy constructor property definitions.
 * - Does not do anything with types. use the following trick to get types to extend.
 *
 *   ```typescript
 *   interface DerivedClass extends BaseClass {}
 *   ```
 */
export function applyMixin(derivedClass: any, baseClass: any) {
  Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
    Object.defineProperty(
      derivedClass.prototype,
      name,
      Object.getOwnPropertyDescriptor(baseClass.prototype, name)!
    );
  });
}
