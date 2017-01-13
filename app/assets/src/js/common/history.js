

import $ from 'jquery';
import PubSub from 'pubsub-js';


/*------------------------------------------------------------------
[ History ]

    links:
    * https://github.com/mroderick/PubSubJS
    * https://gist.github.com/maxw/3014727

-------------------------------------------------------------------*/

class History {


    constructor(){

        // props
        this.popped = false;
        this.clicksAllowed = false;
        this.rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host) + (document.location.port ? `:${document.location.port}` : '') + '/';

        // start
        this.init();
        this.utilities();

    }


    init() {

        let self = this;

        console.log('history : init');

        PubSub.subscribe('app.start', function(topic, scope) {
            self.popstate();
            self.pushstate();
            self.clicksAllowed = true;
        });

        PubSub.subscribe('app.history.complete', function(topic, scope) {
            self.clicksAllowed = true;
        });

        // set restoration if it is supported
        if ('scrollRestoration' in window.history) {

            window.history.scrollRestoration = 'manual';
            console.log('history : scrollRestoration : ready');

        } else {

            console.log('history : scrollRestoration : not supported');

        }
    }


    popstate() {

        let self = this;

        // log
        console.log('history : popstate');

        //
        $(window).on('popstate', function(event) {

            let url = window.location.href;

            // log history entries
            console.log(window.history);

            // ignore any initial popstate
            if (self.popped) {

                // log
                console.log('history : popstate : new');

                // publish app events
                PubSub.publish('app.history.new', url);

                // set flags
                self.clicksAllowed = false;

            } else {

                // log
                console.log('history : popstate : initial popstate so ignore');
            }
        });
    }


    pushstate() {

        let self = this;
        let $scope = $(document);

        // log
        console.log('history : pushstate');

        // all internal links except .no-history
        $scope.on('click', 'a:internal:not([data-bypass])', function(event) {

            // proceed if allowed
            if (self.clicksAllowed) {

                let $this = $(this);
                let url = $this.attr('href');
                let title = $this.attr('title') || null;

                // log
                console.log('history : click');

                // follow for new tab
                if (event.which == 2 || event.metaKey) {
                    return true;
                }

                // log
                console.log('history : pushstate');

                // trigger pushstate event
                window.history.pushState(null, title, url);

                // publish app events
                PubSub.publish('app.history.new', url);

                // stop click event
                event.preventDefault();
                event.stopPropagation();

                // set flags
                self.clicksAllowed = false;
                self.popped = true;

            }
        });
    }


    utilities() {

        let self = this;

        console.log('history : utilities');

        // internal link check
        $.expr[':'].internal = function(obj, index, meta, stack) {

            let url = $(obj).attr('href') || '';
            return url.substring(0, self.rootUrl.length) == self.rootUrl || url.indexOf(':') == -1;

        };
    }
}

// export
export default History;
