

import $ from 'jquery';
import PubSub from 'pubsub-js';


/*------------------------------------------------------------------
[ navigation ]
-------------------------------------------------------------------*/

class Navigation {


    constructor() {

        // properties
        this.open = false;
        this.$html = $('html');
        this.$body = $('body');
        this.$toggle = $('[data-navigation-toggle]');

        // start
        this.init();
    }


    init() {

        let self = this;

        console.log('navigation : init');

        PubSub.subscribe('app.start', function(topic, scope) {
            self.setup(scope);
        });

        PubSub.subscribe('app.navigation.open', function() {
            self.open();
        });

        PubSub.subscribe('app.navigation.close', function() {
            self.close();
        });
    }


    setup(event) {

        let self = this;

        console.log('navigation : setup');

        self.$toggle.on('click', function(event) {

            event.preventDefault();
            event.stopPropagation();

            console.log('navigation : click');
            console.log(`navigation : open = ${self.open}`);

            if (self.open) {

                self.close();

            } else {

                self.open();

            }
        });
    }


    open() {

        let self = this;

        console.log('navigation : open');

        self.$html.css({overflow: 'hidden'});
        self.$body.addClass('navigation-is-open');
        self.open = true;
    }


    close() {

        let self = this;

        console.log('navigation : close');

        self.$html.css({overflow: ''});
        self.$body.removeClass('navigation-is-open');
        self.open = false;
    }
}


// export
export default Navigation;
