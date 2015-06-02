/**
 * Publicity.js
 * ---
 * Built on React and JSX
 *
 * @filesource  publicity.js
 * @author      Julien Chinapen <julien@revcontent.com>
 * @version     1.0.0
 * @category    pi-contest
 * @package     publicity
 * @subpackage  javascripts
 * @license     Private, Copyright (c) Julien Chinapen
 * @todo        Compile JSX For Production!!
 * @todo        How to handle user-level component extensions?
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
        stack: [],
        cardClass: 'publicity-card',
        gridClass: 'publicity-arrangement',
        internal_count: 1,
        internal_offset: 1,
        sponsored_count: 1,
        sponsored_offset: 1,

        init: function () {

            // Build React Components and Subcomponents
            Publicity.createComponents();

            // Build Example Poster Card
            Publicity.buildCard(document.getElementById('example_card'));

            // Build Example Arrangement
            Publicity.buildArrangement(document.getElementById('example_grid'));

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
                cache:false,
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


                    if(typeof posterComponent == 'object'){
                        posterComponent.setState({
                            internal_count: Publicity.internal_count,
                            internal_offset: Publicity.internal_offset,
                            sponsored_count: Publicity.sponsored_count,
                            sponsored_offset: Publicity.sponsored_offset
                        });
                    }

                },
                success: function (ad_response) {
                    console.log(ad_response);
                    //$('#card_response').text(JSON.stringify(ad_response));


                    if (ad_response.length > 0) {

                        //if(ad_response.length == 1) {
                            Publicity.stack.push(ad_response[0]);
                        //}
                        //else {
                        //    Publicity.stack.push(ad_response);
                        //}

                        // Setup Component State/Properties
                        if(typeof posterComponent == 'object'){
                            posterComponent.setState({
                                data: Publicity.stack.shift(),
                                internal_count: Publicity.internal_count,
                                internal_offset: Publicity.internal_offset,
                                sponsored_count: Publicity.sponsored_count,
                                sponsored_offset: Publicity.sponsored_offset
                            });
                        }


                        /*$(card).attr({'data-offset': Publicity.internal_offset});
                        $(card).attr({'data-count': Publicity.internal_count});
                        $(card).attr({'data-sp-offset': Publicity.sponsored_offset});
                        $(card).attr({'data-sp-count': Publicity.sponsored_count});*/
                        //console.log(Publicity);
                    }

                    if(ad_response.length > 0){
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
                    setTimeout(function () {
                        Publicity.deactivateLoader($card);
                    }, 1500);
                },
                error: function (response) {

                }
            });
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
            card.find('.overlay').css({'backgroundColor': 'rgba(0,0,0,0.9)'});
            card.find('.loader').animate({'top': 0, 'padding': '18px'}, 800, 'easeOutExpo', function () {
                //$(this).find('.card-spinner').append(Publicity.createSpinner());
                $(this).addClass('activated').removeClass('deactivated').animate({'padding': '18px'}, 600, 'easeInQuad');
            });

            return this;
        },
        deactivateLoader: function (card) {
            card.find('.overlay').css({'backgroundColor': 'rgba(0,0,0,0.1)'});
            card.find('.loader').animate({'top': '-500px', 'padding': '18px'}, 1600, 'easeOutExpo', function () {
                $(this).addClass('deactivated').removeClass('activated').animate({}, 600, 'easeInQuad');
            });

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
            card.animate({'margin-bottom': 0, 'opacity': 1, 'left': $('.wrapper').offset().left}, 900, 'easeOutExpo', function () {
                $(this).removeClass('docked');
            });
            return this;
        },
        restoreCard: function (card) {
            card.removeClass('fixed').removeClass('docked').animate({'margin-bottom': 0, 'opacity': 0.5, 'left': 0, 'opacity': 1.0});
        },
        nextCard: function (card) {
            //Publicity.fetchCard(card);
        },
        configureCards: function(){
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
        createComponents: function(){

            /**
             *  Poster Arrangement (Ad Grid)
             *  -- an arrangement consists of one or more poster cards
             */
            Publicity.PosterArrangement = React.createClass({
                render: function () {
                    var posterCards = this.props.data.map(function (card, cid) {
                        return (
                            <Publicity.PosterCard key={ cid } />

                            );
                    });
                    return (
                        <div className="card-arrangement">
                            {posterCards}
                        </div>
                        );
                }

            });

            // ------------------------------------

            // PosterCard Main Component (Ad Unit)
            Publicity.PosterCard = React.createClass({
                render: function () {
                    return (
                        <div className="card left" data-count={this.state.internal_count} data-offset={this.state.internal_offset} data-sp-count={this.state.sponsored_count} data-sp-offset={this.state.sponsored_offset} >
                            <span className="card-icon restore-card">
                                <i className="oi" data-glyph="arrow-circle-top"></i>
                            </span>

                            <span className="card-icon snooze-card">
                                <i className="oi" data-glyph="timer"></i>
                            </span>

                            <Publicity.PosterCard.Close />

                            <Publicity.PosterCard.Loader />

                            <Publicity.PosterCard.Dismissal />

                            <Publicity.PosterCard.Action data={this.state.data} />

                        </div>
                        );
                },
                getInitialState: function(){
                    var initial_state = {
                        data: [],
                        internal_count: 1,
                        internal_offset: 0,
                        sponsored_count: 1,
                        sponsored_offset: 0
                    };
                    console.log("INITIAL STATE :", initial_state);

                    return initial_state;
                },
                componentDidMount: function() {
                    this.refreshCard();
                    //setInterval(this.refreshCard, this.props.pollInterval);
                    if (this.isMounted()) {
                        Publicity.deactivateLoader($(this.getDOMNode()));
                    }
                },
                refreshCard: function(){

                    // NOTE: The PosterCard Component is injected here as last argument...
                    // $(this.getDOMNode()).attr('data-offset'), $(this.getDOMNode()).attr('data-count'), $(this.getDOMNode()).attr('data-sp-offset') , $(this.getDOMNode()).attr('data-sp-count')
                    Publicity.fetchCard($(this.getDOMNode()), null, null, null, null, this);
                }
            });

            // Preloader Sub-component
            Publicity.PosterCard.Loader = React.createClass({
                render: function () {
                    return (
                        <div className="loader">
                            <div className="card-spinner"></div>
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
                            <a className="btn btn-small btn-danger btn-primary remove-ad">REMOVE?</a>
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
                                <img className="image" src={ this.props.data.image || 'http://placehold.it/320x240' } />
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
         * Build a Poster Card
         * @param {String} cardNode to attach rendered card to
         */
        buildCard: function (cardNode) {

            React.render(
                <Publicity.PosterCard pollInterval={15000} />,
                cardNode
            );


        },
        /**
         * Build an Arragement of Poster Cards
         * @param gridNode
         */
        buildArrangement: function(gridNode){

            if(gridNode != ''){

                // Determine Matrix
                var rows = parseInt($(gridNode).data('rows'));
                var cols = parseInt($(gridNode).data('cols'));
                var poster_count = rows * cols;
                var ads = [];
                for(var i = 0; i < poster_count; i++){
                    // Pushing empty object for now, state properties are setup after AJAX....
                    ads.push({});
                }

                React.render(
                    <Publicity.PosterArrangement data={ ads } />,
                    gridNode
                );


            }

        }


    };


    Publicity.init();

}(jQuery, window, document, React));