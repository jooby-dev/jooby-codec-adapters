// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
if ( !('EPSILON' in Number) ) {
    Number.EPSILON = 2.220446049250313e-16;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
// Otto (ChirpStack v3) is ES5 and has no Number.isInteger.
if ( typeof Number.isInteger !== 'function' ) {
    Number.isInteger = function ( value ) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };
}
