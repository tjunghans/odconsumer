(function($) {
    "use strict";
    /**
     * Default module implementation.
     *
     * @author Thomas Junghans
     * @namespace Tc.Module
     * @class DataVisual
     * @extends Tc.Module
     */
    Tc.Module.DataVisual = Tc.Module.extend({

        /**
         * Initializes the Default module.
         *
         * @method init
         * @constructor
         * @param {jQuery} $ctx the jquery context
         * @param {Sandbox} sandbox the sandbox to get the resources from
         * @param {String} modId the unique module id
         */
        init: function($ctx, sandbox, modId) {
            // call base constructor
            this._super($ctx, sandbox, modId);
        },

        /**
         * Hook function to do all of your module stuff.
         *
         * @method on
         * @param {Function} callback function
         * @return void
         */
        on: function(callback) {
            var mod = this;

            // Show loading message for meta data
            mod.$ctx.find('div.source-meta').html('Loading&hellip;');

            // Load META data
            $.getJSON(
                mod.$ctx.data('sourcemeta') + '?callback=?',
                function (data) {
                    var html = _.template($('.tmpl-sourceMeta', mod.$ctx).html(), {sourceMeta : data});
                    
                    mod.$ctx.find('div.source-meta').html(html);
                }
            );

			// Load ACTUAL data
            $.ajax({
                url : mod.$ctx.data('source') + '?callback=?',
				contentType: "application/json; charset=utf-8",
				dataType: 'json',

                success : function (data) {

                    
                    var html = _.template($('.tmpl-datatable', mod.$ctx).html(), {data : data});
                    
                    mod.$ctx.find('section.originalData').html(html);
                                                

                    // Year 2011
                    var year2011 = OGD.utils.getRowsByColumnValue(data, 0, '2011');                    
                    var totalYear2011 = OGD.utils.getSumOfColumnValues(year2011, 3);                    

                    // Year 2010
                    var year2010 = OGD.utils.getRowsByColumnValue(data, 0, '2010');                    
                    var totalYear2010 = OGD.utils.getSumOfColumnValues(year2010, 3);                    

                    // Year 2009
                    var year2009 = OGD.utils.getRowsByColumnValue(data, 0, '2009');                    
                    var totalYear2009 = OGD.utils.getSumOfColumnValues(year2009, 3);

                    var totals = [totalYear2009, totalYear2010, totalYear2011];
             
              



                    // Select Sum(Anzahl) Group By Jahr, Kanton
                    var yearCanton = OGD.utils.getSumOfColumnWithGroupBy(data, 3, []);



                    var data2009 = _.where(yearCanton, { 'year' : '2009'});
                    var data2011 = _.where(yearCanton, { 'year' : '2010'});
                    var data2012 = _.where(yearCanton, { 'year' : '2011'});
                    var years = _.map(_.uniq(_.pluck(yearCanton, 'year')), function (num) { return num * 1; }).sort();
                    var cantons = _.uniq(_.pluck(yearCanton, 'canton'), false).sort();
                          
                    var byYear = _.groupBy(yearCanton, function (element, index, list) {
                        return element.year;
                    });                    

                    var byCanton = _.groupBy(yearCanton, function (element, index, list) {
                        return element.canton;
                    });                                   

                    var html_byYearAndCanton = _.template($('.tmpl-byYearAndCanton', mod.$ctx).html(), {
                        years : years,
                        cantons : cantons,
                        byCanton : byCanton
                    });
                    
//                    mod.$ctx.find('.bd').prepend(html_byYearAndCanton);

                    var cantonSorter = function (a, b) {
                        return ((a.canton < b.canton) ? -1 : ((a.canton > b.canton) ? 1 : 0));
                    };
 
					var byYear2009Sorted = byYear[2009].sort(cantonSorter);
					var year2009CantonTotal = _.zip(_.pluck(byYear2009Sorted, ['canton']), _.pluck(byYear2009Sorted, ['total']));

					// 1. Chart - Diebstähle schweizweit pro Jahr
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $('.cantonPerYear', mod.$ctx)[0],
                            type: 'bar'
                        },
                        title: {
                            text: $('.cantonPerYear', mod.$ctx).data('title')
                        },
                        subtitle: {
                            text: 'Quelle: Bundesamt für Statistik Schweiz'
                        },
                        xAxis: {
                            categories: cantons,
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Diebstähle',
                                align: 'high'
                            },
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        tooltip: {
                            formatter: function() {
                                return ''+
                                    this.series.name +': '+ this.y;
                            }
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            x: -100,
                            y: 100,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor: '#FFFFFF',
                            shadow: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: 'Year 2009',
                            data: _.pluck(byYear2009Sorted, 'total')
                        }, {
                            name: 'Year 2010',
                            data: _.pluck(byYear[2010].sort(cantonSorter), 'total')
                        }, {
                            name: 'Year 2011',
                            data: _.pluck(byYear[2011].sort(cantonSorter), 'total')
                        }]
                    });



                    // 2. Chart - Diebstähle im Kanton pro Jahr
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $('.total', mod.$ctx)[0],
                            type: 'line'
                        },
                        title: {
                            text: $('.total', mod.$ctx).data('title')
                        },
                        subtitle: {
                            text: 'Quelle: Bundesamt für Statistik Schweiz'
                        },
                        xAxis: {
                            categories: years
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Anzahl Diebstähle'
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            backgroundColor: '#FFFFFF',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 100,
                            y: 70,
                            floating: true,
                            shadow: true
                        },
                        tooltip: {
                            formatter: function() {
                                return ''+
                                    this.x +': '+ this.y;
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                            series: [{
                            name: 'Diebstähle pro Jahr',
                            data: totals
                
                        }]
                    });

                    // 3. Chart - Diebstähle 2009 pro Kanton
                    var chart = new Highcharts.Chart({
                        chart: {
                            renderTo: $('.perCanton2009', mod.$ctx)[0],
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: $('.perCanton2009', mod.$ctx).data('title')
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                            percentageDecimals: 1
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: 'Browser share',
                            data: year2009CantonTotal
                        }]
                    });
                }
            });



            callback();
        }
    });
})(Tc.$);