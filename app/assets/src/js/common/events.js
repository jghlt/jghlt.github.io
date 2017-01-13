

import $ from 'jquery';
import PubSub from 'pubsub-js';


/*------------------------------------------------------------------
[ Events ]

    links:
    *

-------------------------------------------------------------------*/

class Events {


    constructor(){

        // props
        this.resizing = false;
        this.$body = $('body');
        this.$window = $(window);

        // start
        this.init();
    }


    init() {

        let self = this;

        // log
        console.log('events : init');

        // app event
        PubSub.subscribe('app.start', function(topic, scope) {
            self.scroll();
            self.resize();
        });
    }


    scroll() {

        let self = this;
        let isScrolling = false;
        let scrollTimer = undefined;
        let lastScroll = Date.now();

        // log
        console.log('events : scroll');

        self.$window.on('scroll', function() {

            let $this = $(this);

            if (Date.now() - lastScroll > 100) {

                self.$body.addClass('is-scrolling');
                PubSub.publish('app.events.scroll.start');
                console.log('events : scroll : start');

            }

            lastScroll = Date.now();
            clearTimeout(scrollTimer);

            scrollTimer = setTimeout((function() {

                if (Date.now() - lastScroll > 98) {
                    self.$body.removeClass('is-scrolling');
                    PubSub.publish('app.events.scroll.stop');
                    console.log('events : scroll : stop');
                }

            }), 100);
        });
    }


    resize() {

        let self = this;
        let delay = (function() {
            let delayTimer = 0;
            return function(callback, ms) {
                clearTimeout(delayTimer);
                delayTimer = setTimeout(callback, ms);
            };
        })();

        // log
        console.log('events : resize');

        self.$window.on('resize', function() {

            if (!self.resizing) {

                self.$body.addClass('is-resizing');
                PubSub.publish('app.events.resize.start');
                console.log('events : resize : start');
                self.resizing = true;

            }

            delay((function() {

                self.$body.removeClass('is-resizing');
                PubSub.publish('app.events.resize.stop');
                console.log('events : resize : stop');
                self.resizing = false;

            }), 500);
        });
    }
}


// export
export default Events;

