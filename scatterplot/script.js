// Doping in Professional Bicycle Racing - Scatterplot Graph
// 35 Fastest times up Alpe d'Huez

// Dataset: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json
// Data format:
/* {
  "Time": "36:50",
  "Place": 1,
  "Seconds": 2210,
  "Name": "Marco Pantani",
  "Year": 1995,
  "Nationality": "ITA",
  "Doping": "Alleged drug use during 1995 due to high hematocrit levels",
  "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
} */

// User Stories:
// User Story #1: I can see a title element that has a corresponding id="title".

// User Story #2: I can see an x-axis that has a corresponding id="x-axis".

// User Story #3: I can see a y-axis that has a corresponding id="y-axis".

// User Story #4: I can see dots, that each have a class of dot, which represent the data being plotted.

// User Story #5: Each dot should have the properties data-xvalue and data-yvalue containing their corresponding x and y values.

// User Story #6: The data-xvalue and data-yvalue of each dot should be within the range of the actual data and in the correct data format. For data-xvalue, integers (full years) or Date objects are acceptable for test evaluation. For data-yvalue (minutes), use Date objects.

// User Story #7: The data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis.

// User Story #8: The data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis.

// User Story #9: I can see multiple tick labels on the y-axis with %M:%S time format.

// User Story #10: I can see multiple tick labels on the x-axis that show the year.

// User Story #11: I can see that the range of the x-axis labels are within the range of the actual x-axis data.

// User Story #12: I can see that the range of the y-axis labels are within the range of the actual y-axis data.

// User Story #13: I can see a legend containing descriptive text that has id="legend".

// User Story #14: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

// User Story #15: My tooltip should have a data-year property that corresponds to the data-xvalue of the active area.


