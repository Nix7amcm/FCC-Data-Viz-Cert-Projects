// Treemap Diagram: Movie Sales
// Top 100 Highest Grossing Movies Grouped By Genre

// Dataset: https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json
// Data Format:
/* {
  "name": "Movies",
  "children": [
    {
      "name": "Action",
      "children": [
        {
          "name": "Avatar ",
          "category": "Action",
          "value": "760505847"
        },
    ...
 */

// User Stories:
// User Story #1: My tree map should have a title with a corresponding id="title".

// User Story #2: My tree map should have a description with a corresponding id="description".

// User Story #3: My tree map should have rect elements with a corresponding class="tile" that represent the data.

// User Story #4: There should be at least 2 different fill colors used for the tiles.

// User Story #5: Each tile should have the properties data-name, data-category, and data-value containing their corresponding name, category, and value.

// User Story #6: The area of each tile should correspond to the data-value amount: tiles with a larger data-value should have a bigger area.

// User Story #7: My tree map should have a legend with corresponding id="legend".

// User Story #8: My legend should have rect elements with a corresponding class="legend-item".

// User Story #9: The rect elements in the legend should use at least 2 different fill colors.

// User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

// User Story #11: My tooltip should have a data-value property that corresponds to the data-value of the active area.



//### FETCH THE DATA ###
//>>> Fetch the movie data:
d3.json( 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json' )
  .then( movieData => {
    //console.log(movieData);
    //>>> Create the treemap
    createTreemap( movieData );
  } )
  .catch( error => {
    console.log( 'Error fetching data: ', error );
  } );


//### CREATE THE TREEMAP ###
function createTreemap ( movieData ) {
  //_____ VARIABLES _____
  //>>> DOM and layout:
  const container = d3.select( '#container' );
  //>>> SVG dimensions (viewBox and preserveAspectRatio are set in the SVG element):
  const width = 1050;
  const height = 620;

  //>>> Styling:
  const offWhite = '#f4f4f4';


  //_____ SVG _____
  const svg = container
    .append( 'svg' )
    //>>> Set position and dimensions of the SVG
    //::::: Use a viewBox and preserveAspectRatio to make the SVG responsive
    .attr( 'viewBox', `0 0 ${width} ${height}` )
    .attr( 'preserveAspectRatio', 'xMidYMid meet' )
    .attr( 'id', 'treemap' )
    // .style('background-color', offWhite)
    .style( ' font-size', '10px' );


  //_____ CREATE THE TREEMAP LAYOUT _____
  const treemap = d3.treemap()
    .size( [ width, height ] )
    .paddingInner( 1 ); //+++ Adjust the padding between tiles


  //_____ CONVERT THE DATA TO A HIERARCHY _____
  const rootHierarchy = d3.hierarchy( movieData )
    .sum( d => d.value ) //--- Set the leaf value to the 'value' property
    .sort( ( a, b ) => b.height - a.height || b.value - a.value ); //--- Sort by height and value
  //console.log(hierarchy);


  //_____ COMPUTE THE NODE POSITIONS _____
  const treemapRootLayout = treemap( rootHierarchy );


  //_____ DEFINE THE COLOR SCALE _____
  const colorScale = d3.scaleOrdinal( d3.schemePastel1 ); //+++ Change the color scheme


  //_____ CREATE THE TILES _____
  //>>> Create a group for each tile and text element
  const tiles = svg.selectAll( 'g' )
    .data( treemapRootLayout.leaves() )
    .enter()
    .append( 'g' ) //--- Group each tile and text element
    .attr( 'transform', d => `translate(${d.x0}, ${d.y0})` );

  //>>> Add the tiles:
  tiles.append( 'rect' )
    .attr( 'class', 'tile' )
    .attr( 'width', d => d.x1 - d.x0 )
    .attr( 'height', d => d.y1 - d.y0 )
    .attr( 'fill', d => colorScale( d.data.category ) ) //--- Assume each leaf has a 'category' property
    .attr( 'data-name', d => d.data.name )
    .attr( 'data-category', d => d.data.category )
    .attr( 'data-value', d => d.data.value );

  //>>> Add the text to the tiles:
  tiles.append( 'text' )
    .selectAll( 'tspan' )
    .data( d => {
      //--- Split the name into multiple lines if necessary
      return d.data.name.split( /(?=[A-Z][^A-Z])/g );
    } )
    .enter()
    .append( 'tspan' )
    .text( d => d )
    .attr( 'x', 2 ) //--- Padding from the left
    .attr( 'y', ( d, i ) => 13 + i * 10 ) //--- Increment y for each tspan element (if there's split text)
    .style( 'font-size', '0.7em' ) //--- Adjust font size based on tile size
    .style( 'font-weight', '500' );


  // _____ LEGEND DATA AND CALL THE LEGEND FUNCTION _____
  //>>> Extract the categories from the data:
  const categories = movieData.children.map( d => d.name );
  //>>> Create the legend by calling the legend function:
  createLegend( categories, colorScale );


  //_____ TOOLTIP _____
  //>>> Define and style the tooltip:
  const tooltip = d3.select( 'body' ).append( 'div' )
    .attr( 'id', 'tooltip' )
    .style( 'opacity', 0 );

  //>>> Add event listeners to the tiles:
  tiles.on( 'mouseover', ( event, d ) => {
    //>>> Add a transition:
    tooltip.transition()
      .duration( 200 )
      .style( 'opacity', 0.9 );
    // .style( 'visibility', 'visible' );

    //>>> Position the tooltip:
    tooltip
      .style( 'left', event.pageX - 60 + 'px' )
      .style( 'top', event.pageY - 70 + 'px' );

    //>>> Set the tooltip content:
    tooltip.html( `
      <p>
        <span>Name:</span> ${d.data.name} <br>
        <span>Category:</span> ${d.data.category} <br>
        <span>Value:</span> ${d.data.value}   
      </p> 
    `)
      .attr( 'data-value', d.data.value );
  } )

    //>>> Hide the tooltip on mouseout with a transition:
    .on( 'mouseout', () => {
      tooltip.transition()
        .duration( 500 )
        .style( "opacity", 0 );
      // .style( 'visibility', 'hidden' );
    } );

}


//### CREATE THE LEGEND ###
function createLegend ( categories, colorScale ) {
  //_____ VARIABLES _____
  const legendContainer = d3.select( '#legend-container' );
  const width = 370;
  const height = 105;
  const legendPadding = 20; //--- Padding around the entire legend
  const rectSize = 15; //--- Size of the color rectangles
  const legendItemHeight = 25; //--- Height for each row of legend items
  const offWhite = '#f4f4f4';

  //_____ CREATE THE LEGEND SVG _____
  const legendSvg = legendContainer
    .append( 'svg' )
    .attr( 'id', 'legend' )
    .attr( 'width', width )
    .attr( 'height', height );

  //_____ CREATE THE LEGEND GROUP TO POSITION IN SVG _____
  //::::: To position the legend items
  const legendGroup = legendSvg.append( 'g' )
    .attr( 'transform', `translate( ${legendPadding}, ${legendPadding} )` );

  //_____ CREATE THE LEGEND ITEMS WITHIN THE GROUP _____
  const legendItem = legendGroup.selectAll( '.legend-item-wrap' )
    .data( categories )
    .enter()
    .append( 'g' )
    .attr( 'class', 'legend-item-wrap' )
    .attr( 'transform', ( d, i ) => {
      const x = ( i % 3 ) * ( width / 3 ); //--- Position columns based on modulus
      const y = Math.floor( i / 3 ) * legendItemHeight; //--- Position rows after every 3 elements
      return `translate(${x}, ${y})`;
    } );

  //_____ CREATE THE RECTS FOR THE LEGEND ITEMS _____
  legendItem.append( 'rect' )
    .attr( 'width', rectSize )
    .attr( 'height', rectSize )
    .attr( 'class', 'legend-item' )
    .attr( 'fill', d => colorScale( d ) );

  //_____ CREATE THE TEXT LABELS _____
  legendItem.append( 'text' )
    .text( d => d )
    .attr( 'x', rectSize + 5 )
    .attr( 'y', rectSize / 2 + 1 )
    .attr( 'dominant-baseline', 'middle' ) //--- Align text vertically
    .style( 'font-size', '0.8rem' )
    .style( 'font-weight', '500' )
    .style( 'fill', offWhite );
}