kunzadApp.directive('scrollableContainer', scrollableContainer);
function scrollableContainer() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    if (raw.scrollTop != 0) {
                        scope.$apply(attrs.scrollableContainer);
                    }
                }
            });
        }
    };
};