//### FETCH THE DATA ###
d3.json( 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json' )
  .then( dataset => {
    //ignore console.log( 'Data fetched: ', dataset );
    createVisualization( dataset );
  } )
  .catch( error => {
    console.log( 'Error fetching data: ', error );
  } );

console.log( dataset.length );


//### CREATE THE VISUALIZATION ###
function createVisualization ( dataset ) {
  //ignore console.log( 'Data: ', dataset );

  //_____ VARIABLES _____
  //>>> DOM and layout:
  const margin = { top: 50, right: 20, bottom: 40, left: 70 };
  const container = d3.select( '#container' );
  const containerWidth = container.node().getBoundingClientRect().width;
  const width = Math.min( 800, containerWidth - margin.left - margin.right );
  const height = 400 - margin.top - margin.bottom;
  //>>> Styling:
  const circleRadius = 5;
  const dopingColor = '#e78bc6';
  const noDopingColor = '#caf4d9';
  const offWhite = '#f4f4f4';


  //_____ STRUCTURE THE DATA _____
  const data = dataset.map( d => {
    const name = d[ 'Name' ];
    const nationality = d[ 'Nationality' ];
    const year = d[ 'Year' ];
    const dopingString = d[ 'Doping' ]; //--- To display tooltip
    const hasDoping = dopingString !== '';

    //>>> Parse the time 'MM:SS' into a Date object:
    const splitTime = d[ 'Time' ].split( ':' );
    const raceTime = new Date( Date.UTC( 1970, 0, 1, 0, parseInt( splitTime[ 0 ], 10 ), parseInt( splitTime[ 1 ], 10 ) ) );

    return {
      name,
      nationality,
      year,
      dopingString,
      hasDoping,
      raceTime
    };
  } );


  //_____ SET THE SCALES _____
  //>>> X-axis: Years
  //--- Get the extent of the years:
  const yearExtent = d3.extent( data, d => d.year );
  //--- Use ScaleLinear for years as they discrete values not continuous time values:
  const xScale = d3.scaleLinear()
    .domain( [ yearExtent[ 0 ] - 1, yearExtent[ 1 ] + 1 ] )
    .range( [ 0, width ] );

  //>>> Y-axis: Time
  //--- Get the min race time:
  const minRaceTime = d3.min( data, d => d.raceTime );
  //--- Get the max race time:
  const maxRaceTime = d3.max( data, d => d.raceTime );
  //--- Add a buffer (10 seconds):
  const bufferTime = 10000;
  //--- Set the domain variables:
  const domainStart = new Date( minRaceTime.getTime() - bufferTime );
  const domainEnd = new Date( maxRaceTime.getTime() + bufferTime );
  //--- Use ScaleTime for raceTime as it is a continuous time value:
  const yScale = d3.scaleTime()
    .domain( [ domainStart, domainEnd ] )
    .range( [ 0, height ] );


  //_____ SET AXES TICKS _____
  const xAxis = d3.axisBottom( xScale )
    .tickFormat( d3.format( 'd' ) );

  const yAxis = d3.axisLeft( yScale )
    .ticks( d3.timeSecond.every( 15 ) )
    .tickFormat( d3.timeFormat( '%M:%S' ) );


  //_____ SVG _____
  const svg = container
    .append( 'svg' )
    //>>> Remove the static 'width' and 'height' attributes, and instead, use 'viewBox' and 'preserveAspectRatio' for responsiveness
    // .attr( 'width', width + margin.left + margin.right )
    // .attr( 'height', height + margin.top + margin.bottom )
    .attr( 'viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}` )
    .attr( 'preserveAspectRatio', 'xMidYMid meet' )
    .append( 'g' )
    .attr( 'transform', `translate( ${margin.left}, ${margin.top} )` );


  //_____ ADD THE DOTS _____
  const dots = svg.selectAll( 'circle' )
    .data( data )
    .enter()
    .append( 'circle' )
    .attr( 'class', 'dot' )
    .attr( 'cx', d => xScale( d.year ) )
    .attr( 'cy', d => yScale( d.raceTime ) )
    .attr( 'r', circleRadius )
    .attr( 'data-xvalue', d => d.year )
    .attr( 'data-yvalue', d => d.raceTime )
    .attr( 'fill', d => d.hasDoping ? dopingColor : noDopingColor )
    .attr( 'stroke', offWhite )
    .attr( 'stroke-width', '0.5px' );


  //_____ ADD AXES _____
  //>>> X-axis:
  svg.append( 'g' )
    .attr( 'id', 'x-axis' )
    .attr( 'transform', `translate( 0, ${height} )` )
    .call( xAxis );

  //>>> Y-axis:
  svg.append( 'g' )
    .attr( 'id', 'y-axis' )
    .call( yAxis );


  //_____ AXES LABELS _____
  //>>> X-axis label:
  /* svg.append( 'text' )
    .attr( 'x', width / 2 )
    .attr( 'y', height + margin.bottom )
    .style( 'text-anchor', 'middle' )
    .text( 'Year' ); */

  //>>> Y-axis label:
  svg.append( 'text' )
    .attr( "x", 0 - height / 2 )
    .attr( "y", 0 - margin.left + 10 )
    .attr( "dy", "1em" )
    .attr( 'transform', 'rotate( -90 )' )
    .style( 'text-anchor', 'middle' )
    .style( 'fill', offWhite )
    .style( 'font-size', '12px' )
    .text( 'Time (Minutes) ' );


  //_____ TOOLTIP _____
  //::::: Define the div for the tooltip
  const tooltip = d3.select( '#container' )
    .append( 'div' )
    .attr( 'id', 'tooltip' )
    .style( 'opacity', 0 );

  //::::: Bind the tooltip to the bar hover events
  svg.selectAll( 'circle' )

    //>>> Show the tooltip on mouseover:
    .on( 'mouseover', ( event, d ) => {
      //>>> Custom tooltip styles based on Doping status
      const tooltipColor = d.hasDoping ? dopingColor : noDopingColor;
      tooltip
        .style( 'background-color', tooltipColor )
        .style( 'box-shadow', `1px 1px 5px ${tooltipColor}` );

      //>>> Show the tooltip
      tooltip.transition()
        .duration( 200 )
        .style( 'opacity', 0.9 );

      //>>> Set the tooltip content
      tooltip.html( `<p>
      ${d.name} <span>(${d.nationality})</span> <br/>
      Year: ${d.year} <br/>
      Time: ${d.raceTime.getMinutes()}:${d.raceTime.getSeconds()}
      </br></br>
      ${d.dopingString === '' ? 'No doping allegations' : d.dopingString}
      </p>`  )
        //--- Position the tooltip relative to the mouse pointer
        .style( 'left', `${event.pageX - 100}px` )
        .style( 'top', `${event.pageY - 110}px` )
        .attr( 'data-year', d.year );
    } )

    //>>> Hide the tooltip on mouseout:
    .on( 'mouseout', () => {
      tooltip.transition()
        .duration( 500 )
        .style( "opacity", 0 );
    } );


  //_____ TITLE _____
  svg.append( 'text' )
    .attr( 'id', 'title' )
    .attr( 'x', width / 2 - 30 )
    .attr( 'y', 0 - 15 )
    .attr( 'text-anchor', 'middle' )
    .style( 'font-size', '24px' )
    .style( 'fill', offWhite )
    .style( 'font-weight', 'bold' )
    .text( 'Doping in Professional Bicycle Racing' );

  //_____ SUBTITLE _____
  svg.append( 'text' )
    .attr( 'id', 'subtitle' )
    .attr( 'x', width / 2 - 30 )
    .attr( 'y', 0 + 10 )
    .attr( 'text-anchor', 'middle' )
    .style( 'font-size', '18px' )
    .style( 'fill', offWhite )
    .text( '35 Fastest times up Alpe d\'Huez' );


  //_____ LEGEND _____
  //>>> Calculate position
  const legendX = width - margin.right; //--- Position on the right side
  const legendY = height / 2 - 20; //--- Position at the bottom then add padding to bring it up

  //>>> Legend group
  const legend = svg.append( 'g' )
    .attr( 'id', 'legend' )
    .attr( 'transform', `translate(${legendX}, ${legendY})` );

  //>>> Legend data
  const legendData = [
    { label: 'No doping allegations', color: noDopingColor },
    { label: 'Riders with doping allegations', color: dopingColor }
  ];

  //>>> Legend items
  const legendItems = legend.selectAll( 'g' )
    .data( legendData )
    .enter()
    .append( 'g' )
    .attr( 'transform', ( d, i ) => `translate( 0, ${i * 20} )` );

  //>>> Legend rectangles
  legendItems.append( 'rect' )
    .attr( 'width', 12 )
    .attr( 'height', 12 )
    .attr( 'fill', d => d.color );

  //>>> Legend text
  legendItems.append( 'text' )
    .attr( 'x', -10 ) //--- Start the text at the right or add offset
    .attr( 'y', 12 / 2 + 3 ) //--- Vertically align text
    .attr( 'text-anchor', 'end' )
    .style( 'fill', offWhite )
    .style( 'font-size', '10px' )
    .text( d => d.label );

}