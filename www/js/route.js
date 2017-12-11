app
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state("main", {
				cache: false,
				url: "/main",
				templateUrl: "templates/main.html",
				controller: "MainCtrl"
			})

			.state("research", {
				cache: false,
				url: "/research",
				templateUrl: "templates/research.html",
				controller: "ResearchCtrl"
			})

			.state("learn_more", {
				cache: false,
				url: "/learn-more",
				templateUrl: "templates/learn_more.html",
				controller: "LearnMoreCtrl"
			})

			.state("new_rec_center", {
				cache: false,
				url: "/add-center",
				templateUrl: "templates/add_center.html",
				controller: "AddCenterCtrl"
			})

			.state("showfact", {
				cache: false,
				url: "/showfact",
				templateUrl: "templates/showfacts.html",
				controller: "ShowFactCtrl"
			})

			.state("location", {
				cache: false,
				url: "/location",
				templateUrl: "templates/location.html",
				controller: "LocationCtrl"
			})

			.state("recycle_center", {
				cache: false,
				url: "/recycle-center",
				templateUrl: "templates/recycle_centre.html",
				controller: "RecycleCentreCtrl"
			})

		$urlRouterProvider.otherwise("/main");
	})