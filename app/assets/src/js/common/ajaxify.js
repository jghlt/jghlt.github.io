

import $ from 'jquery';
import PubSub from 'pubsub-js';
import history from './history';


/*------------------------------------------------------------------
[ Ajaxify ]

    links:
    *

-------------------------------------------------------------------*/

class Ajaxify {


    constructor(){

        // props
        this.$body = $('body');
        this.$ajaxTarget = $('[data-ajax-target]');

        // modules
        this._history = new history();

        //start
        this.init();
    }


    init(){

        let self = this;

        console.log('ajaxify : init');

        PubSub.subscribe('app.history.new', function(topic, url) {
            self.process(url);
        });
    }


    process(url = false){

        let self = this;


        console.log('ajaxify : process');

        self.fetch(url).then(self.finish.bind(self, url));
    }


    fetch(url = false) {

        let self = this;

        console.log('ajaxify : fetch : started');

        return $.ajax({
            url,
            cache: true,
            dataType: 'html',
            success(response) {

                let $html = $('<html/>').html(response);
                let $title = $html.find('title').text();
                let $content = $html.find('[data-ajax-target]');

                // log ...
                // console.log($html);
                // console.log($title);
                // console.log($content);

                self.setTitle($title);
                self.$ajaxTarget.html($content.html());

                console.log('ajaxify : fetch : resolved');

            },
            error() {

                window.location.href = '/';
                console.log('ajaxify : error redirect to homepage');
            }
        });
    }


    setTitle(title = false) {

        if (title){
            document.title = title;
        }

        console.log('ajaxify : setTitle');
    }


    finish() {

        let self = this;

        console.log('ajaxify : finish');

        PubSub.publish('app.history.complete');
        PubSub.publish('app.render', self.$ajaxtarget);
    }
}


// export
export default Ajaxify;


