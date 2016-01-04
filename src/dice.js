// importers can add more named dice to this array if they want
export const KnownDice = {
  fudge: range(-2, 2),
}

// create an array of values starting at start and endoing at stop, inclusive
function range(start, stop) {
  if (start > stop) {
    throw new TypeError(`start ${start} is greater than stop ${stop}`);
  }

  if (typeof start !== 'number')
    throw new TypeError(`start should be number but is ${start}`);

  if (typeof stop !== 'number')
    throw new TypeError(`stop should be number but is ${end}`);

  const result = [];
  for (let i = start; i <= stop; i++) {
    result.push(i);
  }
  return result;
}

// randomly choose an item from an array
function choose(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

// expected value of sampling an array
function expected(array) {
  const total = array.reduce((prev, cur) => prev + cur, 0);
  return total / array.length;
}

// get a faces array for the number of sides or a special prenamed dice
function withFaces(sidesCountOrName, fn) {
  const faces = KnownDice[sidesCountOrName] || range(1, sidesCountOrName);
  KnownDice[sidesCountOrName] = faces;
  return fn(faces);
}

// roll some dice with the given sides
// return an array of individual dice rolls
export function roll(dice, sidesCountOrName) {
  return withFaces(sidesCountOrName, sides => {
    const result = [];
    for (let i = 0; i < dice; i++) {
      result.push(choose(sides));
    }
    return result;
  });
}

// expected value of rolling a bunch of dice
// returns an array of individial expectations of rolls (so its easier to use
// with things that work with the return value of the `roll` function,
// supposedly)
// TODO: just return a Number?
export function expect(dice, sidesCountOrName) {
  return withFaces(sidesCountOrName, sides => {
    const result = [];
    for (let i = 0; i < dice; i++) {
      result.push(expected(sides));
    }
    return result;
  });
}
