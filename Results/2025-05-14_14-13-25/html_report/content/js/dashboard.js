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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9153571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Confirmation JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Reserve logging JSR223 Sampler"], "isController": false}, {"data": [0.99, 500, 1500, "Travel the world_4-225"], "isController": false}, {"data": [0.995, 500, 1500, "Get To and From Port JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Get Confirmation Page Data JSR223 Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Travel the world_2-182"], "isController": false}, {"data": [1.0, 500, 1500, "Get Purchase Page Data JSR223 Sampler"], "isController": false}, {"data": [0.975, 500, 1500, "Travel the world_5"], "isController": true}, {"data": [0.99, 500, 1500, "Travel the world_4"], "isController": true}, {"data": [0.975, 500, 1500, "Travel the world_5-227"], "isController": false}, {"data": [0.945, 500, 1500, "Travel the world_3"], "isController": true}, {"data": [0.5, 500, 1500, "Travel the world_2"], "isController": true}, {"data": [0.945, 500, 1500, "Travel the world_3-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 196.7540000000002, 0, 1200, 2.0, 558.8, 601.9499999999999, 661.99, 3.262898236729793, 3.058011169716389, 0.852479960706548], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Confirmation JSR223 Sampler", 100, 0, 0.0, 1.5300000000000005, 0, 20, 1.0, 2.0, 2.9499999999999886, 19.829999999999913, 0.3392786257858541, 0.0, 0.0], "isController": false}, {"data": ["Reserve logging JSR223 Sampler", 100, 0, 0.0, 1.5899999999999996, 0, 23, 1.0, 2.0, 3.0, 22.829999999999913, 0.33919231525890553, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_4-225", 100, 0, 0.0, 441.90999999999997, 397, 567, 438.5, 469.8, 484.9, 566.97, 0.33877978297767103, 0.7859293957523791, 0.2734124885238348], "isController": false}, {"data": ["Get To and From Port JSR223 Sampler", 100, 0, 0.0, 13.78, 0, 1200, 2.0, 3.0, 3.0, 1188.0499999999938, 0.33672754700716556, 0.0, 0.0], "isController": false}, {"data": ["Purchase JSR223 Sampler", 100, 0, 0.0, 1.4700000000000002, 0, 17, 1.0, 2.0, 2.0, 16.85999999999993, 0.33924179458909337, 0.0, 0.0], "isController": false}, {"data": ["Get Confirmation Page Data JSR223 Sampler", 100, 0, 0.0, 4.200000000000004, 0, 225, 2.0, 3.0, 4.0, 222.81999999999888, 0.3381211285130785, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_2-182", 100, 0, 0.0, 606.5799999999998, 548, 1120, 596.5, 650.9, 704.0499999999997, 1116.4799999999982, 0.3379051905616322, 0.7816862408807838, 0.2115999261677159], "isController": false}, {"data": ["Get Purchase Page Data JSR223 Sampler", 100, 0, 0.0, 1.5399999999999998, 0, 25, 1.0, 2.9000000000000057, 3.0, 24.789999999999893, 0.3380948356013862, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_5", 100, 0, 0.0, 443.49999999999994, 396, 680, 435.0, 471.9, 512.1999999999998, 679.7299999999999, 0.33883258620748075, 0.7571485469588082, 0.1694162931037404], "isController": true}, {"data": ["Travel the world_4", 100, 0, 0.0, 443.44000000000017, 398, 568, 440.0, 471.8, 486.84999999999997, 567.97, 0.33875453507633835, 0.7858708235800257, 0.2733921121853394], "isController": true}, {"data": ["Travel the world_5-227", 100, 0, 0.0, 443.49999999999994, 396, 680, 435.0, 471.9, 512.1999999999998, 679.7299999999999, 0.33883258620748075, 0.7571485469588082, 0.1694162931037404], "isController": false}, {"data": ["Travel the world_3", 100, 0, 0.0, 452.90999999999997, 398, 633, 445.0, 502.9, 507.0, 632.93, 0.3386994618065552, 0.8481973885424746, 0.23010725447676011], "isController": true}, {"data": ["Travel the world_2", 100, 0, 0.0, 608.1700000000002, 550, 1143, 597.5, 652.0, 705.0499999999997, 1139.259999999998, 0.33772944494165724, 0.7812796832519967, 0.2114898723382698], "isController": true}, {"data": ["Travel the world_3-188", 100, 0, 0.0, 451.4399999999999, 397, 632, 443.5, 501.9, 505.95, 631.93, 0.3387120811825116, 0.8482289909597746, 0.23011582788853663], "isController": false}]}, function(index, item){
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
