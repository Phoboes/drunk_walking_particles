# Drunken particles

A quick experiment for the fox and rabbit ecosystem with genetics.


Cells are able to breed, hold the traits of either predator or prey.

A typical cell has these traits:

```js
  var model = {
    type: type,
    speed: speed,
    size: size,
    lifespan: lifespan,
    timesSinceLastFed: Date.now(),
    timesSinceLastBred: Date.now(),
    createdAt: Math.floor(Date.now() / 1000),
    X: x,
    Y: y,
    genes: genes,
    color: color,
    hue: 0
  };
  ```


All cells wander randomly within the bounds of a the canvas.
If two cells cross paths:


If they are the same type and breeding is enabled:
- Create a child cell somewhere on the page

If they are predator/prey:
- The predator's life counter is reset to 0
- The prey item is destroyed.
