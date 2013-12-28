/*global window */
/*global angular */
/*global $ */
function CardsController($scope) {
    "use strict";

    $scope.board = {};
    $scope.board.cards = [];
    $scope.board.cards.stories = [];

    var index = 0;

    function updateLocalStorage() {
        if (window.localStorage) {
            window.localStorage.setItem("board", JSON.stringify($scope.board));
        }
    }

    if (window.localStorage && window.localStorage.getItem("board")) {

        $scope.board = JSON.parse(window.localStorage.getItem("board"));
    }


    if (!$scope.board.cards || $scope.board.cards.length == 0) {

        $scope.board.cards = [];

        $scope.board.cards.push({
            title: "Ready",
            status: 1,
            stories: []
        },
        {
            title: "Commit",
            status: 2,
            stories: []
        },
        {
            title: "In Progress",
            status: 3,
            stories: []
        },
        {
            title: "QA",
            status: 4,
            stories: []
        },
        {
            title: "Demo",
            status: 5,
            stories: []
        });

    }

    $scope.clearBoard = function () {
        $scope.board.stories = [];
        updateLocalStorage();
    };


    $scope.setPosition = function (id, status) {

        angular.forEach($scope.stories, function (story) {
            if (story.$$hashKey === id) {
                story.status = status;
                return;
            }
        });

        updateLocalStorage();
    }

    $scope.updateStory = function (id, title) {

        angular.forEach($scope.board.cards, function (card) {

            angular.forEach(card.stories, function (story) {
                if (story.$$hashKey === id) {
                    story.title = title;
                    return;
                }
            });

        });

        updateLocalStorage();
    };


    $scope.addStory = function () {

        var card = $scope.board.cards[parseInt($scope.status) - 1];

        card.stories.push({
            title: $scope.title,
            points: $scope.points,
            status: $scope.status,
            criteria: $scope.criteria
        });

        updateLocalStorage();
        $('#myModal').modal('hide');
    };

    
    angular.element(document).ready(function () {
        $(".list-group").sortable({
            connectWith: ".list-group",
            placeholder: "ui-state-highlight",
            dropOnEmpty: true,
            handle: '.glyphicon-move',
            update: function (event, ui) {
                $scope.$digest();
                updateLocalStorage();
            }
        });

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
                    scope.updateStory(scope.board.story.$$hashKey, elm.html());
                });
            });
        }
    };
});