

import $ from 'jquery';
import PubSub from 'pubsub-js';

// common
// import common from './common/common';

// components
// import components from './components/components';

/*------------------------------------------------------------------
[ App ]
-------------------------------------------------------------------*/


class App {


    constructor(scope){

        // properties
        this.debug = false;

        // debug?
        if (!this.debug) {
            console.log = function() {};
        }

        // common
        // this._common = new common();

        // components
        // this._component = new component();

        // start
        this.init(scope);
    }


    init(scope){

        // app event
        PubSub.publish('app.start', scope);
        console.log('app.start');

    }
}


// start
$(function() {
    new App($('html'));
});
