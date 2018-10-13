app.controller('PlayerController', ['$scope','$http', function($scope, $http ){
	$scope.manifestUrl = "/None";

	window.addEventListener('load', startup);

	function startup(){
		initApp();
	}


	$scope.availableMpds = [{id: '/None', name: "Select video"},];

    $http.post('/', angular.toJson({name: 'get_video_list'}))
        .then(
            function (response) {
                $scope.availableMpds = $scope.availableMpds.concat(response.data);
            }
        );



    $scope.videoStatus = {
    };

    setInterval(updateStatus, 1000);

    function updateStatus(){
        if(window.player == undefined)
            return;

        var videoStats = window.player.getStats();
        var fixval = 3;


        if(videoStats.playTime <= (window.player.f.duration - 1)){
            $scope.videoStatus.sessionTime = (videoStats.bufferingTime + videoStats.playTime).toFixed(fixval) + " sec";
            $scope.videoStatus.joinTime = (videoStats.loadLatency).toFixed(fixval) + " sec";
            $scope.videoStatus.bufferingTime = (videoStats.bufferingTime).toFixed(fixval) + " sec";
            $scope.videoStatus.playTime = (videoStats.playTime).toFixed(fixval) + " sec";
            $scope.videoStatus.bufferingRatio = ((videoStats.bufferingTime) / (videoStats.bufferingTime + videoStats.playTime) * 100).toFixed(fixval) + " %";

            $scope.videoStatus.bitrate = (videoStats.streamBandwidth / 1024 / 1024).toFixed(fixval) + " Mbps";
            $scope.videoStatus.bandwidth = (videoStats.estimatedBandwidth / 1024 / 1024).toFixed(fixval) + " Mbps";

            $scope.videoInfo.readyState = window.player.K.readyState;
            $scope.videoInfo.mpd = $scope.manifestUrl;

            var curTime = window.player.f.currentTime;
            var min = Math.floor(curTime / 60);
            var sec = Math.floor(curTime % 60);

            $scope.videoInfo.curTime = min + ":" + sec;
            //console.log($scope.videoInfo.readyState);

            $scope.$digest();
        }
    }

	function initApp(){
		shaka.polyfill.installAll();
		if(shaka.Player.isBrowserSupported()){
			var video = document.getElementById('video');
			var player = new shaka.Player(video);
			window.player = player;
			player.addEventListener('error', onErrorEvent);
		}
		else{
			console.error('Browser not supported!');
		}
	}

	/*function initPlayer(){
		//New
		var video = document.getElementById('video');
		var player = new shaka.Player(video);
		window.player = player;
		player.addEventListener('error', onErrorEvent);
	}*/

	function onErrorEvent(event){
		var err = event.detail;
		onError(event.detail);
	}

	function onError(error) {
		console.error('Error code', error.code, 'object', error);
	}

	function startView(){
		window.player.unload().then(function(){
			window.player.load("http://127.0.0.1:55555" + $scope.manifestUrl).then(function() {
				console.log(window.player.getConfiguration());
				console.log('The video has now been loaded!');
				console.log($scope.manifestUrl);

				$scope.videoInfo = {};
				$scope.$digest();

			}).catch(onError);
		});
	}

	$scope.onChangeMPD = function(){
		console.log("onChangeMPD : " + $scope.manifestUrl);
		//startView();
		//initApp();
	}

	$scope.DASH_encode = function () {
        /*
        send request to DASH video
         */
        $http.post('/', angular.toJson({id: $scope.manifestUrl, name: 'dash'}) )
            .then(
                function (response) {
                    console.log(response.data);
                }
            )

    }
    $scope.start_stream = function () {
        /*
        send request to stream video
         */
        $http.post('/', angular.toJson({id: $scope.manifestUrl, name: 'stream'}))
            .then(
                function (response) {
                    console.log(response.data);

                }
            )
    }

}]);

