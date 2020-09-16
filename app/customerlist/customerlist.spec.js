'use strict';

describe('myApp.customerlist module', function() {

    beforeEach(module('myApp.customerlist'));

    describe('customerlist controller', function(){

        it('should ....', inject(function($controller) {
            //spec body
            var customerlistCtrl = $controller('CustomerlistCtrl');
            expect(customerlistCtrl).toBeDefined();
        }));

    });
});
