/**
 * Created by ahenriquez on 24-06-16.
 */

angular.module('tender', ['ui.router', 'ui.calendar', 'ui.bootstrap', 'lbServices'])
    .controller('CalendarCtrl', CalendarCtrl)
    .controller('TenderCtrl', TenderCtrl)
    .config(MainConfig)
    .run(runner);

//   ___         _           _ _
//  / __|___ _ _| |_ _ _ ___| | |___ _ _
// | (__/ _ \ ' \  _| '_/ _ \ | / -_) '_|
//  \___\___/_||_\__|_| \___/_|_\___|_|
//
TenderCtrl.$inject = ['$log', '$scope', '$uibModalInstance', 'tender'];
function TenderCtrl($log, $scope, $uibModalInstance, tender) {
  $scope.tender = tender;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

CalendarCtrl.$inject = ['$log', '$scope', '$uibModal', 'uiCalendarConfig', 'Tender'];
function CalendarCtrl($log, $scope, $uibModal, uiCalendarConfig, Tender) {
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
      },
      eventClick: function(event) {
        //
        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'tender.html',
          controller: 'TenderCtrl',
          resolve: {
            tender: function () {
              event.start = new Date(event.start);
              return event;
            }
          }
        });


        return false;
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

