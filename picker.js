var picker_myConfig = function($stateProvider) {
    $stateProvider
        .state('tab.picker', {
            url: '/picker',
            views: {
                'tab-index': {
                    templateUrl: 'component/picker/picker.html',
                    controller: 'pickerCtrl'
                }
            }
        });
};
myapp.config(picker_myConfig);

angular.module('starter.picker', [])
    .controller('pickerCtrl', function($scope, $ionicModal, $timeout) {
        /**
        areaData Array required 城市数据绑定

        buttonText String 按钮名称 默认“完成”

        buttonClicked Expression 点击“完成”后的回调函数

        backdropClickToClose Boolean 点击空白出关闭窗口 默认false

        barCssClass String 自定义自己的bar class

        backdrop Boolean 遮罩层 默认true

        cssClass String 自定义自己的class

        defaultAreaData Array 初始城市 eg: ['江苏', '无锡', '江阴市']

        hardwareBackButtonClose Boolean 安卓硬件返回 默认true


        tag String 城市之间的分割符号 默认“－”

        watchChange Boolean 默认false 外部更改城市数据绑定值 eg:例4
        **/

    $scope.options = {
        model: 'ngModel',
        data: [{
            "name": "美食",
            "sub": [{
                "name": "粤菜"
            }, {
                "name": "浙江菜"
            }, {
                "name": "川菜"
            }, {
                "name": "湘菜"
            }, {
                "name": "东北菜"
            }, {
                "name": "烧烤"
            }, {
                "name": "火锅"
            }, {
                "name": "小吃快餐"
            }, {
                "name": "韩国料理"
            }, {
                "name": "日本料理"
            }, {
                "name": "西北菜"
            }, {
                "name": "新疆/清真"
            }, {
                "name": "东南亚菜"
            }, {
                "name": "西餐"
            }, {
                "name": "自助餐"
            }, {
                "name": "面包甜点"
            }, {
                "name": "其他美食"
            }, {
                "name": "海鲜"
            }, {
                "name": "潮州菜"
            }]
        }, {
            "name": "丽人",
            "sub": [{
                "name": "美容/SPA"
            }, {
                "name": "美甲"
            }, {
                "name": "美发"
            }, {
                "name": "化妆品"
            }, {
                "name": "整形"
            }, {
                "name": "彩妆造型"
            }, {
                "name": "瘦身纤体"
            }]
        }, {
            "name": "休闲",
            "sub": [{
                "name": "KTV"
            }, {
                "name": "电影"
            }, {
                "name": "饮品"
            }, {
                "name": "咖啡厅"
            }, {
                "name": "酒吧"
            }, {
                "name": "茶馆"
            }, {
                "name": "足疗按摩"
            }, {
                "name": "桑拿水会"
            }, {
                "name": "游乐游艺"
            }, {
                "name": "桌面游戏"
            }, {
                "name": "桌球室"
            }, {
                "name": "养生"
            }]
        }]

    };
        //确定和取消回调
        $scope.cb = {
            buttonClicked: function() {
                alert("ok");
            },
            cancelClicked: function() {
                alert("cancel");
            },
        }

        $scope.$on('$ionicView.beforeEnter', function() {

        });
    })
    //选择器
    .directive('ionicScrollPicker', ['$ionicPopup', '$timeout', '$ionicScrollDelegate', '$ionicModal', function ($ionicPopup, $timeout, $ionicScrollDelegate, $ionicModal) {
    return {
        restrict: 'AE',
        template: '<input type="text" placeholder={{vm.placeholder}} ng-model="model" class={{vm.cssClass}} readonly>',
        scope: {
            model: '=',
            data:'@',
            backdrop: '@',
            backdropClickToClose: '@',
            buttonClicked: '&'
        },
        link: function (scope, element, attrs) {
            var vm = scope.vm = {}, citypickerModel = null;
            //根据城市数据来 设置Handle。
            vm.provinceHandle = "provinceHandle" + attrs.model;
            vm.cityHandle = "cityHandle" + attrs.model;
            vm.countryHandle = "countryHandle" + attrs.model;
            vm.placeholder = attrs.placeholder || "请选择城市";
            vm.okText = attrs.okText || "确定";
            vm.cancelText = attrs.cancelText || "取消";
            vm.cssClass = attrs.cssClass;
            vm.barCssClass = attrs.barCssClass || "bar-dark";
            vm.backdrop = scope.$eval(scope.backdrop) || false;
            vm.backdropClickToClose = scope.$eval(scope.backdropClickToClose) || false;
            vm.cityData = JSON.parse(attrs.data);
            vm.tag = attrs.tag || "-";
            vm.returnOk = function () {
                citypickerModel && citypickerModel.hide();
                scope.buttonClicked && scope.buttonClicked();
            }
            vm.clickToClose = function () {
                vm.backdropClickToClose;
                citypickerModel && citypickerModel.hide();
            }
            vm.getData = function (name) {
                $timeout.cancel(vm.scrolling);//取消之前的scrollTo.让位置一次性过渡到最新
                $timeout.cancel(vm.dataing);//取消之前的数据绑定.让数据一次性过渡到最新
                switch (name) {
                    case 'province':
                        if (!vm.cityData) return false;
                        var province = true, length = vm.cityData.length, Handle = vm.provinceHandle, HandleChild = vm.cityHandle;
                        break;
                    case 'city':
                        if (!vm.province.sub) return false;
                        var city = true, length = vm.province.sub.length, Handle = vm.cityHandle, HandleChild = vm.countryHandle;
                        break;
                    case 'country':
                        if (!vm.city.sub) return false;
                        var country = true, Handle = vm.countryHandle, length = vm.city.sub.length;
                        break;
                }
                var top = $ionicScrollDelegate.$getByHandle(Handle).getScrollPosition().top;//当前滚动位置
                var index = Math.round(top / 50);
                if (index < 0) index = 0;//iOS bouncing超出头
                if (index > length - 1) index = length - 1;//iOS bouncing超出尾
                if (top === index * 50) {
                    vm.dataing = $timeout(function () {
                        province && (vm.province = vm.cityData[index], vm.city = vm.province.sub[0], vm.country = {}, (vm.city && vm.city.sub && (vm.country = vm.city.sub[0])));//处理省市乡联动数据
                        city && (vm.city = vm.province.sub[index], vm.country = {}, (vm.city && vm.city.sub && (vm.country = vm.city.sub[0])));//处理市乡联动数据
                        country && (vm.country = vm.city.sub[index]);//处理乡数据
                        HandleChild && $ionicScrollDelegate.$getByHandle(HandleChild).scrollTop();//初始化子scroll top位
                        //数据同步
                        (vm.city.sub && vm.city.sub.length > 0) ? (scope.model = vm.province.name + vm.tag + vm.city.name + vm.tag + vm.country.name ) : (scope.model = vm.province.name + vm.tag + vm.city.name)
                    }, 150)
                } else {
                    vm.scrolling = $timeout(function () {
                        $ionicScrollDelegate.$getByHandle(Handle).scrollTo(0, index * 50, true);
                    }, 150)
                }

            }

            element.on("click", function () {
                //零时处理 点击过之后直接显示不再创建
                if (!attrs.checked) {
                    citypickerModel && citypickerModel.remove();
                } else {
                    citypickerModel && citypickerModel.show();
                    return
                }
                attrs.checked = true;
                $ionicModal.fromTemplateUrl('./component/picker/ionic-picker.html', {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: vm.backdropClickToClose
                }).then(function (modal) {
                    citypickerModel = modal;
                    //初始化 先获取数据后展示
                    $timeout(function () {
                        vm.getData('province');
                        citypickerModel.show();
                    }, 100)
                })
            })
            //销毁模型
            scope.$on('$destroy', function () {
                citypickerModel && citypickerModel.remove();
            });
        }
    }
}])
    //选择器的一个选项
    .directive('ionScrollMinh', [
        '$timeout',
        '$controller',
        '$ionicBind',
        '$ionicConfig',
        function($timeout, $controller, $ionicBind, $ionicConfig) {
            return {
                restrict: 'E',
                scope: true,
                controller: function() {},
                compile: function(element, attr) {
                    var scrollCtrl;
                    element.addClass('scroll-view ionic-scroll');
                    //We cannot transclude here because it breaks element.data() inheritance on compile
                    var innerElement = angular.element('<div class="scroll"></div>');
                    innerElement.append(element.contents());
                    element.append(innerElement);

                    var nativeScrolling = attr.overflowScroll !== "false" && (attr.overflowScroll === "true" || !$ionicConfig.scrolling.jsScrolling());

                    return {
                        pre: prelink
                    };

                    function prelink($scope, $element, $attr) {
                        $ionicBind($scope, $attr, {
                            direction: '@',
                            paging: '@',
                            $onScroll: '&onScroll',
                            $onScrollComplete: '&onScrollComplete',
                            scroll: '@',
                            scrollbarX: '@',
                            scrollbarY: '@',
                            zooming: '@',
                            minZoom: '@',
                            maxZoom: '@'
                        });
                        $scope.direction = $scope.direction || 'y';

                        if (angular.isDefined($attr.padding)) {
                            $scope.$watch($attr.padding, function(newVal) {
                                innerElement.toggleClass('padding', !!newVal);
                            });
                        }
                        if ($scope.$eval($scope.paging) === true) {
                            innerElement.addClass('scroll-paging');
                        }

                        if (!$scope.direction) {
                            $scope.direction = 'y';
                        }
                        var isPaging = $scope.$eval($scope.paging) === true;

                        if (nativeScrolling) {
                            $element.addClass('overflow-scroll');
                        }

                        $element.addClass('scroll-' + $scope.direction);

                        var scrollViewOptions = {
                            el: $element[0],
                            delegateHandle: $attr.delegateHandle,
                            locking: ($attr.locking || 'true') === 'true',
                            bouncing: $scope.$eval($attr.hasBouncing),
                            paging: isPaging,
                            scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                            scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                            scrollingX: $scope.direction.indexOf('x') >= 0,
                            scrollingY: $scope.direction.indexOf('y') >= 0,
                            zooming: $scope.$eval($scope.zooming) === true,
                            maxZoom: $scope.$eval($scope.maxZoom) || 3,
                            minZoom: $scope.$eval($scope.minZoom) || 0.5,
                            preventDefault: true,
                            nativeScrolling: nativeScrolling,
                            scrollingComplete: onScrollComplete
                        };

                        if (isPaging) {
                            scrollViewOptions.speedMultiplier = 0.8;
                            scrollViewOptions.bouncing = false;
                        }
                        scrollCtrl = $controller('$ionicScroll', {
                            $scope: $scope,
                            scrollViewOptions: scrollViewOptions
                        });

                        function onScrollComplete() {
                            $scope.$onScrollComplete({
                                scrollTop: scrollCtrl.scrollView.__scrollTop,
                                scrollLeft: scrollCtrl.scrollView.__scrollLeft
                            });
                        }
                        $scope.$on('$destroy', function() {
                            if (scrollViewOptions) {
                                scrollViewOptions.scrollingComplete = noop;
                                delete scrollViewOptions.el;
                            }
                            innerElement = null;
                            $element = null;
                            attr.$$element = null;
                        });
                    }
                }
            };
        }
    ]);