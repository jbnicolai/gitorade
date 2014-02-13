angular.module('Gitorade.services')
  .provider('Imgur', function () {
    var that = this;

    this.IMGUR_API_HOST = 'https://api.imgur.com/3/';
    this.IMGUR_CLIENT_ID = '72d9d541992437d';
    this.IMGUR_CLIENT_SECRET = 'bf3576c74698013c6b2988a8838edc29ce491e51';

    return {
      $get: function ($q, $http) {
        return {
          uploadImage: function (dataURL) {
            var imgur_endpoint_url = [that.IMGUR_API_HOST, 'image'].join('/');
            var deferred = $q.defer();

            $http.post(imgur_endpoint_url, {
              image: dataURL, type: 'base64'
            }, {
              headers: { 'Authorization': 'Client-ID ' + that.IMGUR_CLIENT_ID }
            }).success(function (response) {
              deferred.resolve(response);
            }).error(function (response) {
              deferred.reject(response);
            });

            return deferred.promise;
          }
        };
      }
    };
  });
