"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapRootElement = wrapRootElement;

var _react = _interopRequireDefault(require("react"));

var _reactEscaApi = require("@escaladesports/react-esca-api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapRootElement(_ref) {
  var {
    element
  } = _ref;
  return _react.default.createElement(_reactEscaApi.WithProducts, null, element);
}