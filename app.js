
function getPlot(id) {
  
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var wf = data.metadata.map(d => d.wf)
        
        
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
  

        var svalues = samples.sample_values.slice(0, 10).reverse();
  
       
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        

        var OTU_id = OTU_top.map(d => "OTU " + d)
 
        var labels = samples.otu_labels.slice(0, 10);
  

        var trace = {
            x: svalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'black'},
            type:"bar",
            orientation: "h",
        };

        var data = [trace];

        var layout = {
            title: "10 top OTU's in This Subject",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 50
            }
        };
  
        Plotly.newPlot("bar", data, layout);
  
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
  
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  //
        var data1 = [trace1];
  
        Plotly.newPlot("bubble", data1, layout_b); 
  
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wf),
          title: { text: `Washings Per Week` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "green" },
                    { range: [2, 4], color: "blue" },
                    { range: [4, 6], color: "purple" },
                    { range: [6, 8], color: "red" },
                    { range: [8, 9], color: "black" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 800, 
            height: 800, 
            margin: { t: 40, b: 40, l:90, r:90 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  

function getInfo(id) {

    d3.json("Data/samples.json").then((data)=> {
        

        var metadata = data.metadata;

        console.log(metadata)

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

function init() {
    var dropdown = d3.select("#selDataset");

    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();