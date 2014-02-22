/*global window */
/*global angular */
/*global $ */

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function updateLocalStorage(board) {
    window.localStorage.setItem("board", angular.toJson(board));
}

function getStory(id) {

    var storyToReturn = null;
    var board = angular.fromJson(window.localStorage.getItem("board"));
    angular.forEach(board.cards, function (cardItem) {

        angular.forEach(cardItem.stories, function(story) {

            if (story.storyId === id) {

                storyToReturn= story;
            }
           
        });
    });
    return storyToReturn;
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
    { title: "Ready", status: 1, stories: [], cssClass: "", cardInfo: guid() },
    { title: "Commit", status: 2, stories: [], cssClass: "", cardInfo: guid() },
    { title: "In Progress", status: 3, stories: [], cssClass: "", cardInfo: guid() },
    { title: "QA", status: 4, stories: [], cssClass: "", cardInfo: guid() },
    { title: "Demo", status: 5, stories: [], cssClass: "", cardInfo: guid() }
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
    };

    $scope.flip = function () {
        this.card.cssClass = this.card.cssClass === "flip" ? "" : "flip";
    };

    $scope.removeStory = function () {
        this.card.stories.splice(this.$index, 1);
        updateLocalStorage($scope.board);
    };

    $scope.addStory = function () {

        var card = $scope.board.cards[parseInt($scope.board.status) - 1];

        card.stories.push({
            title: $scope.title,
            points: $scope.points,
            criteria: $scope.criteria,
            storyId: guid()
        });

        updateLocalStorage($scope.board);
        $('#myModal').modal('hide');
    };

}

angular.module('scrumBoard', []).directive('contenteditable', function () {
    "use strict";
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs) {
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
}).directive('draggable', function () {
    return function (scope, element) {
       
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function (e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');

                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function (e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    };
}).directive('droppable', function () {
    return {
        require: 'ngModel',
        scope: {
            drop: '&',
        },
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener('dragover', function (e) {
                e.dataTransfer.dropEffect = 'move';
                // allows us to drop
                if (e.preventDefault) e.preventDefault();
                this.classList.add('over');
                return false;
            }, false);

            el.addEventListener('dragenter', function (e) {
                this.classList.add('over');
                return false;
            }, false);

            el.addEventListener('dragleave', function (e) {
                this.classList.remove('over');
                return false;
            }, false);


            el.addEventListener('drop', function (e) {
                // Stops some browsers from redirecting.
                e.preventDefault();
                if (e.stopPropagation) e.stopPropagation();

                this.classList.remove('over');
                var storyId = e.dataTransfer.getData('Text');

                scope.$apply(function (currentScope) {

                    var status = currentScope.$parent.card.status;
                    
                    var storyToCopy = getStory(storyId);
                    
                    var keepgoing = true;
                    angular.forEach(currentScope.$parent.board.cards, function (card) {

                        if (keepgoing) {
                            angular.forEach(card.stories, function(story, index) {
                                if (story.storyId === storyId) {
                                    card.stories.splice(index, 1);
                                    keepgoing = false;
                                }
                            });
                        }
                    });
                    keepgoing = true;
                    angular.forEach(currentScope.$parent.board.cards, function (cardItem) {

                        if (keepgoing) {
                            if (cardItem.status === status) {
                                cardItem.stories.push({
                                    title: storyToCopy.title,
                                    points: storyToCopy.points,
                                    criteria: storyToCopy.criteria,
                                    storyId: storyToCopy.storyId
                                });
                                keepgoing = false;
                            }
                        }
                    });

                    updateLocalStorage(currentScope.$parent.board);

                });

                return false;
            }, false
);

        }
    };
});


