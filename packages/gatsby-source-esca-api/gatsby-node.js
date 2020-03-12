"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _escaApiClient = _interopRequireDefault(require("@escaladesports/esca-api-client"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function fetchProducts(_x) {
  return _fetchProducts.apply(this, arguments);
}

function _fetchProducts() {
  _fetchProducts = (0, _asyncToGenerator2.default)(function* (options) {
    var {
      site,
      env,
      fields,
      salsify,
      skus,
      apiKey
    } = options;
    var client = new _escaApiClient.default({
      environment: env,
      site,
      apiKey
    });
    var products = yield client.loadProducts({
      fields,
      salsify,
      skus
    });
    return products;
  });
  return _fetchProducts.apply(this, arguments);
}

exports.sourceNodes = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (_ref2, options) {
    var {
      actions,
      createNodeId,
      createContentDigest
    } = _ref2;
    var {
      createNode
    } = actions;

    try {
      var products = yield fetchProducts(options);
      console.log("Building out nodes for ".concat(Object.keys(products).length, " Esca Products"));

      for (var product of products) {
        var nodeContent = _objectSpread({}, product);

        var nodeMeta = {
          id: createNodeId("escalade-products-".concat(product.sku || product.id)),
          parent: null,
          children: [],
          internal: {
            type: "EscaladeProducts",
            content: JSON.stringify(nodeContent),
            contentDigest: createContentDigest(nodeContent)
          }
        };

        var node = _objectSpread({}, nodeContent, {}, nodeMeta);

        createNode(node);
      }
    } catch (e) {
      console.log("Error With Product Request: ".concat(e));
      process.exit(1);
    }
  });

  return function (_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();