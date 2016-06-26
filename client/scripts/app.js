/**
 * Created by ahenriquez on 24-06-16.
 */

angular.module('tender', ['ui.router', 'ui.calendar', 'ui.bootstrap', 'lbServices'])
  .controller('CalendarCtrl', CalendarCtrl)
  .config(MainConfig)
  .run(runner);

//   ___         _           _ _
//  / __|___ _ _| |_ _ _ ___| | |___ _ _
// | (__/ _ \ ' \  _| '_/ _ \ | / -_) '_|
//  \___\___/_||_\__|_| \___/_|_\___|_|
//
CalendarCtrl.$inject = ['$log', '$scope', '$compile', 'uiCalendarConfig', 'Tender'];
function CalendarCtrl($log, $scope, $compile, uiCalendarConfig, Tender) {
  $scope.data = {
    events: []
  };

  $scope.uiConfig = {
    calendar:{
      editable: false,
      header:{
        left: 'title',
        center: '',
        right: 'today prev next'
      },
      buttonText: {
        today:    'hoy'
      },
      timezone: 'UTC',
      eventSources: {
        url: '/api/tenders/calendar'
      },
      eventLimit: true,
      eventLimitText: 'más',
      firstDay: 1,
      dayClick: function(date, jsEvent, view) {

        var events = $('.calendar').fullCalendar('clientEvents');
        $scope.data.day    = date;
        $scope.data.events = events.filter(function(item) {
          return moment(date).isSame(moment(item.start), 'day');
        });
      }
    }
  };
}


//   ___           __ _
//  / __|___ _ _  / _(_)__ _
// | (__/ _ \ ' \|  _| / _` |
//  \___\___/_||_|_| |_\__, |
//                     |___/
MainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function MainConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('calendar',{
      url: '',
      controller: 'CalendarCtrl',
      templateUrl:'calendar.html'
    });
}

//
runner.$inject = ['$log', '$rootScope', '$state' ];
function runner($log, $rootScope, $state) {
  $rootScope.$state = $state;
}

