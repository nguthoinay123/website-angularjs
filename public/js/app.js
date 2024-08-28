angular.module('myApp', ['ngRoute'])
   .config(function ($routeProvider) {
      $routeProvider
         .when('/', {
            templateUrl: 'public/template/home.html?' + Math.random(),
            controller: 'homeCtrl'
         })
         .when('/login', {
            templateUrl: 'public/template/login.html?' + Math.random(),
            controller: 'loginCtrl'

         })
         .when('/sigup', {
            templateUrl: 'public/template/sigup.html?' + Math.random(),
            controller: 'sigupCtrl'

         })
         .when('/detail/:idsp',{
            templateUrl: '/public/template/detail.html?'+Math.random(),
            controller:'detailCtrl'
        })
         .when('/lienhe', {
            templateUrl: 'public/template/lienhe.html?' + Math.random(),
            controller: 'lienheCtrl'
         })
         .when('/gioithieu', {
            templateUrl: 'public/template/gioithieu.html?' + Math.random(),
            controller: 'gioithieuCtl'
         })
         .when('/cart', {
            templateUrl: 'public/template/cart.html?' + Math.random(),
            controller: 'cartCtrl'
         })
         .when('/product', {
            templateUrl: 'public/template/product.html?' + Math.random(),
            controller: 'productCtrl'
         })
         .when('/adminproduct', {
            templateUrl: 'public/template/adminproduct.html?' + Math.random(),
            controller: 'adminproductCtrl'
         })
       
         .otherwise({
            template: '<h1>404</h1>'
         })
   })
   .controller('loginCtrl', function ($scope, $rootScope, $location) {
      $rootScope.datasuser = $rootScope.datasuser || []; // Create the datasuser array if it doesn't exist
      $scope.login = function () {
          if ($scope.datasuser && Array.isArray($scope.datasuser)) {
              var user = check_login($scope.email, $scope.password, $scope.datasuser);
              if (user) {
                  sessionStorage.setItem('login', angular.toJson(user));
                  $scope.isLogin = true;
                  $rootScope.info = user;
                  // Chuyển hướng đến trang chủ
                  $location.path('/');
              } else {
                  $scope.isLogin = false;
                  alert('Thông tin tài khoản không hợp lệ');
              }
          } else {
              console.error("Datasuser is not an array or is undefined.");
          }
      }
  
      function check_login(email, pass, datasuser) {
          if (datasuser && Array.isArray(datasuser)) {
              for (var i = 0; i < datasuser.length; i++) {
                  if (datasuser[i].email == email && datasuser[i].password == pass) {
                      return datasuser[i];
                  }
              }
          } else {
              console.error("Datasuser is not an array or is undefined.");
          }
          return false;
      }

   
  })
  
  
  
  .controller('sigupCtrl', function ($scope, $rootScope) {
   $rootScope.datasuser = $rootScope.datasuser || []; // Create the datasuser array if it doesn't exist

   $scope.isLogin = false;

   if (localStorage.getItem('user-list')) {
       $rootScope.datasuser = angular.fromJson(localStorage.getItem('user-list'))
   }

   if (sessionStorage.getItem('login')) {
       $scope.isLogin = true;
       $rootScope.info = angular.fromJson(sessionStorage.getItem('login'))
   }

   $scope.add_user = function () {
       $rootScope.datasuser.push($scope.user);
       $scope.user = null;
       localStorage.setItem('user-list', angular.toJson($rootScope.datasuser));
   }

   $scope.deleteAlldata = function () {
       $rootScope.datasuser = [];
       localStorage.removeItem('user-list');
   }

})

  
  
   .controller('homeCtrl', function ($scope, $interval) {
      $interval(function () {
         $scope.now = new Date();
      }, 1000)
      $scope.limit = 3;
      $scope.page = 1;
      // page=1 ->begin=0
      // page=2 ->begin=3
      // page=3 ->begin=6
      // page=4 ->begin=(page-1)*litmit
      $scope.begin = ($scope.page - 1) * $scope.limit;
      $scope.chuyentrang = function (trang) {
         $scope.page = trang;
         $scope.begin = ($scope.page - 1) * $scope.limit;
      }
      $scope.totalPage = function () {
         return Math.ceil($scope.dsSP.length / $scope.limit)
      }
      $scope.pagelist = function () {
         let arr = [];
         let totalPage = $scope.totalPage();
         for (let i = 1; i <= totalPage; i++) {
            arr.push(i);
         }
         return arr;
      }

   })
   .controller('detailCtrl',function($scope,$routeParams){
      $scope.id= $routeParams.idsp;
      $scope.sp=$scope.dsSP.filter(i=>i.id==$scope.id)[0];
      console.log($scope.sp);
      })
   .controller('cartCtrl', function ($scope) {
      $scope.trangthai = 'Chờ thanh toán';
   })
   .controller('templateadminCtrl', function ($scope) {
   })
 
   .run(function ($rootScope) {

      $rootScope.$on('$routeChangeStart', function () {
         $rootScope.isLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function () {
         $rootScope.isLoading = false;
      });
      $rootScope.$on('$routeChangeErorr', function () {
         $rootScope.isLoading = true;
         alert('Lỗi không tải đc trang')
      });
   })
   // .filter('search',function(){
   //    return function(input, keyword, attr){
   //       let kq=[];
   //       if(keyword){
   //          keyword=keyword.toLowerCase();
   //       attr.forEach(thuoctinh => {
   //          let tmp=input.filter(item=>{
   //          return item=[thuoctinh].toString().toLowerCase().indexOf(keyword)>=0;
   //       });
   //       kq.push(...tmp)
   //    })
   //       }else{kq=input}
   //       return kq;
   //    }
   //    })

   .controller('productCtrl', function ($scope, $interval) {


   })

   .controller('myctrl', function ($scope, $http, $rootScope) {
      $scope.dsSP = [];
      $http.get('app/data.json').then(
         function (res) {
            //thanh công
            console.log(res);
            $scope.dsSP = res.data
         },
         function (res) {
            //thất bại
            alert('lỗi không tải được dữ liệu')
         }
      )
      $rootScope.cart = []
      $scope.mua = function (sp) {
         // chưa có sản phẩm trong giỏ hàng -> thêm vào
         if ($scope.cart.filter(i => i.id == sp.id).length == 0) {
            sp.quantily = 1;
            $scope.cart.push(sp);

         }

         // đã có sp trong giỏ hàng -> tăng số lượng
         else {
            $scope.cart.forEach(i => {
               if (i.id == sp.id) {
                  i.quantily++;
               }
            });
         }
         console.log($scope.cart)
      }
      $scope.delete = function (id) {
         let index = $scope.cart.findIndex(i => i.id == id);
         $scope.cart.splice(index, 1);
      }
      $scope.deleteAll = function () {
         $scope.cart = [];
      }

      $scope.tinh = function () {
         return $scope.cart.reduce((init, cur) => init + cur.price * cur.quantily, 0)
      }
      ///
      ////
      /////
      //////
      $scope.deleteAlllogin = function () {
         // Xóa thông tin đăng nhập từ sessionStorage
         sessionStorage.removeItem('login');
         
         // Thiết lập biến isLogin trong $rootScope thành false
         $rootScope.isLogin = false;
     
         // Thực hiện các hành động khác cần thiết để đăng xuất, ví dụ: xóa dấu hiệu đăng nhập từ các phần khác của ứng dụng, xóa thông tin đăng nhập khỏi bộ nhớ cache, và/hoặc điều hướng người dùng đến trang đăng nhập.
         // Ví dụ:
         // $state.go('login'); // Điều hướng người dùng đến trang đăng nhập nếu sử dụng Angular UI Router
     
         // Hoặc nếu sử dụng Angular Router
         // $location.path('/login'); // Điều hướng người dùng đến trang đăng nhập nếu sử dụng Angular Router
     }
     
      
   });