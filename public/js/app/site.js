$(window).scroll(function () {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $(".navbar-header").removeClass("hidden");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $(".navbar-header").addClass("hidden");
    }
});

$('.navbar-collapse ul li a').click(function () {
    $('.navbar-toggle:visible').click();
});

(function () {
    var app = angular.module('app', [
        'ngSanitize'
        //, 'ui.bootstrap'
    ]);

    app.directive('pageScroll', pageScroll);
    function pageScroll () {
        return {
            restrict: 'C',
            link: function (scope, el, attrs) {
                el.bind('click', function (event) {
                    var $anchor = $(this);
                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1500, 'easeInOutExpo');
                    event.preventDefault();
                });
            }
        }
    }

    contentSection.$inject = ['$timeout'];
    app.directive('contentSection', contentSection);
    function contentSection ($timeout) {
        return {
            restrict: 'C',
            link: function (scope, el, attrs) {
                $(window).on('resize', function () {
                    setHeight(el);
                });
                setHeight(el);
                $timeout(function () {
                    setHeight(el);
                });
            }
        }
    }

    function setHeight(el) {
        console.log('set height');
        var winH = $('body').height()
            , elH = el.height()
            , diffH = winH - elH || 0
            , calcPad = diffH / 2;

        el.css({
            'padding-top': calcPad,
            'padding-bottom': calcPad
        });
    }

    var bgColors = [
        '#b1d1e0',
        '#f8931f',
        '#c9cf31',

//greens
        // '#95aa61',
        // '#d6e68a',
        // '#899752'

        '#21578a',
        '#b5c50e',
        '#889036',
        '#5f874d'
    ];

    contentSrv.$inject = ['$http'];
    app.factory('content', contentSrv);
    function contentSrv ($http) {
        return {
            get: function () {
                var p = $http.get('/content').then(function (r) {
                    console.log('content res', r);
                    return r.data;
                });

                return p;
            }
        };
    }

    mainCtrl.$inject = ['$scope', '$templateCache', 'content'];
    app.controller('mainCtrl', mainCtrl);
    function mainCtrl ($scope, $templateCache, content) {
        $scope.mainTmpls = [];
        content.get().then(function (d) {
            console.log('d', d);
            $scope.mainTmpls = d.map(function (item, i){
                item.tmplId = item.id + i;
                $templateCache.put(item.tmplId, item.content);
                item.isLast = !(i + 1 < d.length);
                item.nId = '#' + (i + 1 < d.length ? d[i + 1].id :  d[0].id);
                item.bg = bgColors[(i % bgColors.length)];
                return item;
            });
        });
    }
}());
