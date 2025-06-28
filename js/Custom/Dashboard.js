

function floatchart(ele,data) {  
    // performance chart
    var options_performance = {
        chart: {
            height: 400,
            type: 'donut'
        },
        series: data.series,
        colors: data.colors,
        labels: data.labels,
        //fill: {
        //    opacity: [1, 1, 1, 0.3]
        //},
        legend: {
            show: false
        },
        legend: {
            show: true, 
            position: 'bottom', 
            horizontalAlign: 'center', 
            floating: false,
            fontSize: '14px', 
            formatter: function (seriesName, opts) {
                return seriesName + ": " + opts.w.globals.series[opts.seriesIndex] + ''; 
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true
                        },
                        value: {
                            show: true
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        responsive: [
            {
                breakpoint: 575,
                options: {
                    chart: {
                        height: 250
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '65%',
                                labels: {
                                    show: false
                                }
                            }
                        }
                    }
                }
            },
            {
                breakpoint: 1182,
                options: {
                    chart: {
                        height: 190
                    },
                }
            }
        ]
    };

    var chart_performance = new ApexCharts(ele, options_performance);
    chart_performance.render();

}