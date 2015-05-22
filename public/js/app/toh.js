(function () {
    'use strict';

    var app = angular.module('app', []);

    app.controller('mainCtrl', mainCtrl);
    mainCtrl.$inject = ['$scope', '$timeout', '$q'];
    function mainCtrl($scope, $timeout, $q) {
        var l1 = [],
            l2 = [],
            l3 = [],
            lst = [l1, l2, l3],
            delay = 250,
            moveA,
            moveB,
            running = false;

        $scope.delay = .25;
        $scope.even = false;
        $scope.moves = 0;
        $scope.numDisks = 4;

        $scope.getMargin = function (l, n) {
            return (l.indexOf(n) === 0 ? ((($scope.numDisks || 3) - l.length) * 10): 0)
        };

        function getDelay() {
            return $scope.delay * 1000;
        }

        $scope.reset = function (overwriteDelay) {
            running = false;
            $timeout(function () {
                $scope.moves = 0;
                if($scope.numDisks < 3) {
                    $scope.numDisks = 3;
                }
                $scope.l1 = l1 = [];
                $scope.l2 = l2 = [];
                $scope.l3 = l3 = [];
                lst = [l1, l2, l3];
                $scope.minMoves = Math.pow(2, $scope.numDisks)-1;

                for(var i = $scope.numDisks; i >= 1; i--) {
                    l1.unshift({
                        val: i,
                        lst: 0,
                        bg: i < (colors.length - 1) ? colors[i] : colors[i % colors.length]
                    });
                }
            }, (overwriteDelay || getDelay()));
        };
        $scope.reset(100);

        $scope.go = function () {
            running = true;
            $scope.moves = 0;
            var even,
                a = l1[0],
                b = l1[1],
                c = l1[2],
                len = l1.length;
            even = (len % 2) === 0;
            moveA = even ? 1 : 2;
            moveB = even ? 2 : 1;

            Run(a, b, c, len);
        };

        function Run(a, b, c, len) {
            if(running && l3.length < len) {
                RunPatternA(a, b, c, getDelay())
                     .then(function () { $timeout(function () {RunSmallToLarge(a);}, getDelay())
                        .then(function (){
                            if(l3.length < len) {
                                Run(a, b, c, len);
                            }
                        })
                    });
            }
        }

        function RunSmallToLarge(a) {
            if(!running) {
                return;
            }

            var lstA = lst[(a.lst + 1) % 3],
                lstB = lst[(a.lst + 2) % 3],
                tm;

            if(lstA.length && lstB.length) {
                if(lstA[0].val < lstB[0].val) {
                    tm = lstA.splice(0, 1)[0];
                    lstB.unshift(tm);
                    $scope.moves += 1;
                } else {
                    tm = lstB.splice(0, 1)[0]
                    lstA.unshift(tm);
                    $scope.moves += 1;
                }
            } else if(lstA.length) {
                tm = lstA.splice(0, 1)[0];
                lstB.unshift(tm);
                $scope.moves += 1;
            } else if(lstB.length) {
                tm = lstB.splice(0, 1)[0];
                lstA.unshift(tm);
                $scope.moves += 1;
            }
        }

        function RunPatternA(a, b, c) {
            var deferred = $q.defer(),
                step = 0,
                toDo = [
                    { obj: a, dis: moveA },
                    { obj: b, dis: moveB },
                    { obj: a, dis: moveA },
                    { obj: c, dis: moveA },
                    { obj: a, dis: moveA },
                    { obj: b, dis: moveB },
                    { obj: a, dis: moveA }
                ];

            runStep();

            function runStep() {
                if(!running) {
                    deferred.reject();
                    return;
                }

                if(step >= toDo.length) {
                    deferred.resolve();
                    return;
                }

                $timeout(function () {
                    var o = toDo[step];
                    move(o.obj, o.dis);
                }, getDelay()).then(function (){step += 1; runStep();});
            }

            return deferred.promise;
        }

        function move(obj, distance) {
            if(!running) {
                deferred.reject();
                return;
            }
            var curLst = lst[obj.lst];
            if(curLst.indexOf(obj) > -1) {
                curLst.splice(curLst.indexOf(obj), 1);
            }

            obj.lst = (obj.lst + distance) % 3;
            lst[obj.lst].unshift(obj);
            $scope.moves += 1;
        }
    }

    var colors = [
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkkhaki',
        'darkmagenta',
        'darkolive',
        'green',
        'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategray',
        'darkturquoise',
        'darkviolet',
        'deeppink'];
}());
