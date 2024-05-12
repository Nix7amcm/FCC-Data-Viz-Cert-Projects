// Gross Domestic Product - Bar Chart

// Dataset: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
// Data format:
/* 
...
"frequency": "quarterly",
"from_date": "1947-01-01",
"to_date": "2015-07-01",
"column_names": [
  "DATE",
  "VALUE"
],
"private": false,
"type": null,
"premium": false,
"data": [
  [
    "1947-01-01",
    243.1
  ],
  ...
*/
// User Stories:
// User Story #1: My chart should have a title with a corresponding id="title".

// User Story #2: My chart should have a g element x-axis with a corresponding id="x-axis".

// User Story #3: My chart should have a g element y-axis with a corresponding id="y-axis".

// User Story #4: Both axes should contain multiple tick labels, each with a corresponding class="tick".

// User Story #5: My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.

// User Story #6: Each .bar should have the properties data-date and data-gdp containing date and GDP values.

// User Story #7: The .bar elements' data-date properties should match the order of the provided data.

// User Story #8: The .bar elements' data-gdp properties should match the order of the provided data.

// User Story #9: Each .bar element's height should accurately represent the data's corresponding GDP.

// User Story #10: The data-date attribute and its corresponding .bar element should align with the corresponding value on the x-axis.

// User Story #11: The data-gdp attribute and its corresponding .bar element should align with the corresponding value on the y-axis.

// User Story #12: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

// User Story #13: My tooltip should have a data-date property that corresponds to the data-date of the active area.



