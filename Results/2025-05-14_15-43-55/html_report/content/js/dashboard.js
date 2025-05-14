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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9210714285714285, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Confirmation JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Reserve logging JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Travel the world_4-225"], "isController": false}, {"data": [0.99, 500, 1500, "Get To and From Port JSR223 Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "Purchase JSR223 Sampler"], "isController": false}, {"data": [0.99, 500, 1500, "Get Confirmation Page Data JSR223 Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "Travel the world_2-182"], "isController": false}, {"data": [1.0, 500, 1500, "Get Purchase Page Data JSR223 Sampler"], "isController": false}, {"data": [0.995, 500, 1500, "Travel the world_5"], "isController": true}, {"data": [0.995, 500, 1500, "Travel the world_4"], "isController": true}, {"data": [0.995, 500, 1500, "Travel the world_5-227"], "isController": false}, {"data": [0.965, 500, 1500, "Travel the world_3"], "isController": true}, {"data": [0.5, 500, 1500, "Travel the world_2"], "isController": true}, {"data": [0.965, 500, 1500, "Travel the world_3-188"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 196.59000000000015, 0, 2872, 3.0, 553.0, 588.0, 675.9000000000001, 3.262887590259628, 3.0595019926046656, 0.8516742029173479], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Confirmation JSR223 Sampler", 100, 0, 0.0, 2.1300000000000003, 0, 33, 2.0, 3.0, 5.0, 32.73999999999987, 0.3426758183955233, 0.0, 0.0], "isController": false}, {"data": ["Reserve logging JSR223 Sampler", 100, 0, 0.0, 2.860000000000001, 0, 59, 2.0, 3.9000000000000057, 4.0, 59.0, 0.3422500889850231, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_4-225", 100, 0, 0.0, 431.6199999999999, 393, 487, 433.0, 454.8, 468.95, 486.9, 0.342120118373561, 0.7937286976770044, 0.2758677556064934], "isController": false}, {"data": ["Get To and From Port JSR223 Sampler", 100, 0, 0.0, 31.169999999999977, 0, 2872, 2.0, 4.0, 5.0, 2843.3699999999853, 0.33674455568239603, 0.0, 0.0], "isController": false}, {"data": ["Purchase JSR223 Sampler", 100, 0, 0.0, 1.7700000000000005, 0, 18, 1.0, 3.0, 3.0, 17.869999999999933, 0.3425103266863496, 0.0, 0.0], "isController": false}, {"data": ["Get Confirmation Page Data JSR223 Sampler", 100, 0, 0.0, 13.599999999999994, 0, 554, 2.0, 5.0, 6.0, 553.7499999999999, 0.34013952523325064, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_2-182", 100, 0, 0.0, 614.0999999999997, 535, 1390, 587.0, 650.9000000000001, 857.9499999999989, 1390.0, 0.3406272992342698, 0.7870187095930866, 0.21314819778353813], "isController": false}, {"data": ["Get Purchase Page Data JSR223 Sampler", 100, 0, 0.0, 2.639999999999999, 0, 84, 2.0, 3.9000000000000057, 4.0, 83.2099999999996, 0.340041212995015, 0.0, 0.0], "isController": false}, {"data": ["Travel the world_5", 100, 0, 0.0, 424.0099999999998, 382, 573, 422.0, 447.9, 451.95, 572.0599999999995, 0.34221612317042704, 0.7613439832416764, 0.17110806158521352], "isController": true}, {"data": ["Travel the world_4", 100, 0, 0.0, 433.7499999999999, 395, 508, 434.5, 456.0, 470.9, 507.8099999999999, 0.34205809514687974, 0.7935848019740173, 0.27581774332302594], "isController": true}, {"data": ["Travel the world_5-227", 100, 0, 0.0, 424.0099999999998, 382, 573, 422.0, 447.9, 451.95, 572.0599999999995, 0.34221495205568525, 0.7613413778087292, 0.1711074760278426], "isController": false}, {"data": ["Travel the world_3", 100, 0, 0.0, 443.77, 394, 759, 435.5, 468.8, 508.9, 758.0899999999996, 0.34180438535026403, 0.8618243755661135, 0.23177274708184506], "isController": true}, {"data": ["Travel the world_2", 100, 0, 0.0, 616.9600000000004, 536, 1449, 589.0, 654.7, 859.8999999999988, 1449.0, 0.3401013502023603, 0.785803505382104, 0.2128190841495766], "isController": true}, {"data": ["Travel the world_3-188", 100, 0, 0.0, 441.99999999999994, 393, 757, 434.5, 467.70000000000005, 508.84999999999997, 756.0899999999996, 0.3418277529952657, 0.8618832946640688, 0.23178859235331314], "isController": false}]}, function(index, item){
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
