/** Performance metrics class */
import { performance } from 'node:perf_hooks';

export class PerfPro {

  #app = 'perfpro';

  /**
   * Create a new performance profiler
   * @param {string} appName - the application name
   */
  constructor(appName) {
    this.#app = appName || this.#app;
  }


  /**
   * Generate the app mark name
   * @private
   * @param {string|undefined} name - mark name
   * @returns {string}
   */
  #name(name = '') {
    return `[${ this.#app }] ${ name }`;
  }


  /**
   * Fetch array of unique mark names for app
   * @private
   * @returns {Array} [ {String} ]
   */
  #getMarkNames() {

    const app = this.#name();

    return [...new Set(
      [ ...performance.getEntriesByType('mark') ]
        .filter(e => e.name.startsWith( app ))
        .map(e => e.name.slice(app.length))
    )];

  }


  /**
   * Record a performance mark
   * Call twice with same name to set start and end
   * @param {string} name - mark name
   */
  mark(name) {
    performance.mark( this.#name(name) );
  }


  /**
   * Calculate mark duration (to now if second mark not made)
   * @param {string} name - mark name
   * @returns {number|undefined}
   */
  duration(name) {

    const
      mark = performance.getEntriesByName( this.#name(name), 'mark' ),
      ml = mark.length;

    if (!ml) return;

    const
      m0 = mark[0].startTime,
      m1 = ml === 1 ? performance.now() : mark.at(-1).startTime;

    return m1 - m0;

  }


  /**
   * Return an array of durations for all marks
   * @param {Array|undefined} limit - names to include
   * @param {Array|undefined} omit - names to omit
   * @returns {Array} [ { name, duration } objects ]
   */
  allDurations(limit, omit) {

    return this.#getMarkNames()
      .filter( name => (!limit || limit.includes(name)) && (!omit || !omit.includes(name)) )
      .map( name => ({ name, duration: this.duration(name) }) );

  }


  /**
   * Clear marks for app
   * @param {string|undefined} name - mark name. Omit to clear all.
   */
  clear(name) {

    if (name) {
      // single clear
      performance.clearMarks(this.#name(name));
    }
    else {
      // clear all
      this.#getMarkNames()
        .map( name => performance.clearMarks(this.#name(name)) );
    }

  }

}
