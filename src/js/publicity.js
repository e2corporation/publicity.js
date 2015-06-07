/**
 * Publicity.jsx (BETA)
 * ---
 * Built on React with JSX Syntax
 *
 * @filesource  publicity.jsx
 * @author      Julien Chinapen <julien@revcontent.com>
 * @version     1.0.0
 * @category    api-contest
 * @package     publicity
 * @subpackage  javascripts
 * @license     Private, Copyright (c) Julien Chinapen
 * @todo        Compile JSX For Production (Grunt Task) !!
 * @todo        How to handle user-level component extensions?
 * @todo        Apply Unique IDs to Card Components
 * @todo        Add support for lazy loading cards for arrangement containers...
 * @todo        Implement Duplicate Ad checking ability
 * @todo        Add Network Offline support
 * @todo        Future: Enable Card Action Cloaking (URL Juggle )
 * @todo        Make card component animations configurable
 * @todo        Consider giving each card or component it's own Animation FX Queue...
 * @todo        Properly configure internal and sponsored parameters
 */


/**
 * PublicityJS Singleton
 * @type {{getInstance}}
 */
var PublicityJS = (function ($, window, document, React, undefined) {

    //'use strict';

    // RC Namespace
    var RevContent = {
        API: {
            'endpoint': 'https://trends.revcontent.com/api/v1/?',
            'api_key': 'fdbd849fb2b8c1c259585e7bcd6a09cc87e3e5b7',
            'pub_id': 10,
            'widget_id': 21,
            'type': 'json',
            'domain': 'powr.com'
        }

    };

    // API Providers
    var API_PROVIDERS = {
        REV2: RevContent
    };

    // Publicity Singleton
    var PublicityInstance = null;

    function __getInstance() {
        if (!PublicityInstance) {
            PublicityInstance = new initializePublicity();
        }

        return PublicityInstance;
    }

    function initializePublicity() {

        var Publicity = {
            ReactCSSTransitionGroup: React.addons.CSSTransitionGroup,
            stack: [],
            emptyCard: {
                headline: '',
                url: '#',
                image: 'http://placehold.it/320x240'
            },
            getStack: function () {
                return this.stack;
            },
            foo: [],
            options: {
                cardClass: 'publicity-card',
                gridClass: 'publicity-arrangement'
            },
            internal_count: 1,
            internal_offset: 1,
            sponsored_count: 1,
            sponsored_offset: 1,
            init: function () {

                // Merge Global Options
                // Publicity.options = $.extend({}, Publicity.options, PUBLICITY_OPTIONS != undefined ? PUBLICITY_OPTIONS : {});

                // Build React Components and Subcomponents
                Publicity.createComponents();

                // Build Example Poster Card
                //Publicity.buildCard(document.getElementById('example_card'));

                // Build Publicity Cards
                $.each($('.publicity-card'), function (cid, card) {
                    Publicity.buildCard(card);
                });

                // Build Publicity Arrangements
                $.each($('.publicity-arrangement'), function (aid, arrangement) {
                    Publicity.buildArrangement(arrangement);
                });


                // Build Example Arrangement (4x3)
                Publicity.buildArrangement(document.getElementById('example_grid'));

                // Build Example Arrangement (1x2)
                Publicity.buildArrangement(document.getElementById('example_grid_1x2'));

                // Apply Bindings + Post processing
                //Publicity.configureCards();

                return this;

            },
            /**
             * React on a touch device such as a phone or tablet,
             */
            enableTouchEventHandling: function () {
                React.initializeTouchEvents(true);
            },
            /**
             * Fetch One or more Advertisement Cards from REV2
             *
             * @param card
             * @param in_o
             * @param in_ct
             * @param sp_o
             * @param sp_ct
             * @param posterComponent
             * @param arrangementComponent The Grid the poster card belongs to
             * @param arrangementKey
             */
            fetchCard: function (card, in_o, in_ct, sp_o, sp_ct, posterComponent) {
                if (!card) {
                    var $card = $('.card:first');
                } else {
                    var $card = card;
                }
                if (!in_o) {
                    //offset = parseInt($card.attr('data-offset'));
                    in_o = parseInt($card.attr('data-offset'));
                }
                if (!in_ct) {
                    //offset = parseInt($card.attr('data-offset'));
                    in_ct = parseInt($card.attr('data-count'));
                }
                if (!sp_o) {
                    //offset = parseInt($card.attr('data-offset'));
                    sp_o = parseInt($card.attr('data-sp-offset'));
                }
                if (!sp_ct) {
                    //offset = parseInt($card.attr('data-offset'));
                    sp_ct = parseInt($card.attr('data-sp-count'));
                }

                //console.log("FETCHING CARD...", card, in_o, in_ct, sp_o, sp_ct);

                // Advance Counters
                Publicity.internal_count = in_o || 1;
                //Publicity.internal_offset = in_o + (in_ct || 1);
                Publicity.internal_offset++;

                Publicity.sponsored_count = sp_ct || 1;
                //Publicity.sponsored_offset = sp_o + (sp_ct || 1);
                Publicity.sponsored_offset++;

                // Fetch Card w/ AJAX Request
                var fetch_card = $.ajax({
                    url: RevContent.API.endpoint,
                    type: 'get',
                    dataType: RevContent.API.type,
                    cache: false,
                    data: {
                        'api_key': RevContent.API.api_key,
                        'pub_id': RevContent.API.pub_id,
                        'widget_id': RevContent.API.widget_id,
                        'type': RevContent.API.type,
                        'domain': RevContent.API.domain,
                        //'internal_count': 0,
                        //'internal_offset': 0,
                        'sponsored_count': Publicity.sponsored_count,
                        'sponsored_offset': Publicity.sponsored_offset
                        //'user_ip': '',
                        //'user_agent': '',
                    },
                    beforeSend: function () {
                        Publicity.hideDismissal($card);
                        Publicity.activateLoader($card);


                        /*if(typeof posterComponent == 'object'){
                         posterComponent.setState({
                         internal_count: Publicity.internal_count,
                         internal_offset: Publicity.internal_offset,
                         sponsored_count: Publicity.sponsored_count,
                         sponsored_offset: Publicity.sponsored_offset
                         });
                         }*/

                    },
                    success: function (ad_response) {
                        //$('#card_response').text(JSON.stringify(ad_response));
                        //console.log("Got Ad Response...", ad_response);
                        //console.log(ad_response);
                        if (ad_response.length > 0) {

                            //if(ad_response.length == 1) {
                            Publicity.stack.push(ad_response[0]);
                            //}
                            // else {
                            //    Publicity.stack.push(ad_response);
                            //}

                            // Setup Component State/Properties
                            if (typeof posterComponent == 'object') {
                                if (posterComponent.isMounted()) {
                                    //console.log("Mounted Card!", posterComponent, Publicity.stack[Publicity.stack.length - 1]);
                                    posterComponent.setState({
                                        //data: Publicity.stack[Publicity.stack.length - 1],
                                        internal_count: Publicity.internal_count,
                                        internal_offset: Publicity.internal_offset,
                                        sponsored_count: Publicity.sponsored_count,
                                        sponsored_offset: Publicity.sponsored_offset
                                    });
                                    if (typeof posterComponent.props.myArrangement == 'object') {
                                        // Get current data stack..
                                        var current_cards = posterComponent.props.myArrangement.props.data;
                                        // Replace the existing card directly in place...
                                        var position_key = posterComponent.props.myKey;
                                        if (isNaN(position_key)) {
                                            position_key = current_cards.length;
                                        }
                                        current_cards[position_key] = Publicity.stack[Publicity.stack.length - 1];
                                        // Re-establish data property to triggere a re-render....
                                        posterComponent.props.myArrangement.setProps({data: current_cards});
                                        //posterComponent.props.myArrangement.setState({revised_stack: current_cards});
                                    } else {
                                        //console.log(posterComponent);
                                        // For Individual Card Requests, replace the Data stack to trigger re-render....
                                        posterComponent.setProps({data: Publicity.stack[Publicity.stack.length - 1]});
                                    }


                                    //Publicity.configureCards(card);
                                    if (!$(posterComponent.getDOMNode()).find('.loader').hasClass('deactivated')) {
                                        Publicity.deactivateLoader($(posterComponent.getDOMNode()));
                                    }

                                }

                            }

                        }

                        if (ad_response.length > 0) {
                            return ad_response;
                        }

                        /*if (typeof ad_response[0] == 'object') {
                         $card.find('a.cta').attr({href: ad_response[0].url});
                         $card.find('.headline').text(ad_response[0].headline);
                         $card.find('.image img').attr({src: ad_response[0].image});

                         Publicity.hideDismissal($card);
                         var next_offset = offset + 1;
                         $card.attr({'data-offset': next_offset});

                         }*/

                    },
                    error: function (response) {

                    }
                });
            },
            advanceCounters: function (in_o, in_ct, sp_o, sp_ct) {
                Publicity.internal_count = in_o || 1;
                //Publicity.internal_offset = in_o + (in_ct || 1);
                Publicity.internal_offset++;

                Publicity.sponsored_count = sp_ct || 1;
                //Publicity.sponsored_offset = sp_o + (sp_ct || 1);
                Publicity.sponsored_offset++;
            },
            /**
             * Retrieve Ads from REV2 API
             *
             * @param {Integer} sp_ct Count of sponsored items to retrieve
             * @param {Integer} sp_o  sponsored offset
             * @param {Integer} cols
             * @param {Boolean} load_more
             * @param gridNode
             * @param {Function} callback
             */
            retrieveAds: function (sp_ct, sp_o, cols, load_more, gridNode, callback) {
                //if(!stack){ var stack = []};
                //return function(){
                var ads = [];
                var retrieve_ads = $.ajax({
                    url: RevContent.API.endpoint,
                    type: 'get',
                    dataType: RevContent.API.type,
                    cache: false,
                    data: {
                        'api_key': RevContent.API.api_key,
                        'pub_id': RevContent.API.pub_id,
                        'widget_id': RevContent.API.widget_id,
                        'type': RevContent.API.type,
                        'domain': RevContent.API.domain,
                        //'internal_count': 0,
                        //'internal_offset': 0,
                        'sponsored_count': sp_ct || Publicity.sponsored_count,
                        'sponsored_offset': sp_o || Publicity.sponsored_offset
                        //'user_ip': '',
                        //'user_agent': '',
                    },
                    beforeSend: function () {


                    },
                    success: function (ad_response) {
                        if (ad_response.length > 0) {
                            //console.log("Successs!", ad_response);

                            Publicity.stack.concat(ad_response);
                            //console.log(typeof callback, callback);
                            if (typeof callback == 'function') {
                                Publicity.advanceCounters(sp_o, sp_ct, sp_o, sp_ct)
                                callback(ad_response, load_more, cols, sp_o, gridNode);
                            } else {

                            }
                        }
                    },
                    error: function () {
                    }

                });
                /*.done(function(){
                 console.log("Done!", ads);
                 return ads;

                 });*/


                //}

            },
            /**
             * Show Dismissal Panel
             * @param card Element to operate on (DOM Node)
             * @returns {Publicity}
             */
            showDismissal: function (card) {
                card.find('.dismissal').animate({'margin-top': 0}, 600, 'easeOutQuart', function () {
                    $(this).addClass('on').removeClass('off');
                });
                return this;
            },
            /**
             * Hide Dismissal Panel
             * @param card Element to operate on (DOM Node)
             * @returns {Publicity}
             */
            hideDismissal: function (card) {
                card.find('.dismissal').animate({'margin-top': '-600px'}, 500, 'easeInQuart', function () {
                    $(this).removeClass('on').addClass('off');
                });
                return this;
            },
            /**
             * Activate Card Preloader
             * @param card
             * @returns {Publicity}
             */
            activateLoader: function (card) {

                /*card.find('.overlay').animate({'backgroundColor': 'rgba(0,0,0,0.9)'}, 350, 'easeInOutCirc', function () {

                 });*/
                card.find('.overlay').css({'backgroundColor': 'rgba(0,0,0,0.8)'});
                Publicity.dropHeadline(card);
                card.find('.loader').transition({
                    //perspective: 100 + 'px'
                    /*perspective: '100px',
                     rotate3d: '1,1,0,180deg', */
                    x: 0,
                    y: 0,
                    opacity: 1
                    /*rotateY: '180deg',*/

                }, 100, 'easeOutQuad', function () {

                    $(this).addClass('activated').removeClass('deactivated');

                });

                return this;
            },
            /**
             * Deactivate Card Preloader
             * @param card
             * @returns {Publicity}
             */
            deactivateLoader: function (card) {

                card.find('.loader').delay(660).transition({
                    x: 700,
                    y: -700
                }, 660, 'easeInQuad', function () {
                    var the_loader = this;
                    //console.log("Using Overlay..",  card.find('.overlay'));

                    card.find('.overlay').animate({'backgroundColor': 'rgba(0,0,0,0.1)'}, 1000, 'easeInOutQuint', function () {
                        //console.log("Overlay transition done....");
                        the_loader.addClass('deactivated').removeClass('activated');
                        //$(this).css({'z-index': 150});
                        Publicity.raiseHeadline(card);

                    });


                });
                //card.find('.loader').animate({'marginTop': '-1600px', 'marginLeft': '-1000px'}, 1800, 'easeInExpo', function () {

                //$(this).addClass('deactivated').removeClass('activated').animate({}, 500, 'easeInQuad');
                //$(this).animate({'marginTop':'-600px','marginLeft': '-600px'}, 1500, 'easeOutQuart', function(){


                //});

                //});
                return this;
            },
            /**
             * Raise Headline
             * @param card
             * @returns {Publicity}
             */
            raiseHeadline: function (card) {
                card.find('.headline').hide().css({
                    'z-index': 161,
                    'opacity': 0,
                    'bottom': 0
                }).show().animate({'opacity': 1}, 327, 'easeOutExpo');
                return this;
            },
            /**
             * Drop Headline
             * @param card
             * @returns {Publicity}
             */
            dropHeadline: function (card) {
                card.find('.headline').css({
                    'opacity': 0,
                    'z-index': 150,
                    'bottom': '-50px'
                }).animate({}, 240, 'easeInQuad');
                return this;
            },
            /**
             * Dock Poster Card
             * @param card
             * @returns {Publicity}
             */
            dockCard: function (card) {
                Publicity.hideDismissal(card);
                card.animate({
                    'margin-bottom': '-500px',
                    'opacity': 0
                }, 600, 'easeOutSine', function () {
                    $(this).addClass('fixed').addClass('docked');
                });
                setTimeout(function () {
                    Publicity.revealCard(card);
                }, 5000);
                return this;
            },
            /**
             * Reveal Poster Card
             * @param card
             * @returns {Publicity}
             */
            revealCard: function (card) {
                card.animate({
                    'margin-bottom': 0,
                    'opacity': 1,
                    'left': $('.wrapper').offset().left
                }, 900, 'easeOutExpo', function () {
                    $(this).removeClass('docked');
                });
                return this;
            },
            /**
             * Restore Poster Card
             * @param card
             */
            restoreCard: function (card) {
                card.removeClass('fixed').removeClass('docked').animate({
                    'margin-bottom': 0,
                    'opacity': 0.5,
                    'left': 0
                });
                return this;
            },
            /**
             * Get Next Card
             * @param card
             */
            nextCard: function (card) {
                //Publicity.fetchCard(card);
            },
            /**
             * Switch Card Overlay ON/OFF
             * @param mode
             * @param card
             * @returns {Publicity}
             */
            switchOverlay: function (mode, card) {
                switch (mode) {
                    case 'on':
                        card.find('.overlay').stop(true, true).animate({'opacity': 1}, 850, 'easeOutBack', function () {
                            $(this).removeClass('hover');
                        });
                        break;
                    case 'off':
                        card.find('.overlay').stop(true, true).animate({'opacity': 0.05}, 1050, 'easeOutSine', function () {
                            $(this).addClass('hover');
                        });
                        break;
                }
                return this;
            },
            /**
             * Configure Card Components (Setup General Bindings)
             * ---
             * NOTE: Remember to call this routine after injecting new cards into the DOM!
             * @param card
             */
            configureCards: function (card) {
                var cards = [];
                if (!card) {
                    cards = $('.card');
                } else {
                    cards = $(card);
                }
                $.each(cards, function (cid, card) {

                    $(card).on('mouseenter', function () {
                        /*$(this).animate({'background': 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'}, 500, 'linear');*/
                        Publicity.switchOverlay('off', $(this));
                    });

                    $(card).on('mouseleave', function () {
                        Publicity.switchOverlay('on', $(this));
                    });


                    $(card).find('.dismissal').find('.close-dismissal').on('click', function () {
                        Publicity.hideDismissal($(card));
                    });
                    $(card).find('.dismissal').find('.remove-ad').on('click', function () {
                        //Publicity.dockCard($(card));
                        Publicity.nextCard($(card));
                    });

                    $(card).find('.close-card').on('click', function () {
                        Publicity.showDismissal($(card));
                    });

                    //$(card).find('.snooze-card').on('click', function () {
                    //    Publicity.dockCard($(card));
                    //});
                    //$(card).find('.restore-card').on('click', function () {
                    //    Publicity.restoreCard($(card));
                    //});

                    $.each($(card).find('.dismissal ul').children(), function (item_id, reason_item) {
                        $(reason_item).on('click', function () {
                            $(this).addClass('selected').siblings().removeClass('selected');
                        });
                    });

                    $('')

                });
            },
            /**
             * Create Core Components (React.js Based)
             * ---
             */
            createComponents: function () {

                /**
                 *  Poster Arrangement (Ad Grid)
                 *  -- an arrangement consists of one or more poster cards
                 */
                Publicity.PosterArrangement = React.createClass({displayName: "PosterArrangement",
                    getInitialState: function () {
                        return {
                            revised_stack: []
                        }
                    },
                    componentDidMount: function () {
                        if (this.isMounted()) {
                            //Publicity.configureCards();
                            //Publicity.configureCards($(this.getDOMNode()).find('.card'));
                        }
                    },
                    componentDidUpdate: function () {
                        //Publicity.configureCards($(this.getDOMNode()).find('.card'));
                        $(this.getDOMNode()).find('.spinner').css({
                            'marginTop': 0,
                            'opacity': 1
                        }).delay(2000).animate({'marginTop': '10px', 'opacity': 0}, 450, 'easeOutExpo', function () {

                        });
                        $(this.getDOMNode()).find('.load-btn').removeClass('disabled').delay(1000).animate({'opacity': 1}, 450, 'easeInQuad', function () {

                        });
                    },
                    componentWillUpdate: function () {
                        $(this.getDOMNode()).find('.load-btn').addClass('disabled').animate({'opacity': 0}, 250, 'easeOutQuad', function () {

                        });
                        $(this.getDOMNode()).find('.spinner').css({
                            'marginTop': '10px',
                            'opacity': 0
                        }).show().animate({'marginTop': 0, 'opacity': 1}, 650, 'easeOutExpo', function () {

                        });

                    },
                    loadMoreCards: function () {
                        var more_cards = [];
                        var existing_cards = this.props.data;
                        var arrangement = this;
                        /*for (var i = 0; i < this.props.loadCount; i++) {
                         more_cards.push({});
                         }
                         newData = this.props.data.concat(more_cards);
                         //console.log(this.props.data.length, newData.length);
                         this.setProps({data: newData});*/

                        var load_more_ads = $.ajax({
                            url: RevContent.API.endpoint,
                            type: 'get',
                            dataType: RevContent.API.type,
                            cache: false,
                            data: {
                                'api_key': RevContent.API.api_key,
                                'pub_id': RevContent.API.pub_id,
                                'widget_id': RevContent.API.widget_id,
                                'type': RevContent.API.type,
                                'domain': RevContent.API.domain,
                                //'internal_count': 0,
                                //'internal_offset': 0,
                                'sponsored_count': this.props.loadCount || Publicity.sponsored_count,
                                'sponsored_offset': parseInt($(this.getDOMNode()).find('.card-zone:last').find('.card').attr('data-offset')) || 0
                                //'user_ip': '',
                                //'user_agent': '',
                            },
                            beforeSend: function () {


                            },
                            success: function (more_cards) {
                                //("Load more success! about to set props!", more_cards);

                                arrangement.setProps({data: existing_cards.concat(more_cards)});

                            }

                        });

                    },
                    /**
                     * RENDER Grid Arrangement (REACT)
                     * @returns {XML}
                     */
                    render: function () {
                        var this_arrangement = this;
                        var option_branding = this.props.branding;
                        var posterCards = this.props.data.map(function (card, cid) {
                            //console.log("Got Card...", card);
                            return (
                                React.createElement(Publicity.PosterCard, {key:  cid, data:  card, dataOrientation: "left", dataSize: "normal", 
                                                      dataOffset:  cid, dataAutofill: "false", myKey:  cid, 
                                                      dataBranding: true === option_branding ? true : false, 
                                                      myArrangement:  this_arrangement, ref: "myCard"})

                            );
                        });
                        if (this.state.revised_stack.length > 0) {
                            alert("Revising Stack!");
                            posterCards = this.state.revised_stack;
                        }
                        return (
                            React.createElement("div", {className: "card-arrangement", ref: "myArrangement", 
                                 "data-branding": true === this.props.dataBranding ? "true" : "false", 
                                 "data-load-more": this.props.loadMore == true ? true : false, 
                                 "data-load-count": this.props.loadCount, 
                                 "data-load-offset": this.props.loadOffset}, 

                                posterCards, 
                                React.createElement("div", {className: "cf"}), 
                                this.props.loadMore ? React.createElement(Publicity.ArrangementLoader, {onClick: this.loadMoreCards}) : ''
                            )
                        );
                    }

                });

                /**
                 * Load More Trigger (Lazy-load)
                 * @type {*}
                 */
                Publicity.ArrangementLoader = React.createClass({displayName: "ArrangementLoader",
                    getInitialState: function () {
                        return {'load_more': false}
                    },
                    LoadCards: function (event) {

                        this.setState({'load_more': true});
                    },
                    componentDidMount: function () {

                    },
                    componentDidUpdate: function () {
                        if (this.state.load_more == true) {

                            //var outlet = $($(this.getDOMNode()).find('.ad-portal'));
                            // Trigger Parent Component's Loading handler... (Routed through click event)
                            if (this.isMounted()) {
                                this.props.onClick();
                                this.setState({load_more: false});
                                $(this.getDOMNode()).find('.spinner').hide();
                            }
                            //if(this.isMounted()){
                            //}
                            //Publicity.buildArrangement(document.getElementById('adPortal'));
                            //Publicity.buildArrangement();
                            //this.props.arrangementData.push({});
                            //this.props.arrangementData.push({});
                            //console.log(this.props.arrangementData);
                        } else {

                        }
                    },
                    /**
                     * RENDER Poster Card
                     * returns {XML}
                     */
                    render: function () {
                        return (

                            React.createElement("div", {className: "load-more"}, 
                                React.createElement("div", {className: "spinner left", style: {display: "none"}}, "LOADING"
                                ), 

                                React.createElement("div", {id: "adPortal", className: "ad-portal"}), 
                                React.createElement("a", {className: "load-btn btn btn-small btn-pill right", 
                                   style: {fontSize: '12px', margin: '18px 10px'}, onClick: this.LoadCards}, "LOAD" + ' ' +
                                    "MORE"), 

                                React.createElement("div", {className: "cf"})
                            )

                        );

                    }

                });

                // PosterCard Main Component (Ad Unit)
                Publicity.PosterCardComponent = Publicity.PosterCard = React.createClass({displayName: "PosterCard",
                    render: function () {
                        return (
                            React.createElement("div", {ref: "myPosterCard", 
                                 className: (this.props.dataOrientation || this.state.orientation) != '' ? 'card-zone ' + this.props.dataOrientation : 'card-zone'}, 

                                React.createElement("div", {
                                    className: ((this.props.dataOrientation || this.state.orientation) != '' ? 'card ' + this.props.dataOrientation : 'card') + ' ' + (this.props.dataSize != '' ? this.props.dataSize : 'normal'), 
                                    "data-key": this.props.key, 
                                    "data-branding": this.props.dataBranding == true ? true : this.state.branding, 
                                    "data-count": this.state.internal_count, 
                                    "data-offset": this.props.dataOffset || this.state.internal_offset, 
                                    "data-autofill": this.props.dataAutofill || this.state.autofill, 
                                    "data-sp-count": this.state.sponsored_count, 
                                    "data-sp-offset": this.state.sponsored_offset}, 
                                    React.createElement("span", {className: "card-icon restore-card"}, 
                                        React.createElement("i", {className: "oi", "data-glyph": "arrow-circle-top"})
                                    ), 

                                    React.createElement("span", {className: "card-icon snooze-card"}, 
                                        React.createElement("i", {className: "oi", "data-glyph": "timer"})
                                    ), 

                                    React.createElement(Publicity.PosterCard.Close, null), 

                                    React.createElement(Publicity.PosterCard.Loader, null), 

                                    React.createElement(Publicity.PosterCard.Dismissal, {cardComponent:  this }), 

                                    /*<Publicity.PosterCard.Action data={this.state.data}/>*/ 
                                    React.createElement(Publicity.PosterCard.Action, {data: this.props.data, 
                                                                 creative: this.props.dataCreative})



                                ), 
                                this.props.dataBranding ?React.createElement(Publicity.PosterCard.Brand, {data: this.props.data}) : ''
                            )

                        );
                    },
                    getInitialState: function () {

                        var initial_state = {
                            data: {
                                headline: 'Headline',
                                url: '#',
                                image: 'http://placehold.it/320x240'
                            },
                            internal_count: 1,
                            internal_offset: 0,
                            sponsored_count: 1,
                            sponsored_offset: 0,
                            orientation: 'left',
                            size: 'normal',
                            branding: false,
                            autofill: false
                        };
                        return initial_state;
                    },
                    componentWillReceiveProps: function () {

                    },
                    componentWillMount: function () {

                    },
                    componentDidMount: function () {
                        //this.refreshCard(this);
                        // Enable Auto-poll if requested, above 15 seconds only
                        if (true === this.props.autoPoll && this.props.pollInterval >= 15000) {
                            setInterval(this.refreshCard, this.props.pollInterval);
                        }
                        //setInterval(this.refreshCard, this.props.pollInterval);
                        //alert("Mounted!");
                        Publicity.activateLoader($(this.getDOMNode()));
                        var __component = this;
                        if (__component.isMounted()) {
                            if (true === this.props.dataAutofill || this.props.dataAutofill == 'true') {
                                //console.log("AutoFilling TRUE !!!! ", this);
                                this.refreshCard(this);

                            }
                            else {
                                if (!$(__component.getDOMNode()).find('.loader').hasClass('deactivated')) {
                                    Publicity.deactivateLoader($(__component.getDOMNode()));
                                }
                            }

                            Publicity.configureCards($(__component.getDOMNode()));
                        }

                    },
                    componentWillUpdate: function () {
                    },
                    componentDidUpdate: function () {
                        //console.log("Detected Update!", this.props.children);
                        //$(this.getDOMNode()).height($(this).find('.image').height());
                        Publicity.deactivateLoader($(this.getDOMNode()));
                        //Publicity.configureCards($(this.getDOMNode()));
                        //console.log("Updated!", $(this.getDOMNode()));
                    },
                    refreshCard: function (component) {
                        if (!component) {
                            component = this;
                        }
                        // NOTE: The PosterCard Component is injected here as last argument...
                        // $(this.getDOMNode()).attr('data-offset'), $(this.getDOMNode()).attr('data-count'), $(this.getDOMNode()).attr('data-sp-offset') , $(this.getDOMNode()).attr('data-sp-count')
                        Publicity.fetchCard($(this.getDOMNode()), null, null, null, null, component);
                    }
                });

                // Preloader Sub-component
                Publicity.PosterCard.Loader = React.createClass({displayName: "Loader",
                    render: function () {
                        return (
                            React.createElement("div", {className: "loader"}, 
                                React.createElement("div", {className: "loading"}, 
                                    React.createElement("h2", null, "think bigger ..."), 
                                    React.createElement("span", null), 
                                    React.createElement("span", null), 
                                    React.createElement("span", null), 
                                    React.createElement("span", null), 
                                    React.createElement("span", null), 
                                    React.createElement("span", null), 
                                    React.createElement("span", null)
                                )
                            )
                        );
                    }
                });

                // Dismissal Sub-component
                Publicity.PosterCard.Dismissal = React.createClass({displayName: "Dismissal",
                    getInitialState: function () {
                        return {
                            dismissal_title: 'Select a Reason',
                            dismissed: false,
                            buttons: {
                                remove: {
                                    "label": "REMOVE"
                                },
                                cancel: {
                                    "label": "CANCEL"
                                }
                            }
                        }
                    },
                    dismissCard: function (event) {
                        //console.log("Dismiss request RECEIVED!", $(this.getDOMNode()).closest('.card'));
                        this.setState({dismissed: true});
                        Publicity.fetchCard($(this.getDOMNode()).closest('.card'), null, null, null, null, this.props.cardComponent);
                    },
                    render: function () {
                        return (
                            React.createElement("div", {className: "dismissal off"}, 
                                React.createElement("strong", {className: "dismissal-title"},  this.state.dismissal_title), 
                                React.createElement("ul", null, 
                                    React.createElement("li", {className: "selected"}, "This ad is misleading"), 
                                    React.createElement("li", null, "I am unable to view it"), 
                                    React.createElement("li", null, "Another reason here"), 
                                    React.createElement("li", null, "TV killed the Radio")
                                ), 
                                React.createElement("a", {className: "btn btn-small btn-danger btn-primary remove-ad", 
                                   onClick:  this.dismissCard},  this.state.buttons.remove.label), 
                                React.createElement("a", {className: "btn btn-small btn-success btn-secondary close-dismissal"},  this.state.buttons.cancel.label)
                            )
                        );
                    }
                });

                // Action Sub-component (CTA)
                Publicity.PosterCard.Action = React.createClass({displayName: "Action",
                    render: function () {
                        return (
                            React.createElement("a", {href:  this.props.data.url != undefined ? this.props.data.url : this.state.data.url, 
                               className: "cta"}, 

                                React.createElement("div", {className: "image"}, 
                                    React.createElement("img", {className: "image", 
                                         src:  this.props.creative !="" && this.props.creative != undefined ? this.props.creative : (this.props.data.image != undefined ? this.props.data.image : this.state.data.image) })
                                ), 
                                React.createElement("div", {className: "headline"}, 
                                     this.props.data.headline != undefined ? this.props.data.headline : this.state.data.headline), 

                                React.createElement("div", {className: "overlay"})

                            )
                        );
                    }
                });


                // Close Trigger Sub-component (Calls Dismissal)
                Publicity.PosterCard.Close = React.createClass({displayName: "Close",
                    render: function () {
                        return (
                            React.createElement("span", {className: "card-icon close-card"}, "×")
                        );
                    }
                });

                // Brand Name Sub-component
                Publicity.PosterCard.Brand = React.createClass({displayName: "Brand",
                    render: function () {

                        return (
                            React.createElement("div", {className: "card-branding"}, 
                                React.createElement("span", {className: "brand-name"},  this.props.data.brand), 
                                React.createElement("div", {clasName: "cf"})
                            )
                        );
                    }
                });
            },
            /**
             * Build a Poster Card (REACT)
             * @param {String} cardNode to attach rendered card to
             */
            buildCard: function (cardNode) {
                if (cardNode != '') {
                    Publicity.renderCard(cardNode);
                }

            },
            /**
             * Render Card
             *
             * @param cardNode DOM Element to attach component after render
             */
            renderCard: function (cardNode) {
                var empty_object = Publicity.emptyCard;
                //console.log("AutoFill Default: " , $(cardNode).attr('data-autofill') || false);
                React.render(
                    React.createElement(Publicity.PosterCard, {pollInterval:  parseInt($(cardNode).attr('data-poll')) || 15000, 
                                          autoPoll:  $(cardNode).attr('data-poll') != undefined && !isNaN($(cardNode).attr('data-poll')) ? true : false, 
                                          dataAutofill:  $(cardNode).attr('data-autofill') ||  'false', 
                                          dataBranding:  $(cardNode).attr('data-branding') != '' ? true :  false, 
                                          dataOrientation:  $(cardNode).attr('data-orientation') || 'left', 
                                          data:  empty_object, 
                                          dataCreative:  $(cardNode).attr('data-creative') != '' ?  $(cardNode).attr('data-creative') : false, 
                                          dataSize:  $(cardNode).attr('data-size') || 'normal'}),
                    cardNode
                );
            },
            /**
             * Build an Arragement of Poster Cards (REACT)
             * @param gridNode to attach when rendering to the DOM
             */
            buildArrangement: function (gridNode) {

                if (gridNode != '') {

                    // Determine Matrix
                    var rows = parseInt($(gridNode).data('rows'));
                    var cols = parseInt($(gridNode).data('cols'));
                    var load_more = $(gridNode).data('load-more') == 'true' || $(gridNode).data('load-more') == true ? true : false;
                    var poster_count = rows * cols;

                    Publicity.retrieveAds(poster_count, 0, cols, load_more, gridNode, Publicity.renderArrangement);

                    // Default Render
                    /*React.render(
                     <Publicity.PosterArrangement data={ ads } loadMore={load_more} loadCount={cols} />,
                     gridNode
                     );*/


                    // Render Arrangement
                    /*var __render = function(ads){
                     console.log("Running render with stack...", ads);
                     React.render(
                     <Publicity.PosterArrangement data={ ads } loadMore={load_more} loadCount={cols} />,
                     gridNode
                     );
                     };*/

                }

            },
            /**
             * Render Arrangement
             *
             * @param {Object} ads the stack of ad objects from api (JSON)
             * @param {Bool} load_more flag to see if more ads were requested
             * @param {String} cols number of columns
             * @param gridNode DOM Element to attach component after render
             */
            renderArrangement: function (ads, load_more, cols, offset, gridNode) {
                //console.log("Running render with stack...", ads);
                //console.log("NODE: ", gridNode);
                //console.log("offset!", offset);
                var option_branding = $(gridNode).attr('data-branding') != "" &&  $(gridNode).attr('data-branding') != "false" ? true : false;
                React.render(

                    React.createElement(Publicity.PosterArrangement, {data:  ads, loadMore: load_more, 
                                                 loadCount:  (ads.length / cols) * cols, 
                                                 loadOffset:  offset, branding:  true === option_branding ? true : false}),
                    gridNode
                );


            }


        };


        // Initialize Publicity JS
        return Publicity.init();

    };

    return {
        getInstance: __getInstance
    };

}(jQuery, window, document, React));

// Boot Publicity
Publicity = PublicityJS.getInstance();