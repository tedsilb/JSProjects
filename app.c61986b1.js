// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app.ts":[function(require,module,exports) {
var startGameButton, saveTargetNumberButton;
var saveUpperLimitButton, saveguessNumberButton;
var targetRow, upperLimitRow;
var guessNumberRow, highLowRow;
var targetNumberInput, upperLimitInput, guessNumberInput;
var resultText, highResultText, lowResultText;
var targetNo = 0;
var upperNo = 0;
var lowerNo = 1;
var guessNo = 0;

var sleep = function sleep(milliseconds) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, milliseconds);
  });
};

var notOk = function notOk(num) {
  return !num || isNaN(num);
};

var setHighAndLow = function setHighAndLow() {
  highResultText.innerHTML = upperNo.toString();
  lowResultText.innerHTML = lowerNo.toString();
};

var saveTargetNumber = function saveTargetNumber() {
  targetNo = parseInt(targetNumberInput.value);
  targetNumberInput.value = '';
  if (notOk(targetNo)) return;
  targetRow.style.display = 'none';
  upperLimitRow.style.display = 'block';
  upperLimitInput.focus();
};

var saveUpperLimit = function saveUpperLimit() {
  upperNo = parseInt(upperLimitInput.value);
  upperLimitInput.value = '';
  if (notOk(upperNo) || upperNo < targetNo) return;
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'block';
  highLowRow.style.display = 'block';
  resultText.innerHTML = '';
  setHighAndLow();
  guessNumberInput.focus();
};

var handleNewGuess = function handleNewGuess() {
  guessNo = parseInt(guessNumberInput.value);

  if (upperNo < guessNo) {
    resultText.innerHTML = "".concat(guessNo, " is above the upper limit.");
  } else if (guessNo < lowerNo) {
    resultText.innerHTML = "".concat(guessNo, " is below the lower limit.");
  } else if (guessNo === upperNo) {
    resultText.innerHTML = "".concat(guessNo, " is already the upper limit.");
  } else if (guessNo === lowerNo) {
    resultText.innerHTML = "".concat(guessNo, " is already the lower limit.");
  } else if (targetNo < guessNo && (guessNo - targetNo !== 1 || guessNo - lowerNo !== 2)) {
    resultText.innerHTML = "".concat(guessNo, " is High!");
    upperNo = guessNo;
    highResultText.innerHTML = guessNo.toString();
  } else if (guessNo < targetNo && (targetNo - guessNo !== 1 || upperNo - guessNo !== 2)) {
    resultText.innerHTML = "".concat(guessNo, " is Low!");
    lowerNo = guessNo;
    lowResultText.innerHTML = guessNo.toString();
  } else {
    if (targetNo < guessNo) {
      highResultText.innerHTML = guessNo.toString();
      resultText.innerHTML = "".concat(guessNo - 1, " is it!");
    } else if (guessNo < targetNo) {
      lowResultText.innerHTML = guessNo.toString();
      resultText.innerHTML = "".concat(guessNo + 1, " is it!");
    } else {
      resultText.innerHTML = "".concat(guessNo, " is it!");
    }

    guessNumberRow.style.display = 'none';
    startGameButton.innerHTML = 'Start new game';
    startGameButton.classList.add('button-primary');
    guessNumberInput.value = '';
    return;
  }

  guessNumberInput.value = '';
  guessNumberInput.focus();

  while (document.activeElement !== guessNumberInput) {
    sleep(100).then(function () {
      guessNumberInput.focus();
    });
  }
};

var hideMainRows = function hideMainRows() {
  targetRow.style.display = 'none';
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'none';
  highLowRow.style.display = 'none';
};

var resetGame = function resetGame() {
  startGameButton.innerHTML = 'Restart game';
  startGameButton.classList.remove('button-primary');
  targetRow.style.display = 'block';
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'none';
  highLowRow.style.display = 'none';
  targetNumberInput.focus();
  targetNo = 0;
  upperNo = 0;
  lowerNo = 1;
};

var initialiseDomVariables = function initialiseDomVariables() {
  startGameButton = document.getElementById('startGameButton');
  targetRow = document.getElementById('targetRow');
  targetNumberInput = document.getElementById('targetNumber');
  saveTargetNumberButton = document.getElementById('saveTargetNumberButton');
  upperLimitRow = document.getElementById('upperLimitRow');
  upperLimitInput = document.getElementById('upperLimit');
  saveUpperLimitButton = document.getElementById('saveUpperLimitButton');
  guessNumberRow = document.getElementById('guessNumberRow');
  guessNumberInput = document.getElementById('guessNumber');
  saveguessNumberButton = document.getElementById('saveguessNumberButton');
  highLowRow = document.getElementById('highLowRow');
  resultText = document.getElementById('resultText');
  highResultText = document.getElementById('highResultText');
  lowResultText = document.getElementById('lowResultText');
};

var setUpButtonListeners = function setUpButtonListeners() {
  startGameButton.onclick = function () {
    resetGame();
  };

  saveTargetNumberButton.onclick = function () {
    saveTargetNumber();
  };

  saveUpperLimitButton.onclick = function () {
    saveUpperLimit();
  };

  saveguessNumberButton.onclick = function () {
    handleNewGuess();
  };
};

var setUpEnterKeyHandlers = function setUpEnterKeyHandlers() {
  targetNumberInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      saveTargetNumberButton.click();
    }
  });
  upperLimitInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      saveUpperLimitButton.click();
    }
  });
  guessNumberInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      saveguessNumberButton.click();
    }
  });
};

document.addEventListener('DOMContentLoaded', function () {
  initialiseDomVariables();
  setUpButtonListeners();
  setUpEnterKeyHandlers();
  hideMainRows();
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64499" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map