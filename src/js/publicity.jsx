/**
 * Publicity.jsx
 * ---
 * Built on React and JSX
 *
 * @filesource  publicity.jsx
 * @author      Julien Chinapen <julien@revcontent.com>
 * @version     1.0.0
 * @category    api-contest
 * @package     publicity
 * @subpackage  javascripts
 * @license     Private, Copyright (c) Julien Chinapen
 * @todo        Compile JSX For Production!!
 * @todo        How to handle user-level component extensions?
 * @todo        Apply Unique IDs to Card Components
 * @todo        Add support for lazy loading cards for arrangement containers...
 * @todo        Implement Duplicate Ad checking ability
 * @todo        Add Network Offline support
 * @todo        Future: Enable Card Action Cloaking (URL Juggle )
 */

(function ($, window, document, React, undefined) {

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

    // Publicity
    var Publicity = {
        ReactCSSTransitionGroup: React.addons.CSSTransitionGroup,
        stack: [],
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
            //Publicity.options = $.extend({}, Publicity.options, PUBLICITY_OPTIONS || {});

            // Build React Components and Subcomponents
            Publicity.createComponents();

            // Build Example Poster Card
            ///// Publicity.buildCard(document.getElementById('example_card'));

            // Build Publicity Cards
            $.each($('.publicity-card'), function (cid, card) {
                //Publicity.buildCard(card);
            });

            // Build Example Arrangement (4x3)
            Publicity.buildArrangement(document.getElementById('example_grid'));

            // Build Example Arrangement (1x2)
            /////Publicity.buildArrangement(document.getElementById('example_grid_1x2'));

            // Apply Bindings + Post processing
            Publicity.configureCards();

            //$('#footer').headroom();
            //$('#nav').headroom({
            //    offset: 800
            //});

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
                                posterComponent.setState({
                                    data: Publicity.stack.shift(),
                                    internal_count: Publicity.internal_count,
                                    internal_offset: Publicity.internal_offset,
                                    sponsored_count: Publicity.sponsored_count,
                                    sponsored_offset: Publicity.sponsored_offset
                                });

                                //Publicity.deactivateLoader($(posterComponent.getDOMNode()));
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
                        console.log("Successs!", ad_response);

                        Publicity.stack.concat(ad_response);
                        console.log(typeof callback, callback);
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
        showDismissal: function (card) {
            card.find('.dismissal').animate({'margin-top': 0}, 700, 'easeOutQuart', function () {
                $(this).addClass('on').removeClass('off');
            });

        },
        hideDismissal: function (card) {
            card.find('.dismissal').animate({'margin-top': '-600px'}, 700, 'easeInQuart', function () {
                $(this).removeClass('on').addClass('off');
            });

        },
        activateLoader: function (card) {

            /*card.find('.loader').animate({'marginTop': 0}, 400, 'easeOutSine', function () {
             //$(this).find('.card-spinner').append(Publicity.createSpinner());
             $(this).addClass('activated').removeClass('deactivated').animate({'padding': '18px'}, 600, 'easeInQuad');
             }); */
            card.find('.overlay').css({'backgroundColor': 'rgba(0,0,0,0.9)'});
            card.find('.loader').transition({
                //perspective: 100 + 'px'
                /*perspective: '100px',
                 rotate3d: '1,1,0,180deg', */
                x: 0,
                y: 0,
                opacity: 1
                /*rotateY: '180deg',*/

            }, 800, 'easeOutQuad', function () {
                card.find('.overlay').animate({'backgroundColor': 'rgba(0,0,0,0.1)'}, 350, 'easeInOutCirc', function () {

                });
                $(this).addClass('activated').removeClass('deactivated')

            });

            return this;
        },
        deactivateLoader: function (card) {

            $(card).find('.loader').transition({
                //perspective: 100 + 'px'
                /*perspective: '100px',
                 rotate3d: '1,1,0,180deg', */
                x: -700,
                y: -700,
                opacity: 0
                /*rotateY: '180deg',*/

            }, 1000, 'easeOutQuad', function () {
                card.find('.overlay').animate({'backgroundColor': 'rgba(0,0,0,0.1)'}, 450, 'easeInOutCirc', function () {

                });
                //$(this).addClass('deactivated').removeClass('activated');

            });
            //card.find('.loader').animate({'marginTop': '-1600px', 'marginLeft': '-1000px'}, 1800, 'easeInExpo', function () {

            //$(this).addClass('deactivated').removeClass('activated').animate({}, 500, 'easeInQuad');
            //$(this).animate({'marginTop':'-600px','marginLeft': '-600px'}, 1500, 'easeOutQuart', function(){


            //});

            //});
            return this;
        },
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
        restoreCard: function (card) {
            card.removeClass('fixed').removeClass('docked').animate({
                'margin-bottom': 0,
                'opacity': 0.5,
                'left': 0,
                'opacity': 1.0
            });
        },
        nextCard: function (card) {
            //Publicity.fetchCard(card);
        },
        configureCards: function () {
            $.each($('.card'), function (cid, card) {


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

            });
        },
        createComponents: function () {

            /**
             *  Poster Arrangement (Ad Grid)
             *  -- an arrangement consists of one or more poster cards
             */
            Publicity.PosterArrangement = React.createClass({
                componentDidUpdate: function () {
                    Publicity.configureCards();
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
                            arrangement.setProps({data: existing_cards.concat(more_cards)});

                        }

                    });

                },
                render: function () {
                    var posterCards = this.props.data.map(function (card, cid) {
                        //console.log("Got Card...", card);
                        return (
                            <Publicity.PosterCard key={ cid } data={ card } dataOrientation="left" dataSize="normal" dataOffset={ cid } />

                        );
                    });
                    return (
                        <div className="card-arrangement" ref="myArrangement"
                             data-load-more={this.props.loadMore == true ? true : false}
                             data-load-count={this.props.loadCount}
                             data-load-offset={this.props.loadOffset}>

                            {posterCards}
                            <div className="cf"></div>
                            {this.props.loadMore ? <Publicity.ArrangementLoader onClick={this.loadMoreCards}/> : ''}
                        </div>
                    );
                }

            });

            /**
             * Load More Trigger (Lazy-load)
             * @type {*}
             */
            Publicity.ArrangementLoader = React.createClass({
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
                render: function () {
                    return (

                        <div className="load-more">
                            <div className="spinner left" style={{display: "none"}}>LOADING
                            </div>

                            <div id="adPortal" className="ad-portal"></div>
                            <a className="load-btn btn btn-small btn-pill right"
                               style={{fontSize: '12px', margin: '18px 10px'}} onClick={this.LoadCards}>LOAD MORE</a>

                            <div className="cf"></div>
                        </div>

                    );

                }

            });

            // PosterCard Main Component (Ad Unit)
            Publicity.PosterCard = React.createClass({
                render: function () {
                    return (
                        <div
                            className={(this.props.dataOrientation || this.state.orientation) != '' ? 'card-zone ' + this.props.dataOrientation : 'card-zone' }>
                            <div
                                className={((this.props.dataOrientation || this.state.orientation) != '' ? 'card ' + this.props.dataOrientation : 'card') + ' ' + (this.props.dataSize != '' ? this.props.dataSize : 'normal') }
                                data-count={this.state.internal_count} data-offset={this.props.dataOffset || this.state.internal_offset}
                                data-sp-count={this.state.sponsored_count} data-sp-offset={this.state.sponsored_offset}>
                                    <span className="card-icon restore-card">
                                        <i className="oi" data-glyph="arrow-circle-top"></i>
                                    </span>

                                    <span className="card-icon snooze-card">
                                        <i className="oi" data-glyph="timer"></i>
                                    </span>

                                <Publicity.PosterCard.Close />

                                <Publicity.PosterCard.Loader />

                                <Publicity.PosterCard.Dismissal />

                                { /*<Publicity.PosterCard.Action data={this.state.data}/>*/ }
                                <Publicity.PosterCard.Action data={this.props.data}/>

                            </div>
                        </div>

                    );
                },
                getInitialState: function () {
                    var initial_state = {
                        data: {},
                        internal_count: 1,
                        internal_offset: 0,
                        sponsored_count: 1,
                        sponsored_offset: 0,
                        orientation: 'left',
                        size: 'normal'
                    };
                    return initial_state;
                },
                componentDidMount: function () {
                    //this.refreshCard(this);
                    //setInterval(this.refreshCard, this.props.pollInterval);
                    Publicity.deactivateLoader($(this.getDOMNode()));
                },
                componentDidUpdate: function () {
                    //$(this.getDOMNode()).height($(this).find('.image').height());
                    Publicity.deactivateLoader($(this.getDOMNode()));
                    //console.log("Updated!", $(this.getDOMNode()));
                },
                refreshCard: function (component) {

                    // NOTE: The PosterCard Component is injected here as last argument...
                    // $(this.getDOMNode()).attr('data-offset'), $(this.getDOMNode()).attr('data-count'), $(this.getDOMNode()).attr('data-sp-offset') , $(this.getDOMNode()).attr('data-sp-count')

                    Publicity.fetchCard($(this.getDOMNode()), null, null, null, null, component);
                }
            });

            // Preloader Sub-component
            Publicity.PosterCard.Loader = React.createClass({
                render: function () {
                    return (
                        <div className="loader">
                            <div className="loading">
                                <h2>think bigger ...</h2>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    );
                }
            });

            // Dismissal Sub-component
            Publicity.PosterCard.Dismissal = React.createClass({
                render: function () {
                    return (
                        <div className="dismissal off">
                            <strong>PLEASE CHOOSE A REASON ...</strong>
                            <ul>
                                <li className="selected">This ad is misleading</li>
                                <li>I am unable to view it</li>
                                <li>Another reason here</li>
                                <li>TV killed the Radio</li>
                            </ul>
                            <a className="btn btn-small btn-danger btn-primary remove-ad">REMOVE</a>
                            <a className="btn btn-small btn-success btn-secondary close-dismissal">CANCEL</a>
                        </div>
                    );
                }
            });

            // Action Sub-component (CTA)
            Publicity.PosterCard.Action = React.createClass({
                render: function () {
                    return (
                        <a href={ this.props.data.url || '#' } className="cta">

                            <div className="image">
                                <img className="image" src={ this.props.data.image || 'http://placehold.it/320x240' }/>
                            </div>
                            <div className="headline">{ this.props.data.headline }</div>
                            <div className="overlay"></div>

                        </a>
                    );
                }
            });


            // Close Trigger Sub-component (Calls Dismissal)
            Publicity.PosterCard.Close = React.createClass({
                render: function () {
                    return (
                        <span className="card-icon close-card">&times;</span>
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
                React.render(
                    <Publicity.PosterCard pollInterval={15000}
                                          dataOrientation={ $(cardNode).data('orientation') || 'left'}
                                          dataSize={$(cardNode).data('size') || 'normal'}/>,
                    cardNode
                );
            }

        },
        /**
         * Build an Arragement of Poster Cards (REACT)
         * @param gridNode
         */
        buildArrangement: function (gridNode) {

            if (gridNode != '') {

                // Determine Matrix
                var rows = parseInt($(gridNode).data('rows'));
                var cols = parseInt($(gridNode).data('cols'));
                var load_more = $(gridNode).data('load-more') == 'true' || $(gridNode).data('load-more') == true ? true : false;
                var poster_count = rows * cols;

                Publicity.retrieveAds(poster_count, 0, cols, load_more, gridNode, Publicity.renderArrangement);

                console.log("Got These ads...", Publicity.getStack());
                /*
                 for (var i = 0; i < poster_count; i++) {
                 // Pushing empty object for now, state properties are setup after AJAX....
                 ads.push({});
                 }
                 */

                //Publicity.foo = ads;

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
            console.log("Running render with stack...", ads);
            console.log("NODE: ", gridNode);
console.log("offset!", offset);
            React.render(
                <Publicity.PosterArrangement data={ ads } loadMore={load_more} loadCount={cols} loadOffset={ offset }/>,
                gridNode
            );


        }


    };

    // Initialize Publicity
    Publicity.init();
    //Publicity.init();

}(jQuery, window, document, React));