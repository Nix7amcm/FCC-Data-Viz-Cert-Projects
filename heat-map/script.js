// Monthly Global Land-Surface Temperature
// 1753 - 2015: base temperature 8.66℃

// Dataset: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
// Data Format:
/*{
  "baseTemperature":8.66,
  "monthlyVariance":[
    {
      "year":1753,
      "month":1,
      "variance":-1.366,
      "temperature":7.26
    },
    ...
  ]
}*/

// User Stories:
// User Story #1: My heat map should have a title with a corresponding id="title".

// User Story #2: My heat map should have a description with a corresponding id="description".

// User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".

// User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".

// User Story #5: My heat map should have rect elements with a class="cell" that represent the data.

// User Story #6: There should be at least 4 different fill colors used for the cells.

// User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.

// User Story #8: The data-month, data-year of each cell should be within the range of the data.

// User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.

// User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.

// User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.

// User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.

// User Story #13: My heat map should have a legend with a corresponding id="legend".

// User Story #14: My legend should contain rect elements.

// User Story #15: The rect elements in the legend should use at least 4 different fill colors.

// User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

// User Story #17: My tooltip should have a data-year property that corresponds to the data-year of the active area.



//### FETCH THE DATA ###
d3.json( 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json' )
  .then( dataset => {
    //ignore console.log( 'Data fetched: ', dataset );
    createVisualization( dataset );
  } )
  .catch( error => {
    console.log( 'Error fetching data: ', error );
  } );

// console.log( dataset.length );


//### CREATE THE VISUALIZATION ###
function createVisualization ( dataset ) {
  //ignore console.log( 'Data: ', dataset );

  //_____ VARIABLES _____
  //>>> DOM and layout:
  const margin = { top: 100, right: 20, bottom: 100, left: 70 };
  const container = d3.select( '#container' );
  const containerWidth = container.node().getBoundingClientRect().width;
  const width = Math.min( 800, containerWidth - margin.left - margin.right );
  // const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  //>>> Styling:
  const offWhite = '#f4f4f4';


  //_____ EXTRACT DATA _____
  const baseTemperature = dataset.baseTemperature;
  const monthlyVariance = dataset.monthlyVariance;
  const years = monthlyVariance.map( d => d.year );
  const months = monthlyVariance.map( d => d.month );
  const temperatures = monthlyVariance.map( d => baseTemperature + d.variance );
  const variances = monthlyVariance.map( d => d.variance );

  //>>> Data ranges:
  // const minYear = d3.min( years );
  // const maxYear = d3.max( years );
  // const minMonth = d3.min( months );
  // const maxMonth = d3.max( months );
  const minTemperature = d3.min( temperatures );
  const maxTemperature = d3.max( temperatures );
  // const minVariance = d3.min( variances );
  // const maxVariance = d3.max( variances );

  // console.log( 'minTemperature: ', minTemperature );
  // console.log( 'maxTemperature: ', maxTemperature );


  //_____ SVG _____
  const svg = container
    .append( 'svg' )
    //>>> Remove the static 'width' and 'height' attributes, and instead, use 'viewBox' and 'preserveAspectRatio' for responsiveness
    // .attr( 'width', width + margin.left + margin.right )
    // .attr( 'height', height + margin.top + margin.bottom )
    .attr( 'viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}` )
    .attr( 'preserveAspectRatio', 'xMidYMid meet' )
    .append( 'g' )
    .attr( 'transform', `translate( ${margin.left}, ${margin.top} )` )
    .attr( 'id', 'heatmap' );


  //_____ SET THE SCALES AND DOMAIN _____
  const xScale = d3.scaleBand()
    .domain( [ ...new Set( years ) ] )
    .range( [ 0, width ] );

  const yScale = d3.scaleBand()
    .domain( [ ...Array( 12 ).keys() ].map( d => d + 1 ) ) //--- Adjust to 1-indexed months
    .range( [ 0, height ] );

  const colorScale = d3.scaleSequential()
    .domain( [ minTemperature, maxTemperature ] )
    .interpolator( d3.interpolateRdBu );


  //_____ SET THE AXES TICKS _____
  const xAxis = d3.axisBottom( xScale )
    .tickValues( xScale.domain().filter( year => year % 10 === 0 ) );

  const yAxis = d3.axisLeft( yScale )
    .tickFormat( month => {
      const date = new Date( 0, month - 1 );
      return d3.timeFormat( '%B' )( date );
    } );


  //_____ ADD AXES _____
  //>>> X-axis:
  svg.append( 'g' )
    .attr( 'id', 'x-axis' )
    .attr( 'transform', `translate( 0, ${height} )` )
    .style( 'font-size', '8px' )
    .call( xAxis );

  //>>> Y-axis:
  svg.append( 'g' )
    .attr( 'id', 'y-axis' )
    .style( 'font-size', '8px' )
    .call( yAxis );


  //_____ AXES LABELS _____
  //>>> X-axis label:
  svg.append( 'text' )
    .attr( 'x', width / 2 )
    .attr( 'y', height + margin.bottom - 65 )
    .style( 'text-anchor', 'middle' )
    .style( 'fill', offWhite )
    .style( 'font-size', '12px' )
    .text( 'Year' );

  //>>> Y-axis label:
  svg.append( 'text' )
    .attr( "x", 0 - height / 2 )
    .attr( "y", 0 - margin.left + 10 )
    .attr( "dy", "1em" )
    .attr( 'transform', 'rotate( -90 )' )
    .style( 'text-anchor', 'middle' )
    .style( 'fill', offWhite )
    .style( 'font-size', '12px' )
    .text( 'Months' );


  //_____ ADD THE CELLS _____
  svg.selectAll( ".cell" )
    .data( dataset.monthlyVariance )
    .enter().append( "rect" )
    .attr( "class", "cell" )
    .attr( "x", d => xScale( d.year ) )
    .attr( "y", d => yScale( d.month ) )
    .attr( "width", xScale.bandwidth() )
    .attr( "height", yScale.bandwidth() )
    .attr( "data-month", d => d.month - 1 )
    .attr( "data-year", d => d.year )
    .attr( "data-temp", d => baseTemperature + d.variance )
    .attr( "fill", d => colorScale( baseTemperature + d.variance ) )
    .attr( "stroke", d => colorScale( baseTemperature + d.variance ) )
    .attr( "stroke-width", 0.5 );


  //_____ ADD THE TOOLTIP _____
  //>>> Tooltip:
  const tooltip = container.append( 'div' )
    .attr( 'id', 'tooltip' )
    .style( 'opacity', 0 );

  //>>> Bind the tooltip to the cells hover events:
  svg.selectAll( '.cell' )

    //>>> Show the tooltip on mouseover:
    .on( 'mouseover', ( event, d ) => {
      //>>> Tooltip data variables:
      const date = new Date( d.year, d.month - 1 );
      const month = d3.timeFormat( '%B' )( date );
      const temperature = ( baseTemperature + d.variance ).toFixed( 1 );
      const variance = d.variance.toFixed( 1 );

      //>>> Style the tooltip based on the cell color:
      // const cellColor = colorScale( baseTemperature + d.variance );
      // tooltip.style( 'background', cellColor );

      //>>> Show the tooltip with transition:
      tooltip.transition()
        .duration( 200 )
        .style( 'opacity', 1 );

      //>>> Position the tooltip:
      tooltip
        .style( 'left', event.pageX - 60 + 'px' )
        .style( 'top', event.pageY - 70 + 'px' );

      //>>> Set the tooltip content:
      tooltip.html( `
          <p>${d.year} - ${month} <br>
          ${temperature}°C <br>
          ${variance}°C</p>
        ` );

      //>>> Set the data-year attribute:
      tooltip.attr( 'data-year', d.year );
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
    .attr( 'y', 0 - 60 )
    .attr( 'text-anchor', 'middle' )
    .style( 'font-size', '24px' )
    .style( 'fill', offWhite )
    .style( 'font-weight', 'bold' )
    .text( 'Monthly Global Land-Surface Temperature' );


  //_____ SUBTITLE _____
  svg.append( 'text' )
    .attr( 'id', 'description' )
    .attr( 'x', width / 2 - 30 )
    .attr( 'y', 0 - 30 )
    .attr( 'text-anchor', 'middle' )
    .style( 'font-size', '18px' )
    .style( 'fill', offWhite )
    .text( '1753 - 2015: base temperature 8.66℃' );


  //_____ ADD THE LEGEND _____
  //>>> Legend data:
  //--- Number of colors:
  const numColors = 9;
  //--- Range of temperatures:
  const tempRange = maxTemperature - minTemperature;
  //--- Array of temperatures for legend items:
  const legendTemps = Array.from( {
    length: numColors
  }, ( d, i ) =>
    minTemperature + ( i * tempRange / ( numColors - 1 ) )
  );

  //>>> Legend Rectangles Size:
  const legendItemWidth = 20;
  const legendItemHeight = 15;

  //>>> Legend Group:
  //--- Position:
  // const legendX = width - ( legendItemWidth * numColors ); //--- Adjust by legend size from the right
  const legendX = 0; //--- Adjust from left
  const legendY = height + margin.bottom - 50; //--- Adjust from bottom
  //--- Create the legend group:
  const legend = svg.append( 'g' )
    .attr( 'id', 'legend' )
    .attr( 'transform', `translate( ${legendX}, ${legendY} )` );

  //>>> Legend Scale:
  const legendScale = d3.scaleLinear()
    .domain( [ minTemperature, maxTemperature ] )
    .range( [ 0, legendItemWidth * numColors ] );

  //>>> Legend Axis:
  const legendAxis = d3.axisBottom( legendScale )
    .tickValues( legendTemps )
    .tickFormat( d => d.toFixed( 1 ) );

  //>>> Append the coloured rectangles:
  legend.selectAll( 'rect' )
    .data( legendTemps )
    .enter().append( 'rect' )
    .attr( 'x', ( d, i ) => i * legendItemWidth )
    .attr( 'y', 0 )
    .attr( 'width', legendItemWidth )
    .attr( 'height', legendItemHeight )
    .attr( 'fill', d => colorScale( d ) )
    .attr( 'stroke', d => colorScale( d ) );

  //>>> Append the legend axis:
  legend.append( 'g' )
    .attr( 'id', 'legend-axis' )
    .attr( 'transform', `translate( 0, ${legendItemHeight} )` )
    .style( 'font-size', '8px' )
    .call( legendAxis );

  //>>> Legend Labels:
  //::::: Alternative to the axis. No ticks, and value is placed in the middle of the rectangle:
  /* legend.selectAll( 'text' )
    .data( legendTemps )
    .enter().append( 'text' )
    .attr( 'x', ( d, i ) => i * legendItemWidth + legendItemWidth / 2 )
    .attr( 'y', legendItemHeight + 14 ) //--- Position below rects
    .style( 'text-anchor', 'middle' )
    .style( 'font-size', '8px' )
    .style( 'fill', offWhite )
    .text( d => d.toFixed( 1 ) ); */


}