/*global window */
/*global angular */
/*global $ */

function updateLocalStorage(scope) {
    window.localStorage.setItem("board", angular.toJson(scope.board));
}

function CardsController($scope) {
    "use strict";

    var index = 0;

    function resetBoard() {
        $scope.board = {};
        $scope.board.points = [];
        $scope.board.cards = [];
        $scope.board.cards.stories = [];

        $scope.board.points = [
          { point: 1 },
          { point: 2 },
          { point: 3 },
          { point: 5 },
          { point: 8 },
          { point: 13 }
        ];

        $scope.board.point = $scope.board.points[0];

        $scope.board.cards = [
        { title: "Ready", status: 1, stories: [], cssClass:"" },
        { title: "Commit", status: 2, stories: [], cssClass: "" },
        { title: "In Progress", status: 3, stories: [], cssClass: "" },
        { title: "QA", status: 4, stories: [], cssClass: "" },
        { title: "Demo", status: 5, stories: [], cssClass: "" }

        ];

        $scope.board.status = { title: "Ready", status: 1 };

        updateLocalStorage($scope);

        return $scope.board;
    }

    $scope.resetBoard = function () {

        resetBoard();
    }

    $scope.board = angular.fromJson(window.localStorage.getItem("board") || resetBoard());


    $scope.flip = function () {
        this.card.cssClass = this.card.cssClass === "flip" ? "" : "flip";
    }

   
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

        updateLocalStorage($scope);
    }

    $scope.removeStory = function () {
        this.card.stories.splice(this.$index, 1);
        updateLocalStorage($scope);
    }

    $scope.addStory = function () {

        var card = $scope.board.cards[parseInt($scope.board.status) - 1];

        card.stories.push({
            title: $scope.title,
            points: $scope.points,
            criteria: $scope.criteria
        });

        updateLocalStorage($scope);
        $('#myModal').modal('hide');
    };
}

angular.module('scrumBoard', []).directive('contenteditable', function () {
    "use strict";
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            elm.on('blur', function (e) {

                scope.$apply(function () {
                    scope.story.title = elm.html();
                    updateLocalStorage(scope.$parent);
                });
            });
        }
    };
});


