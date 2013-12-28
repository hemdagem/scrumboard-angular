/*global window */
/*global angular */
/*global $ */
function CardsController($scope) {
    "use strict";
    
    $scope.stories = [];
    var index = 0, stories = [];
    
    function updateLocalStorage() {
        if (window.localStorage) {
            window.localStorage.setItem("stories", JSON.stringify($scope.stories));
        }
    }
    
    if (window.localStorage && window.localStorage.getItem("stories")) {
        
        $scope.stories = JSON.parse(window.localStorage.getItem("stories"));
    }
    
    $scope.clearBoard = function () {
        $scope.stories = [];
        updateLocalStorage();
    };
    
    $scope.updateStory = function (id, title) {
        
        angular.forEach($scope.stories, function (story) {
            if (story.$$hashKey === id) {
                story.title = title;
                return;
            }
        });
        
        updateLocalStorage();
    };
    
    $scope.editStory = function ($editData) {
    
    
        $('#myModal').modal('show');
    };
    
    $scope.addStory = function () {
        $scope.stories.push({
            title: $scope.title,
            points: $scope.points,
            status: $scope.status,
            criteria: $scope.criteria
        });
        
        updateLocalStorage();
        $scope.form.$setPristine();
        $('#myModal').modal('hide');
    };
    
    $(".list-group").sortable({
        connectWith: ".list-group",
        placeholder: "ui-state-highlight",
        dropOnEmpty: true,
        handle : '.glyphicon-move'
    });
}

angular.module('scrumBoard', []).directive('contenteditable', function () {
    "use strict";
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