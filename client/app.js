angular.module('mcontacts', ['ionic', 'ngResource'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

// ************ APP ROUTING *****************

  $stateProvider.state('tabs', {
    url: "/tab",
    abstract: true,
    templateUrl: "tabs-container.html"
  })

  .state('tabs.contacts', {
    url: '/contacts',
    views: {
      'tab-contacts': {
        templateUrl: 'tab-contacts.html',
        controller: 'ContactsCtrl'
      }
    }
  })

  .state('tabs.contact-detail', {
    url:'/contacts/:contactId',
    views: {
      'tab-contacts': {
        templateUrl: 'contact-detail.html',
        controller: 'ContactDetailCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/contacts');

})

// ************ CONTROLLERS *****************

.controller('ContactsCtrl', function($scope, $location, Contact) {
  $scope.contacts = Contact.query();

  $scope.doRefresh = function() {
    Contact.query(function(contacts) {
        $scope.contacts = contacts;
        $scope.$broadcast('scroll.refreshComplete');
    });
  }

})

.controller('ContactDetailCtrl', function($scope, $stateParams, $ionicModal, Contact) {
  $scope.contact = Contact.get({contactId:$stateParams.contactId});

  $scope.edit = function() {
    $scope.modal.show();
  }

  $ionicModal.fromTemplateUrl('contact-edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.save = function() {
    new Contact($scope.contact).$save(function() {
      $scope.modal.hide();
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  
})

// ************ SERVER RESOURCES (via Ajax) *****************

.factory('Contact', function($resource) {
  return $resource('/resource/contacts/:contactId', null);
})
