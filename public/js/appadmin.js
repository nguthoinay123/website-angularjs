angular.module('myApp', ['ngRoute'])
   .config(function ($routeProvider) {
      $routeProvider
         .when('/', {
            templateUrl: 'public/template/adminproduct.html?' + Math.random(),
            controller: 'adminproductCtrl'
         })
         .otherwise({
            template: '<h1>404</h1>'
         });
   })
   .run(function ($rootScope) {
      $rootScope.$on('$routeChangeStart', function () {
         $rootScope.isLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function () {
         $rootScope.isLoading = false;
      });
      $rootScope.$on('$routeChangeError', function () {
         $rootScope.isLoading = true;
         alert('Lỗi không tải được trang');
      });
   })
   .controller('adminproductCtrl', function ($scope, $http, $rootScope) {
      // Điều khiển cho adminproduct
   })
   .controller('myctrl', function ($scope, $http, $rootScope) {
      // Điều khiển cho phần ng-controller="myctrl"
      $scope.dsSP = [];
      $http.get('app/data.json').then(
         function (res) {
            //thành công
            console.log(res);
            $scope.dsSP = res.data;
         },
         function (res) {
            //thất bại
            alert('Lỗi không tải được dữ liệu');
         }
      );
     
   });
