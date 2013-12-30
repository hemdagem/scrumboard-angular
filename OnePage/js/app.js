/*global window */
/*global angular */
/*global $ */
function CardsController($scope) {
    "use strict";

    $scope.board = {};
    $scope.board.points = [];
    $scope.board.cards = [];
    $scope.board.cards.stories = [];

    var index = 0;

    function updateLocalStorage() {
        if (window.localStorage) {
            window.localStorage.setItem("board", angular.toJson($scope.board));
        }
    }

    if (window.localStorage) {

        $scope.board = angular.fromJson(window.localStorage.getItem("board") || {});
    }

    if (!$scope.board.points || $scope.board.points.length == 0) {

        $scope.board.points = [];
        $scope.board.points.push(1, 2, 3, 5, 8, 13);
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

        $scope.board.cardId = $scope.board.cards[0];

    }

    $scope.clearBoard = function () {
        angular.forEach($scope.board.cards, function (card) {
            card.stories = [];
        });

        updateLocalStorage();
    };


    $scope.setPosition = function () {

        var cardId = parseInt(this.cardId);

        var storyToCopy = this.story;

        this.card.stories.splice(this.$index, 1);

        angular.forEach($scope.board.cards, function (cardItem) {

            if (cardItem.status === cardId) {
                cardItem.stories.push({
                    title: storyToCopy.title,
                    points: storyToCopy.points,
                    criteria: storyToCopy.criteria
                });
                return;
            }
        });

        updateLocalStorage();
    }

    $scope.removeStory = function ()
    {
        this.card.stories.splice(this.$index, 1);
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
                    scope.updateStory(scope.story.$$hashKey, elm.html());
                });
            });
        }
    };
}).directive('jqsortable', function () {
    "use strict";
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {



        }

    };
});


