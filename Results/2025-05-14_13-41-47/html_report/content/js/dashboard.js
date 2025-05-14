/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8692857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Confirmation JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Reserve logging JSR223 Sampler"], "isController": false}, {"data": [0.865, 500, 1500, "Travel the world_4-225"], "isController": false}, {"data": [0.995, 500, 1500, "Get To and From Port JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Get Confirmation Page Data JSR223 Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Travel the world_2-182"], "isController": false}, {"data": [1.0, 500, 1500, "Get Purchase Page Data JSR223 Sampler"], "isController": false}, {"data": [0.855, 500, 1500, "Travel the world_5"], "isController": true}, {"data": [0.865, 500, 1500, "Travel the world_4"], "isController": true}, {"data": [0.855, 500, 1500, "Travel the world_5-227"], "isController": false}, {"data": [0.865, 500, 1500, "Travel the world_3"], "isController": true}, {"data": [0.5, 500, 1500, "Travel the world_2"], "isController": true}, {"data": [0.87, 500, 1500, "Travel the world_3-188"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 232.34899999999993, 0, 6220, 2.0, 602.8, 683.9499999999999, 887.8600000000001, 3.2626959656764383, 3.0549858582521736, 0.8519459942250281], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Confirmation JSR223 Sampler", 100, 0, 0.0, 1.7100000000000006, 0, 16, 1.0, 3.0, 3.0, 15.869999999999933, 0.3392728703841926, 0.0, 0.0], "isController": false}, {"data": ["Reserve logging JSR223 Sampler", 100, 0, 0.0, 1.8600000000000003, 0, 44, 1.0, 2.0, 2.0, 43.599999999999795, 0.3391221484066346, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_4-225", 100, 0, 0.0, 489.0899999999999, 400, 1010, 463.0, 595.3000000000002, 695.3499999999999, 1008.019999999999, 0.338757977750376, 0.7837781137362971, 0.2733684251310993], "isController": false}, {"data": ["Get To and From Port JSR223 Sampler", 100, 0, 0.0, 13.649999999999999, 0, 1169, 2.0, 3.0, 4.0, 1157.349999999994, 0.3367354841751159, 0.0, 0.0], "isController": false}, {"data": ["Purchase JSR223 Sampler", 100, 0, 0.0, 1.6600000000000006, 0, 26, 1.0, 2.0, 2.0, 25.789999999999893, 0.3391808105064648, 0.0, 0.0], "isController": false}, {"data": ["Get Confirmation Page Data JSR223 Sampler", 100, 0, 0.0, 4.369999999999999, 0, 240, 2.0, 3.0, 4.0, 237.6599999999988, 0.33809140639263235, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_2-182", 100, 0, 0.0, 670.49, 544, 1482, 627.5, 823.2, 886.0499999999995, 1481.2499999999995, 0.3379885624670461, 0.7838760126982303, 0.2115300097932186], "isController": false}, {"data": ["Get Purchase Page Data JSR223 Sampler", 100, 0, 0.0, 1.5999999999999999, 0, 25, 1.0, 2.0, 3.0, 24.789999999999893, 0.338065118103049, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_5", 100, 0, 0.0, 603.21, 391, 6220, 455.5, 651.2, 805.95, 6218.5599999999995, 0.3387924083397139, 0.7523209662105391, 0.16939620416985696], "isController": true}, {"data": ["Travel the world_4", 100, 0, 0.0, 490.7999999999999, 401, 1011, 466.0, 596.3000000000002, 697.2999999999998, 1009.0299999999991, 0.3387178175733578, 0.783685195872046, 0.2733360169663755], "isController": true}, {"data": ["Travel the world_5-227", 100, 0, 0.0, 603.21, 391, 6220, 455.5, 651.2, 805.95, 6218.5599999999995, 0.3387924083397139, 0.7523209662105391, 0.16939620416985696], "isController": false}, {"data": ["Travel the world_3", 100, 0, 0.0, 537.5099999999999, 400, 5407, 464.0, 639.4000000000003, 803.7999999999988, 5361.699999999977, 0.3386776669172881, 0.8500346403751193, 0.22974186305737876], "isController": true}, {"data": ["Travel the world_2", 100, 0, 0.0, 672.3499999999999, 545, 1484, 629.0, 824.4000000000001, 887.0499999999995, 1483.2499999999995, 0.3377431328377516, 0.7833068029066174, 0.21137640775559555], "isController": true}, {"data": ["Travel the world_3-188", 100, 0, 0.0, 535.8500000000004, 399, 5405, 462.0, 637.5000000000003, 801.7999999999988, 5359.689999999977, 0.33867881394679356, 0.8500375192623576, 0.22974264114439572], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
