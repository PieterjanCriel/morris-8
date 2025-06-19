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
})({"src/ts/game.ts":[function(require,module,exports) {
"use strict";

// Game constants
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var GAME_WIDTH = 600;
var GAME_HEIGHT = 600; // Square shape
var OCTOPUS_WIDTH = 120; // Increased by 50% from 80
var OCTOPUS_HEIGHT = 120; // Increased by 50% from 80
var SHARK_WIDTH = 60;
var SHARK_HEIGHT = 60;
var SHARK_SPAWN_INTERVAL = 2000; // milliseconds
var INITIAL_FALLING_SPEED = 1.3;
var SPEED_INCREMENT = 0.1;
var MAX_FALLING_SPEED = 10;
// Shark class
var Shark = /*#__PURE__*/function () {
  function Shark(x, y, answer, isCorrect) {
    _classCallCheck(this, Shark);
    this.x = x;
    this.y = y;
    this.width = SHARK_WIDTH;
    this.height = SHARK_HEIGHT;
    this.answer = answer;
    this.isCorrect = isCorrect;
    this.image = new Image();
    this.image.src = Math.random() < 0.5 ? 'img/shark_1.png' : 'img/shark_2.png';
  }
  return _createClass(Shark, [{
    key: "update",
    value: function update(speed) {
      this.y += speed;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      // Draw shark image
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      // Draw answer text next to the shark (to the right) in red
      ctx.fillStyle = 'red';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      var text = String(this.answer);
      ctx.fillText(text, this.x + this.width + 5, this.y + this.height / 2);
    }
  }]);
}(); // Octopus class
var Octopus = /*#__PURE__*/function () {
  function Octopus() {
    _classCallCheck(this, Octopus);
    this.width = OCTOPUS_WIDTH;
    this.height = OCTOPUS_HEIGHT;
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = GAME_HEIGHT - this.height + 200; // Position at bottom with 10px margin
    this.speed = 6;
    this.movingLeft = false;
    this.movingRight = false;
    this.image = new Image();
    this.image.src = 'img/octo.png';
  }
  return _createClass(Octopus, [{
    key: "update",
    value: function update() {
      // Get the actual canvas width for proper boundary checking
      var canvas = document.getElementById('game-canvas');
      var canvasWidth = canvas ? canvas.width : GAME_WIDTH;
      if (this.movingLeft && this.x > 0) {
        this.x -= this.speed;
      }
      if (this.movingRight && this.x < canvasWidth - this.width) {
        this.x += this.speed;
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      // Draw the octopus image
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }]);
}(); // Game class
var Game = /*#__PURE__*/function () {
  function Game() {
    var _this = this;
    _classCallCheck(this, Game);
    this.animationFrameId = null;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    // Load background image
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'img/IMG_2649.jpg';
    this.resizeCanvas();
    window.addEventListener('resize', function () {
      return _this.resizeCanvas();
    });
    this.state = {
      lives: 3,
      score: 0,
      fallingSpeed: INITIAL_FALLING_SPEED,
      gameOver: false,
      currentProblem: this.generateMathProblem(),
      sharks: [],
      octopus: new Octopus(),
      lastSharkSpawn: 0
    };
    // Event listeners for keyboard
    document.addEventListener('keydown', function (e) {
      return _this.handleKeyDown(e);
    });
    document.addEventListener('keyup', function (e) {
      return _this.handleKeyUp(e);
    });
    // Start the game loop
    this.gameLoop(0);
  }
  return _createClass(Game, [{
    key: "resizeCanvas",
    value: function resizeCanvas() {
      var container = this.canvas.parentElement;
      // Make the canvas square-shaped by using the minimum dimension
      var minDimension = Math.min(container.clientWidth, container.clientHeight);
      this.canvas.width = minDimension;
      this.canvas.height = minDimension;
      // Update octopus position when canvas is resized
      if (this.state && this.state.octopus) {
        this.state.octopus.y = this.canvas.height - this.state.octopus.height - 10;
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        this.state.octopus.movingLeft = true;
      } else if (e.key === 'ArrowRight') {
        this.state.octopus.movingRight = true;
      }
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(e) {
      if (e.key === 'ArrowLeft') {
        this.state.octopus.movingLeft = false;
      } else if (e.key === 'ArrowRight') {
        this.state.octopus.movingRight = false;
      }
    }
  }, {
    key: "generateMathProblem",
    value: function generateMathProblem() {
      var operations = ['+', '-', '*'];
      var operation = operations[Math.floor(Math.random() * operations.length)];
      var num1, num2, correctAnswer;
      switch (operation) {
        case '+':
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * 100) + 1;
          correctAnswer = num1 + num2;
          break;
        case '-':
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
          correctAnswer = num1 - num2;
          break;
        case '*':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          correctAnswer = num1 * num2;
          break;
        default:
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * 100) + 1;
          correctAnswer = num1 + num2;
          operation = '+';
      }
      var expression = "".concat(num1, " ").concat(operation, " ").concat(num2);
      // Generate 3 wrong answers
      var wrongAnswers = [];
      while (wrongAnswers.length < 3) {
        // Generate wrong answer close to the correct one
        var wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
        if (wrongAnswer !== correctAnswer && wrongAnswers.indexOf(wrongAnswer) === -1 && wrongAnswer > 0) {
          wrongAnswers.push(wrongAnswer);
        }
      }
      document.getElementById('math-problem').textContent = expression;
      return {
        expression: expression,
        correctAnswer: correctAnswer,
        wrongAnswers: wrongAnswers
      };
    }
  }, {
    key: "spawnSharks",
    value: function spawnSharks() {
      var answers = [].concat(_toConsumableArray(this.state.currentProblem.wrongAnswers), [this.state.currentProblem.correctAnswer]);
      this.shuffleArray(answers);
      var availableWidth = this.canvas.width - SHARK_WIDTH;
      var segment = availableWidth / 4;
      for (var i = 0; i < 4; i++) {
        var isCorrect = answers[i] === this.state.currentProblem.correctAnswer;
        var x = i * segment + segment / 2 - SHARK_WIDTH / 2;
        // Add random Y offset between -100px and +100px
        var yOffset = Math.floor(Math.random() * 200) - 100;
        var shark = new Shark(x, -SHARK_HEIGHT + yOffset, answers[i], isCorrect);
        this.state.sharks.push(shark);
      }
    }
  }, {
    key: "shuffleArray",
    value: function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [array[j], array[i]];
        array[i] = _ref[0];
        array[j] = _ref[1];
      }
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions() {
      var octopus = this.state.octopus;
      for (var i = this.state.sharks.length - 1; i >= 0; i--) {
        var shark = this.state.sharks[i];
        // Check if shark has gone off screen
        if (shark.y > this.canvas.height) {
          if (shark.isCorrect) {
            // Player missed the correct answer
            this.state.lives--;
            this.updateLivesDisplay();
            if (this.state.lives <= 0) {
              this.gameOver();
            }
          }
          this.state.sharks.splice(i, 1);
          continue;
        }
        // Check collision with octopus
        if (shark.x < octopus.x + octopus.width && shark.x + shark.width > octopus.x && shark.y < octopus.y + octopus.height && shark.y + shark.height > octopus.y) {
          if (shark.isCorrect) {
            // Player caught the correct answer
            this.state.score++;
            this.updateScoreDisplay();
            this.state.fallingSpeed = Math.min(MAX_FALLING_SPEED, this.state.fallingSpeed + SPEED_INCREMENT);
            this.state.currentProblem = this.generateMathProblem();
          } else {
            // Player caught a wrong answer
            this.state.lives--;
            this.updateLivesDisplay();
            if (this.state.lives <= 0) {
              this.gameOver();
            }
          }
          // Remove all sharks and spawn new ones
          this.state.sharks = [];
          break;
        }
      }
    }
  }, {
    key: "updateLivesDisplay",
    value: function updateLivesDisplay() {
      document.getElementById('lives-count').textContent = String(this.state.lives);
    }
  }, {
    key: "updateScoreDisplay",
    value: function updateScoreDisplay() {
      document.getElementById('score-count').textContent = String(this.state.score);
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      var _this2 = this;
      this.state.gameOver = true;
      // Create game over screen if it doesn't exist
      var gameOverScreen = document.querySelector('.game-over');
      if (!gameOverScreen) {
        gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over';
        var gameOverTitle = document.createElement('h2');
        gameOverTitle.textContent = 'Game Over';
        var gameOverScore = document.createElement('p');
        gameOverScore.textContent = "Final Score: ".concat(this.state.score);
        var restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.addEventListener('click', function () {
          return _this2.restart();
        });
        gameOverScreen.appendChild(gameOverTitle);
        gameOverScreen.appendChild(gameOverScore);
        gameOverScreen.appendChild(restartButton);
        document.querySelector('.game-container').appendChild(gameOverScreen);
      } else {
        gameOverScreen.querySelector('p').textContent = "Final Score: ".concat(this.state.score);
        gameOverScreen.style.display = 'block';
      }
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  }, {
    key: "restart",
    value: function restart() {
      var gameOverScreen = document.querySelector('.game-over');
      if (gameOverScreen) {
        gameOverScreen.style.display = 'none';
      }
      this.state = {
        lives: 3,
        score: 0,
        fallingSpeed: INITIAL_FALLING_SPEED,
        gameOver: false,
        currentProblem: this.generateMathProblem(),
        sharks: [],
        octopus: new Octopus(),
        lastSharkSpawn: 0
      };
      this.updateLivesDisplay();
      this.updateScoreDisplay();
      this.gameLoop(0);
    }
  }, {
    key: "update",
    value: function update(timestamp) {
      var _this3 = this;
      // Spawn sharks at intervals
      if (this.state.sharks.length === 0 || timestamp - this.state.lastSharkSpawn > SHARK_SPAWN_INTERVAL) {
        this.spawnSharks();
        this.state.lastSharkSpawn = timestamp;
      }
      // Update octopus position
      this.state.octopus.update();
      // Update shark positions
      this.state.sharks.forEach(function (shark) {
        return shark.update(_this3.state.fallingSpeed);
      });
      // Check for collisions
      this.checkCollisions();
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this4 = this;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Draw underwater background image
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
      // Draw sharks
      this.state.sharks.forEach(function (shark) {
        return shark.draw(_this4.ctx);
      });
      // Draw octopus
      this.state.octopus.draw(this.ctx);
    }
  }, {
    key: "gameLoop",
    value: function gameLoop(timestamp) {
      var _this5 = this;
      if (!this.state.gameOver) {
        this.update(timestamp);
        this.draw();
        this.animationFrameId = requestAnimationFrame(function (time) {
          return _this5.gameLoop(time);
        });
      }
    }
  }]);
}(); // Initialize the game when window loads
window.addEventListener('load', function () {
  var game = new Game();
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63665" + '/');
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
      });

      // Enable HMR for CSS by default.
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/ts/game.ts"], null)
//# sourceMappingURL=/game.280ade9f.js.map