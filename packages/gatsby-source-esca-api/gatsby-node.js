"use strict";

var _escaApiClient = _interopRequireDefault(require("@escaladesports/esca-api-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function fetchProducts(_x) {
  return _fetchProducts.apply(this, arguments);
}

function _fetchProducts() {
  _fetchProducts = _asyncToGenerator(function* (options) {
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

exports.sourceNodes =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (_ref2, options) {
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