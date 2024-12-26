/*
 * Utility functions to decode/encode numbers and array's of numbers
 * to/from strings (Google Maps polyline encoding)
 *
 * Extends the L.Polyline and L.Polygon object with methods to convert
 * to and create from these strings.
 *
 * Jan Pieter Waagmeester <jieter@jieter.nl>
 *
 * Original code from:
 * http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/
 * (which is down as of december 2014)
 */

(function () {
  "use strict";

  const defaultOptions = function (options) {
    if (typeof options === "number") {
      // Legacy
      options = {
        precision: options,
      };
    } else {
      options = options || {};
    }

    options.precision = options.precision || 5;
    options.factor = options.factor || Math.pow(10, options.precision);
    options.dimension = options.dimension || 2;
    return options;
  };

  let PolylineUtil = {
    encode: function (points, options) {
      options = defaultOptions(options);

      let flatPoints = [];
      for (let i = 0, len = points.length; i < len; ++i) {
        let point = points[i];

        if (options.dimension === 2) {
          flatPoints.push(point.lat || point[0]);
          flatPoints.push(point.lng || point[1]);
        } else {
          for (let dim = 0; dim < options.dimension; ++dim) {
            flatPoints.push(point[dim]);
          }
        }
      }

      return this.encodeDeltas(flatPoints, options);
    },

    decode: function (encoded, options) {
      options = defaultOptions(options);

      let flatPoints = this.decodeDeltas(encoded, options);

      let points = [];
      for (
        let i = 0, len = flatPoints.length;
        i + (options.dimension - 1) < len;

      ) {
        let point = [];

        for (let dim = 0; dim < options.dimension; ++dim) {
          point.push(flatPoints[i++]);
        }

        points.push(point);
      }

      return points;
    },

    encodeDeltas: function (numbers, options) {
      options = defaultOptions(options);

      let lastNumbers = [];

      for (let i = 0, len = numbers.length; i < len; ) {
        for (let d = 0; d < options.dimension; ++d, ++i) {
          let num = numbers[i].toFixed(options.precision);
          let delta = num - (lastNumbers[d] || 0);
          lastNumbers[d] = num;

          numbers[i] = delta;
        }
      }

      return this.encodeFloats(numbers, options);
    },

    decodeDeltas: function (encoded, options) {
      options = defaultOptions(options);

      let lastNumbers = [];

      let numbers = this.decodeFloats(encoded, options);
      for (let i = 0, len = numbers.length; i < len; ) {
        for (let d = 0; d < options.dimension; ++d, ++i) {
          numbers[i] =
            Math.round(
              (lastNumbers[d] = numbers[i] + (lastNumbers[d] || 0)) *
                options.factor
            ) / options.factor;
        }
      }

      return numbers;
    },

    encodeFloats: function (numbers, options) {
      options = defaultOptions(options);

      for (let i = 0, len = numbers.length; i < len; ++i) {
        numbers[i] = Math.round(numbers[i] * options.factor);
      }

      return this.encodeSignedIntegers(numbers);
    },

    decodeFloats: function (encoded, options) {
      options = defaultOptions(options);

      let numbers = this.decodeSignedIntegers(encoded);
      for (let i = 0, len = numbers.length; i < len; ++i) {
        numbers[i] /= options.factor;
      }

      return numbers;
    },

    encodeSignedIntegers: function (numbers) {
      for (let i = 0, len = numbers.length; i < len; ++i) {
        let num = numbers[i];
        numbers[i] = num < 0 ? ~(num << 1) : num << 1;
      }

      return this.encodeUnsignedIntegers(numbers);
    },

    decodeSignedIntegers: function (encoded) {
      let numbers = this.decodeUnsignedIntegers(encoded);

      for (let i = 0, len = numbers.length; i < len; ++i) {
        let num = numbers[i];
        numbers[i] = num & 1 ? ~(num >> 1) : num >> 1;
      }

      return numbers;
    },

    encodeUnsignedIntegers: function (numbers) {
      let encoded = "";
      for (let i = 0, len = numbers.length; i < len; ++i) {
        encoded += this.encodeUnsignedInteger(numbers[i]);
      }
      return encoded;
    },

    decodeUnsignedIntegers: function (encoded) {
      let numbers = [];

      let current = 0;
      let shift = 0;

      for (let i = 0, len = encoded.length; i < len; ++i) {
        let b = encoded.charCodeAt(i) - 63;

        current |= (b & 0x1f) << shift;

        if (b < 0x20) {
          numbers.push(current);
          current = 0;
          shift = 0;
        } else {
          shift += 5;
        }
      }

      return numbers;
    },

    encodeSignedInteger: function (num) {
      num = num < 0 ? ~(num << 1) : num << 1;
      return this.encodeUnsignedInteger(num);
    },

    // This function is very similar to Google's, but I added
    // some stuff to deal with the double slash issue.
    encodeUnsignedInteger: function (num) {
      let value,
        encoded = "";
      while (num >= 0x20) {
        value = (0x20 | (num & 0x1f)) + 63;
        encoded += String.fromCharCode(value);
        num >>= 5;
      }
      value = num + 63;
      encoded += String.fromCharCode(value);

      return encoded;
    },
  };

  // Export Node module
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = PolylineUtil;
  }

  // Inject functionality into Leaflet
  if (typeof L === "object") {
    if (!L.Polyline.prototype.fromEncoded) {
      L.Polyline.fromEncoded = function (encoded, options) {
        return L.polyline(PolylineUtil.decode(encoded), options);
      };
    }
    if (!L.Polygon.prototype.fromEncoded) {
      L.Polygon.fromEncoded = function (encoded, options) {
        return L.polygon(PolylineUtil.decode(encoded), options);
      };
    }

    const encodeMixin = {
      encodePath: function () {
        return PolylineUtil.encode(this.getLatLngs());
      },
    };

    if (!L.Polyline.prototype.encodePath) {
      L.Polyline.include(encodeMixin);
    }
    if (!L.Polygon.prototype.encodePath) {
      L.Polygon.include(encodeMixin);
    }

    L.PolylineUtil = PolylineUtil;
  }
})();
