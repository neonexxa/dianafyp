app
	.controller("LocationCtrl", function ($scope, $localStorage, $cordovaGeolocation, $rootScope, $ionicLoading) {
		console.log("This is Location Controller");

		var options = {timeout: 10000, enableHighAccuracy: true};

		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			console.log("Running cordovaGeolocation...")
			var geocoder = new google.maps.Geocoder;
     
	        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	     
	        var mapOptions = {
	          center: latLng,
	          zoom: 15,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
	     
	        $rootScope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

	        //Wait until the map is loaded
	        google.maps.event.addListenerOnce($rootScope.map, 'idle', function(){
				enableMap();
				console.log("Starting...");
				console.log("Lat: " + position.coords.latitude + ", Long:" + position.coords.longitude);
	      		
	      		// Get Current Location UTP : 4.380074, 100.965628
				// var curr_loc = { lat: parseFloat(4.380074) , lng: parseFloat(100.965628) };
				var curr_loc = { lat: parseFloat(position.coords.latitude) , lng: parseFloat(position.coords.longitude) };
				$localStorage.current_location_latlng = curr_loc;
				console.log(curr_loc);

				// Translate coordinate to place name
				geocoder.geocode({'location': curr_loc}, function(results, status) {
					if (status === 'OK') {

						if (results[0]) {
							console.log(results[0].formatted_address);
							$localStorage.current_location = results[0].formatted_address;
						} else {
							console.log('No results found');
						}

					} else {
						console.log('Geocoder failed due to: ' + status);
					}
				});

				// Setup Marker          
				var marker = new google.maps.Marker({
				  map: $rootScope.map,
				  animation: google.maps.Animation.DROP,
				  position: latLng
				});  

				var infoWindow = new google.maps.InfoWindow({
				  content: "You are here!"
				});

				google.maps.event.addListener(marker, 'click', function () {
				  infoWindow.open($rootScope.map, marker);
				});

			})

	    })

		function enableMap(){
			$ionicLoading.hide();
		}
	})
	
	.controller("MainCtrl", function ($scope) {
		console.log("this is main controller");
	})
	
	.controller("ResearchCtrl", function ($scope, $localStorage) {
		console.log("this is research controller");
		$scope.current_add = $localStorage.current_location;
	})
	
	.controller("LearnMoreCtrl", function ($scope, $firebaseArray, $rootScope, $location) {
		console.log("this is learn more controller");
		var ref = firebase.database().ref('facts');
    	$scope.factsdata = $firebaseArray(ref);
    	console.log($scope.factsdata);
    	$scope.showfacts = function(facts) {
    		console.log(facts);
    		$rootScope.currfacts = facts;
    		$location.path('/showfact');
    	}

	})
	.controller("ShowFactCtrl", function ($scope, $firebaseArray, $rootScope) {
		console.log($rootScope.currfacts);
		$scope.currshowfact = $rootScope.currfacts;
	})
	.controller("AddCenterCtrl", function ($scope, $firebaseArray, $state) {

		$scope.add_cen = function(center) {
			// Debug: print name value
			console.log(center);

			// Set as saved, and save in local storage
			// $scope.saved = true;
			// $localStorage.name = name;
			var newcenterobject = { 
					"alamat" : center.address,
					"coor" : center.coor,
					"pihak_btj" : center.rp
				}
			var ref = firebase.database().ref().child('loc/').push().set(newcenterobject);
			$state.go('main');
		}
	})

	.controller("RecycleCentreCtrl", function ($scope, $firebaseArray, $http, $localStorage, $ionicLoading, $cordovaLaunchNavigator) {
		console.log("this is recycle center controller");
		$ionicLoading.show();
		// https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyBUkZcQFK1IV8JzQ0AwDaMKhcFPB6yUtS0

		var ref = firebase.database().ref('loc');
    	$scope.data = $firebaseArray(ref);
    	console.log($scope.data);
		
    	coor_list = [];

    	// Get distance from current location to destination
		$scope.data
		.$loaded()
	    .then(function(){
		    console.log($scope.data);
	        // $scope.combined_data = [];
	        var temp_data = [];

	        angular.forEach($scope.data, function(item) {
				var data_coor = (item.coor).replace(', ', ',')
				coor_list.push(data_coor);

				temp_data.push(item);
	        })

	    	console.log("Data Coor : " + encodeURIComponent(coor_list));
	    	
	    	var origin_latlng = $localStorage.current_location_latlng.lat + "," + $localStorage.current_location_latlng.lng;
    		var destination_latlng = encodeURIComponent(coor_list.join('|'));
    		
    		var url_distance = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + origin_latlng + "&destinations=" + destination_latlng + "&key=AIzaSyAUkw3VNzoHCPoM0cfAdgzOyjMVY73zqRU";
    		var request_distance = {
		        url: url_distance
		    }

		    console.log(url_distance);

   			$http(request_distance)
				.success(function (data, status, headers, config) {
					var distance_data = data["rows"]["0"]["elements"];
					console.log(distance_data);

					angular.forEach(temp_data, function(item, key) {
						console.log(key);
						console.log(distance_data[key].distance);
						if (key < 53) {
							temp_data[key]["distance"] = distance_data[key].distance.text;
						}
					})

					$scope.combined_data = temp_data;

					$ionicLoading.hide();
				}).error(function (data, status, headers, config) {
				  alert("Error");
				  $ionicLoading.hide();
			});

	    });

		$scope.navigate_map = function(dest) {
			var coor = dest.split(', ')
			var lat = coor[0]
			var lng = coor[1]

			console.log("Clicked navigation. Loading...")
			console.log($localStorage.current_location_latlng)
			console.log("Current dest: " + dest)

			$cordovaLaunchNavigator.navigate([ lat, lng ], {
			    start: $localStorage.current_location_latlng.lat + ", " + $localStorage.current_location_latlng.lng
			});
		}

	})
