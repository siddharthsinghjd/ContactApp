angular.module('mcontacts.controllers', [])

.controller('ContactsCtrl', function($scope, $location, Contact) {
  $scope.contacts = Contact.query();
})

.controller('ContactDetailCtrl', function($scope, $stateParams, Contact) {
  $scope.contact = Contact.get({contactId:$stateParams.contactId});
})