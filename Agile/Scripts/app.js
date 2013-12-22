
function CardsController($scope) {

    $scope.stories = [];

    if (window.localStorage && window.localStorage.getItem("stories")) {

        var stories = JSON.parse(window.localStorage.getItem("stories"));

        for (i = 0; i < stories.length; i++) {
            $scope.stories.push({
                title: stories[i].title,
                points: stories[i].points,
                status: stories[i].status
            });
        }
    }

    $scope.clearBoard =function()
    {
        $scope.stories = [];
        updateLocalStorage();
    }

    $scope.updateStory = function (id, title) {

        angular.forEach($scope.stories, function (story) {
            if (story.$$hashKey == id) {
                story.title = title;
                return;
            }
        });

        updateLocalStorage();
    }

    $scope.addStory = function () {
        $scope.stories.push({
            title: $scope.title,
            points: $scope.points,
            status: 1
        });

        updateLocalStorage();
        $('#myModal').modal('hide');
    }

    function updateLocalStorage()
    {
        if (window.localStorage)
            window.localStorage.setItem("stories", JSON.stringify($scope.stories));
    }
}

angular.module('scrumBoard', []).directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            elm.on('blur', function () {
                scope.$apply(function () {
                    scope.updateStory(scope.story.$$hashKey, elm.html());
                });
            });
        }
    };
});