'use strict';

describe('myApp.booking module', function() {

    beforeEach(module('myApp.booking'));

    describe('booking controller', function(){

        it('should ....', inject(function($controller) {
            //spec body
            var booking = $controller('BookingCtrl');
            expect(bookingCtrl).toBeDefined();
        }));

    });
});
