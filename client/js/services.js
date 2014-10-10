angular.module('mcontacts.services', [])

.factory('Contact', function($resource) {
  return $resource('/resource/contacts/:contactId', null);
})
