"use strict";
var __importDefault =
    (this && this["__importDefault"]) ||
    function (g) {
        return g && g["__esModule"] ? g : { default: g };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJob = void 0;
var CronJob,
    UUID = java.util.UUID,
    ConcurrentHashMap = java.util.concurrent.ConcurrentHashMap,
    TimeUnit = java.util.concurrent.TimeUnit,
    Executors = java.util.concurrent.Executors,
    cron_job_factor_1 = require("./lib/cron-job-factor"),
    parser_1 = __importDefault(require("../module/parser/lib/parser")),
    Runnable = java.lang.Runnable,
    Context = android.content.Context,
    PowerManager = android.os.PowerManager,
    isValidParams_1 = require("./lib/isValidParams"),
    util_1 = require("../util"),
    error_1 = require("../error");
!(function (g) {
    var N;
    if (void 0 !== global().Api) {
        var s = Api.getContext().getSystemService(Context.POWER_SERVICE);
        N = s.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Cron");
    }
    else {
        s = App.getContext().getSystemService(Context.POWER_SERVICE);
        N = s.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Cron");
    }
    var v = new ConcurrentHashMap(),
        E = Executors.newSingleThreadScheduledExecutor(),
        B = false;

    function D(M, x, W, T) {
        var j;
        if ((void 0 === T && (T = {}), !(0, isValidParams_1.isValidParams)(T))) {
            throw new error_1.InvalidParams();
        }
        try {
            for (var V = x.split("|"), C = null, Q = 0, L = V; Q < L.length; Q++) {
                var A = L[Q],
                    I = parser_1.default
                        .parseExpression(A.trim(), {
                            startDate: T.startDate,
                            endDate: T.endDate
                        })
                        .next()
                ;(null === C || C > I) && (C = I);
            }
            if (null === C) {
                throw new error_1.ParseError();
            }
            var y = C.getTime(),
                F = Date.now(),
                P = new Runnable({
                    run: function () {
                        var U;
                        try {
                            var H = new Date(y)
                            ;(0, util_1.dateAddSub)(H, {
                                milliseconds:
                                    (null !== (U = T.before) && void 0 !== U ? U : 0) + 10
                            });
                            T.startDate = H;
                            W.bind(null, M)();
                            J(M);
                            D(M, x, W, T);
                        }
                        catch (G) {
                            throw new error_1.RuntimeError();
                        }
                    }
                }),
                R = y - F - (null !== (j = T.before) && void 0 !== j ? j : 0);
            R < 0 && (R = 0);
            var q = E.schedule(P, R, TimeUnit.MILLISECONDS),
                S = {
                    cronJob: x,
                    fun: q
                };
            return v.put(M, S), new Date(C.getTime());
        }
        catch (U) {
            if (U instanceof Error) {
                throw U;
            }
            throw new Error("알 수 없는 오류가 발생했습니다");
        }
    }

    function J(M) {
        var x = v.get(M);
        return null != x && (x.fun.cancel(true), v.remove(M), true);
    }

    function m() {
        for (var M in v) J(M);
        return true;
    }

    g.add = function (M, x, W) {
        void 0 === W && (W = {});
        var j = M.toLowerCase();
        if ("@bunny" === j) {
            throw new Error(
                Array(6)
                    .fill(0)
                    .map(function () {
                        return Math.random() < 0.5 ? "깡충" : "껑충";
                    })
                    .join("")
            );
        }
        if ("@appmaid" === j) {
            throw new Error("우웅나는서큐버스앱짱");
        }
        if ("@saroro" === j) {
            throw new Error("나는굇수다".repeat(5));
        }
        try {
            var X = String(UUID.randomUUID().toString());
            return D(X, M, x, W), new cron_job_factor_1.CronJobFactor(X, M, W);
        }
        catch (z) {
            throw new error_1.ParseError();
        }
    };
    g.remove = J;
    g.removeAll = m;
    g.off = function () {
        m();
        E.isShutdown() || E.shutdownNow();
    };
    g.on = function () {
        E.isShutdown() && (E = Executors.newSingleThreadScheduledExecutor());
    };
    g.setWakeLock = function (M) {
        M && !B ? ((B = true), N.acquire()) : !M && B && ((B = false), N.release());
    };
})(CronJob || (exports.CronJob = CronJob = {}));
