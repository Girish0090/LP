(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require, exports, module);
    } else {
        root.CountUp = factory();
    }
}(this, function(require, exports, module) {
    var CountUp = function(target, startVal, endVal, decimals, duration, options) {
        var lastTime = 0;
        var vendors = ['webkit', 'moz', 'ms', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        var self = this;
        self.options = {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            easingFn: null,
            formattingFn: null
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                self.options[key] = options[key];
            }
        }
        if (self.options.separator === '') {
            self.options.useGrouping = false;
        }
        if (!self.options.prefix) self.options.prefix = '';
        if (!self.options.suffix) self.options.suffix = '';
        self.d = (typeof target === 'string') ? document.getElementById(target) : target;
        self.startVal = Number(startVal);
        self.endVal = Number(endVal);
        self.countDown = (self.startVal > self.endVal);
        self.frameVal = self.startVal;
        self.decimals = Math.max(0, decimals || 0);
        self.dec = Math.pow(10, self.decimals);
        self.duration = Number(duration) * 1000 || 2000;
        self.formatNumber = function(nStr) {
            nStr = nStr.toFixed(self.decimals);
            nStr += '';
            var x, x1, x2, rgx;
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? self.options.decimal + x[1] : '';
            rgx = /(\d+)(\d{3})/;
            if (self.options.useGrouping) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
                }
            }
            return self.options.prefix + x1 + x2 + self.options.suffix;
        };
        self.easeOutExpo = function(t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        };
        self.easingFn = self.options.easingFn ? self.options.easingFn : self.easeOutExpo;
        self.formattingFn = self.options.formattingFn ? self.options.formattingFn : self.formatNumber;
        self.version = function() {
            return '1.7.1';
        };
        self.printValue = function(value) {
            var result = self.formattingFn(value);
            if (self.d.tagName === 'INPUT') {
                this.d.value = result;
            } else if (self.d.tagName === 'text' || self.d.tagName === 'tspan') {
                this.d.textContent = result;
            } else {
                this.d.innerHTML = result;
            }
        };
        self.count = function(timestamp) {
            if (!self.startTime) {
                self.startTime = timestamp;
            }
            self.timestamp = timestamp;
            var progress = timestamp - self.startTime;
            self.remaining = self.duration - progress;
            if (self.options.useEasing) {
                if (self.countDown) {
                    self.frameVal = self.startVal - self.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
                } else {
                    self.frameVal = self.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
                }
            } else {
                if (self.countDown) {
                    self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
                } else {
                    self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
                }
            }
            if (self.countDown) {
                self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
            } else {
                self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
            }
            self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;
            self.printValue(self.frameVal);
            if (progress < self.duration) {
                self.rAF = requestAnimationFrame(self.count);
            } else {
                if (self.callback) {
                    self.callback();
                }
            }
        };
        self.start = function(callback) {
            self.callback = callback;
            self.rAF = requestAnimationFrame(self.count);
            return false;
        };
        self.pauseResume = function() {
            if (!self.paused) {
                self.paused = true;
                cancelAnimationFrame(self.rAF);
            } else {
                self.paused = false;
                delete self.startTime;
                self.duration = self.remaining;
                self.startVal = self.frameVal;
                requestAnimationFrame(self.count);
            }
        };
        self.reset = function() {
            self.paused = false;
            delete self.startTime;
            self.startVal = startVal;
            cancelAnimationFrame(self.rAF);
            self.printValue(self.startVal);
        };
        self.update = function(newEndVal) {
            cancelAnimationFrame(self.rAF);
            self.paused = false;
            delete self.startTime;
            self.startVal = self.frameVal;
            self.endVal = Number(newEndVal);
            self.countDown = (self.startVal > self.endVal);
            self.rAF = requestAnimationFrame(self.count);
        };
        self.printValue(self.startVal);
    };
    return CountUp;
}));