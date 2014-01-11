/*global window */
/*global angular */
/*global $ */

function updateLocalStorage(board) {
    window.localStorage.setItem("board", angular.toJson(board));
}

function resetBoard() {
    var board = {};
    board.points = [
         { point: 1 },
         { point: 2 },
         { point: 3 },
         { point: 5 },
         { point: 8 },
         { point: 13 }
    ];

    board.point = board.points[0];

    board.cards = [
    { title: "Ready", status: 1, stories: [], cssClass: "" },
    { title: "Commit", status: 2, stories: [], cssClass: "" },
    { title: "In Progress", status: 3, stories: [], cssClass: "" },
    { title: "QA", status: 4, stories: [], cssClass: "" },
    { title: "Demo", status: 5, stories: [], cssClass: "" }
    ];

    board.status = { title: "Ready", status: 1 };

    updateLocalStorage(board);

    return board;
}

function CardsController($scope) {
    "use strict";

    $scope.board = angular.fromJson(window.localStorage.getItem("board") || resetBoard());

    $scope.resetBoard = function () {
        resetBoard();
    }

    $scope.flip = function () {
        this.card.cssClass = this.card.cssClass === "flip" ? "" : "flip";
        updateLocalStorage($scope.board);
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

        updateLocalStorage($scope.board);
    }

    $scope.removeStory = function () {
        this.card.stories.splice(this.$index, 1);
        updateLocalStorage($scope.board);
    }

    $scope.addStory = function () {

        var card = $scope.board.cards[parseInt($scope.board.status) - 1];

        card.stories.push({
            title: $scope.title,
            points: $scope.points,
            criteria: $scope.criteria
        });

        updateLocalStorage($scope.board);
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
                    var attribs = attrs;
                    if (attribs.ngModel === "title") {
                        scope.story.title = elm.html();
                    }
                    else {
                        scope.story.criteria = elm.html();
                    }

                    updateLocalStorage(scope.$parent.board);
                });
            });
        }
    };
});


