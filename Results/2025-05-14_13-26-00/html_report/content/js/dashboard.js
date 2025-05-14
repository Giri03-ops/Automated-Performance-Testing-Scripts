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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8392857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Confirmation JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Reserve logging JSR223 Sampler"], "isController": false}, {"data": [0.78, 500, 1500, "Travel the world_4-225"], "isController": false}, {"data": [0.995, 500, 1500, "Get To and From Port JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Get Confirmation Page Data JSR223 Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Travel the world_2-182"], "isController": false}, {"data": [1.0, 500, 1500, "Get Purchase Page Data JSR223 Sampler"], "isController": false}, {"data": [0.815, 500, 1500, "Travel the world_5"], "isController": true}, {"data": [0.775, 500, 1500, "Travel the world_4"], "isController": true}, {"data": [0.815, 500, 1500, "Travel the world_5-227"], "isController": false}, {"data": [0.785, 500, 1500, "Travel the world_3"], "isController": true}, {"data": [0.5, 500, 1500, "Travel the world_2"], "isController": true}, {"data": [0.785, 500, 1500, "Travel the world_3-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 226.35199999999995, 0, 1547, 2.0, 625.9, 710.8499999999998, 926.9000000000001, 3.2599943276098697, 3.0578619449452153, 0.8510718199162833], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Confirmation JSR223 Sampler", 100, 0, 0.0, 1.8, 0, 45, 1.0, 2.0, 2.0, 44.579999999999785, 0.33923488962992865, 0.0, 0.0], "isController": false}, {"data": ["Reserve logging JSR223 Sampler", 100, 0, 0.0, 1.7299999999999998, 0, 49, 1.0, 2.0, 2.0, 48.539999999999765, 0.339139399858918, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_4-225", 100, 0, 0.0, 523.6100000000004, 400, 1547, 483.5, 625.3000000000001, 728.3999999999999, 1541.6199999999972, 0.3387143757155341, 0.78649213420541, 0.27315462057215634], "isController": false}, {"data": ["Get To and From Port JSR223 Sampler", 100, 0, 0.0, 12.819999999999988, 1, 1112, 2.0, 2.9000000000000057, 3.0, 1100.9199999999944, 0.3367343502710711, 0.0, 0.0], "isController": false}, {"data": ["Purchase JSR223 Sampler", 100, 0, 0.0, 1.4100000000000001, 0, 25, 1.0, 2.0, 2.0, 24.779999999999887, 0.33920382079183736, 0.0, 0.0], "isController": false}, {"data": ["Get Confirmation Page Data JSR223 Sampler", 100, 0, 0.0, 3.79, 0, 210, 2.0, 2.0, 3.9499999999999886, 207.97999999999897, 0.3380342631529132, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_2-182", 100, 0, 0.0, 704.0600000000003, 563, 1328, 669.0, 856.3000000000002, 926.4999999999999, 1327.3199999999997, 0.3376963704394105, 0.7792805442145857, 0.21146916072321054], "isController": false}, {"data": ["Get Purchase Page Data JSR223 Sampler", 100, 0, 0.0, 1.4700000000000002, 0, 26, 1.0, 2.0, 2.0, 25.849999999999923, 0.3380045563014189, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_5", 100, 0, 0.0, 501.71999999999997, 389, 935, 486.5, 613.7, 695.1499999999994, 934.0299999999995, 0.3387717491462952, 0.7575055410354219, 0.16938587457314758], "isController": true}, {"data": ["Travel the world_4", 100, 0, 0.0, 525.41, 402, 1548, 489.0, 627.3000000000001, 729.4499999999998, 1542.6199999999972, 0.3386730788769601, 0.7863962432688726, 0.27312131693026725], "isController": true}, {"data": ["Travel the world_5-227", 100, 0, 0.0, 501.71999999999997, 389, 935, 486.5, 613.7, 695.1499999999994, 934.0299999999995, 0.3387717491462952, 0.7575055410354219, 0.16938587457314758], "isController": false}, {"data": ["Travel the world_3", 100, 0, 0.0, 512.5199999999999, 399, 855, 489.5, 615.0, 676.4999999999997, 854.8799999999999, 0.338651287382869, 0.8514698735814744, 0.2296049114172895], "isController": true}, {"data": ["Travel the world_2", 100, 0, 0.0, 705.7900000000001, 565, 1330, 670.5, 857.3000000000002, 927.4999999999999, 1329.79, 0.337490086228717, 0.7788045151954911, 0.21133998329424072], "isController": true}, {"data": ["Travel the world_3-188", 100, 0, 0.0, 511.1100000000002, 398, 854, 488.5, 614.9, 675.4999999999997, 853.8799999999999, 0.3385916618417355, 0.8513199572697322, 0.22956448541685712], "isController": false}]}, function(index, item){
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
