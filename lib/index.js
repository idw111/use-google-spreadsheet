"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getSpreadsheetId = function getSpreadsheetId(url) {
  var pattern = /docs.google.com\/spreadsheets\/d\/([a-zA-Z0-9-]*)/;
  var match = url.match(pattern);
  if (!match) return null;
  return match[1];
};

var convertToSimpleJson = function convertToSimpleJson() {
  var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  console.log(rows);
  return rows.map(function (row) {
    var keys = Object.keys(row).filter(function (key) {
      return key.startsWith('gsx$');
    });
    return keys.reduce(function (simpleRow, key) {
      var _row$key;

      return _objectSpread({}, simpleRow, _defineProperty({}, key.replace('gsx$', ''), (_row$key = row[key]) === null || _row$key === void 0 ? void 0 : _row$key.$t));
    }, {});
  });
};

var useGoogleSpreadsheet = function useGoogleSpreadsheet(url) {
  var _useState = (0, _react.useState)({
    rows: null,
    isFetching: false
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  (0, _react.useEffect)(function () {
    var handleFetch =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(url) {
        var sheetId, endpoint, _data$feed, _ref2, data, rows;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('handleFetch', url);
                sheetId = getSpreadsheetId(url);
                endpoint = "https://spreadsheets.google.com/feeds/list/".concat(sheetId, "/1/public/full?alt=json");
                console.log('endpoint', endpoint);
                _context.prev = 4;
                _context.next = 7;
                return _axios["default"].get(endpoint, {});

              case 7:
                _ref2 = _context.sent;
                data = _ref2.data;
                rows = convertToSimpleJson(data === null || data === void 0 ? void 0 : (_data$feed = data.feed) === null || _data$feed === void 0 ? void 0 : _data$feed.entry);
                console.log(rows);
                setState({
                  rows: rows,
                  isFetching: false
                });
                _context.next = 18;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](4);
                console.error(_context.t0);
                setState({
                  rows: null,
                  isFetching: false
                });

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[4, 14]]);
      }));

      return function handleFetch(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    handleFetch(url);
  }, [url]); // handleFetch(url);

  return state;
};

var _default = useGoogleSpreadsheet;
exports["default"] = _default;