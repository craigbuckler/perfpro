# PerfPro: Node.js performance profiler

PerfPro is a wrapper for the high-resolution [Node.js Performance measurement API](https://nodejs.org/docs/latest/api/perf_hooks.html).

PerfPro objects are initialized with a name so you can record and analyse `my-app-or-module` performance without affecting `another-app-or-module`. Two or more PerfPro objects initialized with the same name share data across a whole application.


## Installation

```sh
npm install perfpro
```


## Example

```js
// initialize app performance object
import { PerfPro } from 'perfpro';
const perf = new PerfPro('my-app');

// mark the start of an operation
perf.mark('process-data');

// ... operations ...

// mark the end of the operation
perf.mark('process-data');

// get the duration in milliseconds
// e.g. 42.552
console.log( perf.duration('process-data') );

// get all durations as an array of objects
// [ { name: 'process-data', duration: 42.552 }, ... ]
console.log( perf.allDurations() );

// clear a specific app mark
perf.clear('process-data');

// clear all marks for the app
perf.clear();

// show time since application started
console.log( perf.now() );
```


## API

### `new PerfPro(appName)`

Creates a new performance profiler instance.

* `appName` (string): the application/namespace name (used to identify marks).

### `mark(name)`

Records a performance mark. Call twice with the same name to set start and end.

* `name` (string): the mark name

### `duration(name)`

Returns the duration in milliseconds between the first and last mark made. If only one mark exists, it measures from the first mark to now.

* `name` (string): the mark name.
* returns: `number | undefined`

### `allDurations(limit, omit)`

Returns an array of `{ name, duration }` objects for all marks.

* `limit` (array, optional): names to include
** `omit` (array, optional): names to exclude

### `clear(name)`

Clears marks for the app.

* `name` (string, optional): mark name. Pass nothing to to clear all marks for the app.


### `now()`

Returns time since application started.
