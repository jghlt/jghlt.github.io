

import $ from 'jquery';
import PubSub from 'pubsub-js';
import slick from 'slick-carousel';


/*------------------------------------------------------------------
[ Carousels ]
-------------------------------------------------------------------*/

class Carousels {


    constructor(){

        // start
        this.init();
    }


    init(){

        let self = this;

        PubSub.subscribe('app.start', function(topic, scope) {
            self.setup(scope);
        });

        PubSub.subscribe('app.render', function(topic, scope) {
            self.setup(scope);
        });
    }


    setup(scope){

        let self = this;
        let $scope = scope ? $(scope) : $(document);
        let $carousels = $scope.find('[data-carousel]');

        console.log('carousels : setup');
        console.log(`carousels : ${$carousels.length} found`);

        if ($carousels.length) {

            $carousels.each(function(index, element) {

                new Carousel(index, element);

            });
        }
    }
}


/*------------------------------------------------------------------
[ Carousel ]
-------------------------------------------------------------------*/

class Carousel {


    constructor(index, element){

        // props
        this.index = index;
        this.paused = false;
        this.element = element;
        this.isDevelopment = window.location.hostname.indexOf('.dev') != -1 ? true : false;
        this.$control = $(element).parents('[data-carousel]');
        this.$pager = this.$control.find('[data-carousel-pager]');
        this.$cursor = $(element).data('carousel-cursor') ? true : false,

        // start
        this.init(element);

        // cursor
        if (this.$cursor) this.cursor();
    }


    init(element){

        let self = this;

        console.log('carousels : init');

        // events need binding before slick
        $(element).on('beforeChange', function(event, slick, currentSlide, nextSlide){

            // udpate pager if
            if (self.$pager.length){

                console.log(`carousel : update pager : ${nextSlide+1}`);
                self.$pager.find('[data-carousel-current]').text(nextSlide+1);

            }

            console.log('carousel : change : before');
            PubSub.publish('app.carousel.change.before', element);

        });

        //
        $(element).on('afterChange', function(event, slick, currentSlide, nextSlide){

            console.log('carousel : change : after');
            PubSub.publish('app.carousel.change.after', element);

        });

        //
        $(element).slick({

            // general
            useTransfrom: true,
            adaptiveHeight: true,
            cssEase: 'cubic-bezier(0.86, 0, 0.07, 1)',

            // controls
            dots: $(element).data('carousel-dots') ? true : false,
            arrows: $(element).data('carousel-arrows') ? true : false,
            appendDots: $(element).parents().find('.carousel__pagination'),
            appendArrows: $(element).parents().find('.carousel__controls'),

            // controls html
            prevArrow: '<span class="carousel__control carousel__control--arrow--left"></span>',
            nextArrow: '<span class="carousel__control carousel__control--arrow--right"></span>',

            // speed / configurable with defaults
            infinite: $(element).data('carousel-infinite') ? true : false,
            autoplay: $(element).data('carousel-autoplay') ? true : false,
            autoplaySpeed: $(element).data('carousel-autoplay-speed') ? $(element).data('carousel-autoplay-speed') : 4000,
            speed: $(element).data('carousel-speed') ? $(element).data('carousel-speed') : 350

        });
    }


    cursor() {

        // properties
        let self = this;
        let $target = $(self.element);

        console.log('carousel : curosr');

        // add default class
        $target.addClass('carousel--cursor');

        // add / remove left class
        $target.on('mousemove', function(event) {

            let position = event.clientX;

            if (position < $target.outerWidth() / 2) {

                $target.addClass('carousel--cursor--left');

            } else {

                $target.removeClass('carousel--cursor--left');
            }
        });


        // click events
        $target.on('click', function(event) {

            event.preventDefault();
            event.stopPropagation();

            let position = event.clientX;

            if (position < $target.outerWidth() / 2){

                $target.slick('slickPrev');

            } else {

                $target.slick('slickNext');
            }
        });
    }
}


// export
export default Carousels;