//### FETCH THE DATA ###
d3.json( 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json' )
  .then( dataset => {
    //ignore console.log( 'Data fetched: ', dataset );
    createVisualization( dataset );
  } )
  .catch( error => {
    console.log( 'Error fetching data: ', error );
  } );


//### CREATE THE VISUALIZATION ###
function createVisualization ( dataset ) {
  //ignore console.log( 'Data: ', dataset );

  //_____ VARIABLES _____
  const margin = { top: 50, right: 20, bottom: 50, left: 80 };
  const container = d3.select( '#container' );
  const containerWidth = container.node().getBoundingClientRect().width;
  const width = Math.min( 800, containerWidth - margin.left - margin.right );
  // const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const barWidth = width / dataset.data.length;


  //_____ QUARTER COLORS FUNCTION _____
  //>>> Set color variables for each quarter:
  const colors = {
    Q1: '#b3e2cd',
    Q2: '#fdcdac',
    Q3: '#d0cbe8',
    Q4: '#f4cae4'
  };

  function getColorByQuarter ( quarter ) {
    switch ( quarter ) {
      case 'Q1': return colors.Q1;
      case 'Q2': return colors.Q2;
      case 'Q3': return colors.Q3;
      case 'Q4': return colors.Q4;
      default: return 'navy';
    }
  }


  //_____ STRUCTURE THE DATA _____
  const data = dataset.data.map( d => {
    const gdp = d[ 1 ];
    const date = new Date( d[ 0 ] );
    const year = date.getFullYear();
    let quarter;
    switch ( Math.ceil( ( date.getMonth() + 1 ) / 3 ) ) {
      case 1:
        quarter = 'Q1';
        break;
      case 2:
        quarter = 'Q2';
        break;
      case 3:
        quarter = 'Q3';
        break;
      case 4:
        quarter = 'Q4';
        break;
      default:
        quarter = '';
    }
    //>>> Return the structured data object
    return { date, year, quarter, gdp };
  } );


  //ignore Log to test the result:
  // console.log( 'Structured data: ', data[3] );


  //_____ SET THE SCALES _____
  const xScale = d3.scaleTime()
    .domain( d3.extent( data, d => d.date ) )
    .range( [ 0, width ] );

  const yScale = d3.scaleLinear()
    .domain( [ 0, d3.max( data, d => d.gdp ) ] )
    .range( [ height, 0 ] );


  //_____ SET AXES TICKS _____
  const xAxis = d3.axisBottom( xScale )
    .tickFormat( d3.timeFormat( '%Y' ) )
    .ticks( d3.timeYear.every( 5 ) );
  //--- Format the date to display only the year
  //--- Specific tick for every 5 years
  const yAxis = d3.axisLeft( yScale )
    .tickValues( d3.range( 0, d3.max( data, d => d.gdp ), 2000 ) );
  //--- Specific tick values


  //_____ SVG _____
  const svg = container
    .append( 'svg' )
    .attr( 'viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}` )
    .attr( 'preserveAspectRatio', 'xMidYMid meet' )
    .append( 'g' )
    .attr( 'transform', `translate( ${margin.left}, ${margin.top} )` );


  //_____ BARS _____
  //>>> Format for the data-date attribute
  const dateFormat = d3.timeFormat( '%Y-%m-%d' );

  svg.selectAll( '.bar' )
    .data( data )
    .enter()
    .append( 'rect' )
    .attr( 'class', 'bar' )
    .attr( 'x', d => xScale( d.date ) )
    .attr( 'y', d => yScale( d.gdp ) )
    .attr( 'width', barWidth )
    .attr( 'height', d => height - yScale( d.gdp ) )
    .attr( 'data-date', d => dateFormat( d.date ) )
    .attr( 'data-gdp', d => d.gdp )
    .attr( 'fill', d => getColorByQuarter( d.quarter ) );


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
    .attr( "x", 0 - ( height / 2 ) )
    .attr( "y", 0 - margin.left + 10 )
    .attr( "dy", "1em" )
    .attr( 'transform', 'rotate( -90 )' )
    .style( 'text-anchor', 'middle' )
    .style( 'fill', '#f4f4f4' )
    .text( 'GDP ($ Billions)' );


  //_____ TOOLTIP _____
  //>>> Define the div for the tooltip
  const tooltip = d3.select( '#container' )
    .append( 'div' )
    .attr( 'id', 'tooltip' )
    .style( 'opacity', 0 );

  //>>> Bind the tooltip to the bar hover events
  svg.selectAll( 'rect' )

    //>>> Show the tooltip on mouseover:
    .on( 'mouseover', ( event, d ) => {

      //>>> Get the color of the quarter
      const quarterColor = getColorByQuarter( d.quarter );

      //>>> Style the tooltip
      tooltip
        .style( 'background-color', quarterColor )
        .style( 'box-shadow', `1px 1px 5px ${quarterColor}` );

      //>>> Show the tooltip
      tooltip.transition()
        .duration( 200 )
        .style( 'opacity', 0.9 );

      //>>> Set the tooltip content
      tooltip.html( `${d.year}<br>${d.quarter}<br>$${d.gdp} Billion` )
        //--- Position the tooltip relative to the mouse pointer
        .style( 'left', `${event.pageX - 100}px` )
        .style( 'top', `${event.pageY - 75}px` )
        //--- Position the tooltip relative to the bar
        // .style( 'left', `${xScale( d.date ) + margin.left}px` )
        // .style( 'top', `${yScale( d.gdp ) + margin.top}px` )
        .attr( 'data-date', dateFormat( d.date ) );
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
    .attr( 'y', 0 - 10 )
    .attr( 'text-anchor', 'middle' )
    .style( 'font-size', '24px' )
    .style( 'fill', '#f4f4f4' )
    .style( 'font-weight', 'bold' )
    .text( 'US Gross Domestic Product' );


  //_____ LEGEND _____
  //>>> Define the dataset
  const legendData = [
    { quarter: 'Q1', color: colors.Q1 },
    { quarter: 'Q2', color: colors.Q2 },
    { quarter: 'Q3', color: colors.Q3 },
    { quarter: 'Q4', color: colors.Q4 }
  ];

  //>>> Calculate position
  // const legendX = width - margin.right; //--- Position on the right side
  const legendX = margin.right; //--- Position on the left side
  const legendY = 10; //--- Padding from the top
  const legendSpacing = 20; //--- Space between items

  //>>> Add a group element for the legend
  const legend = svg.append( 'g' )
    .attr( 'id', 'legend' )
    .attr( 'transform', `translate(${legendX}, ${legendY})` );

  //>>> Add colored boxes and text labels for each item
  legendData.forEach( ( item, index ) => {
    //>>> Append legend color box
    legend.append( 'rect' )
      .attr( 'x', 0 )
      .attr( 'y', index * legendSpacing )
      .attr( 'width', 15 )
      .attr( 'height', 15 )
      .style( 'fill', item.color );

    //>>> Append legend text
    legend.append( 'text' )
      .attr( 'x', 20 ) //--- Offset text a bit right from the box
      .attr( 'y', index * legendSpacing + 13 ) //--- Vertically align text middle of box
      .text( item.quarter )
      .attr( 'class', 'legend-text' )
      .style( 'fill', item.color ); //--- Match text color with box color
  } );


  //_____ ZOOM BEHAVIOR _____
  //>>> Create the zoom behavior
  function zoom ( svg ) {
    const extent = [ [ margin.left, margin.top ], [ width - margin.right, height - margin.bottom ] ];

    svg.call( d3.zoom()
      .scaleExtent( [ 1, 8 ] ) //--- Allow zooming in up to 8x
      .translateExtent( extent )
      .extent( extent )
      .on( "zoom", zoomed ) );

    function zoomed ( event ) {
      //>>> Calculate new scale range based on the zoom event
      const xz = event.transform.rescaleX( xScale );

      //>>> Update the x position of the bars and their width based on the zoom level
      svg.selectAll( ".bar" )
        .attr( "x", d => xz( d.date ) )
        .attr( "width", d => {
          //>>> Calculate the width based on the next bar's position minus the current bar's position
          const index = data.findIndex( item => item.date === d.date ); //--- Find index of current data point
          const nextDate = data[ index + 1 ] ? data[ index + 1 ].date : new Date( d.date.getTime() + barWidth ); //--- Get next date or calculate it
          return Math.max( 1, xz( nextDate ) - xz( d.date ) ); //--- Calculate width and make sure it's at least 1
        } );

      //>>> Update the x-axis
      svg.select( "#x-axis" ).call( xAxis.scale( xz ) );
    }
  }


  //_____ CALL ZOOM FUNCTION _____
  d3.select( 'svg' ).call( zoom );

}