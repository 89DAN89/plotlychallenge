// Using a funtion to create a bar bubble and gague chart
function plotlyPlot(id) {
    // using d3 to get data and logging it
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var numofwash = data.metadata.map(x => x.numofwash)
        console.log(`Washing Freq: ${numofwash}`)

        //filtering data and slicing to get top 10 otu's
        var samples = data.samples.filter(y => y.id.toString() === id)[0];
        
        console.log(samples);
  
        var valuesSampled = samples.sample_values.slice(0, 10).reverse();
  

        var top10OTU = (samples.otu_ids.slice(0, 10)).reverse();
        
        var OTUID = top10OTU.map(x => "OUT " + "#" + x)
  
        var labels = samples.otu_labels.slice(0, 10);
  
      //creating the bar graph trace
        var trace = {
            x: valuesSampled,
            y: OTUID,
            text: labels,
            marker: {
              color: 'black'},
            type:"bar",
            orientation: "h",
        };
  

        var data = [trace];
  
        // setting up the layout of the chart
        var layout = {
            title: "Top 10 OTU found in this subject",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 90,
                r: 90,
                t: 90,
                b: 45
            }
        };
  
        // ploting the bar chart
        Plotly.newPlot("bar", data, layout);
      
        // The bubble chart trace
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };

        var data2 = [trace1];
  
        // making the layout for the bubble chart
        var layout_b = {
            xaxis:{title: "OTU ID#"},
            yaxis:{title:"Amount Found"},
            height: 600,
            width: 1000
        };
  

  
        // ploting the bubble chart
        Plotly.newPlot("bubble", data2, layout_b); 
  
        // creating the bubble chart
  
        var data3 = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(numofwash),
          title: { text: `Washing Frequency for Subject ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "black" },
                    { range: [2, 4], color: "red" },
                    { range: [4, 6], color: "orange" },
                    { range: [6, 8], color: "blue" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        var layout3 = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data3, layout3);
      });
  }  
// Function for getting the data using D3 to read json file
function collectData(id) {

    d3.json("Data/samples.json").then((data)=> {
        
        var metadata = data.metadata;

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        var demographicInfo = d3.select("#sample-metadata");
        
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Function to change the subject
function selectSubject(id) {
    plotlyPlot(id);
    collectData(id);
}

// Funtion to render the data
function init() {

    var dropdown = d3.select("#selDataset");

    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // calling plot and collect data functions
        plotlyPlot(data.names[0]);
        collectData(data.names[0]);
    });
}

init();