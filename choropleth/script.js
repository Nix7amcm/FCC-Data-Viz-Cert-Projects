// United States Educational Attainment
// Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)

// Dataset 1: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json
// Dataset 1 Format:
/*
[
  {
    "fips": 1001,
    "state": "AL",
    "area_name": "Autauga County",
    "bachelorsOrHigher": 21.9
  },
  */

// Dataset 2: https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json
// Dataset 2 Format:
/* 
{
  "type": "Topology",
  "objects": {
    "counties": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "id": 5089,
          "arcs": [
            [0, 1, 2, 3, 4]
          ]
        },
*/

// User Stories:
// User Story #1: My choropleth should have a title with a corresponding id="title".

// User Story #2: My choropleth should have a description element with a corresponding id="description".

// User Story #3: My choropleth should have counties with a corresponding class="county" that represent the data.

// User Story #4: There should be at least 4 different fill colors used for the counties.

// User Story #5: My counties should each have data-fips and data-education properties containing their corresponding fips and education values.

// User Story #6: My choropleth should have a county for each provided data point.

// User Story #7: The counties should have data-fips and data-education values that match the sample data.

// User Story #8: My choropleth should have a legend with a corresponding id="legend".

// User Story #9: There should be at least 4 different fill colors used for the legend.

// User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

// User Story #11: My tooltip should have a data-education property that corresponds to the data-education of the active area.



//### FETCH THE DATA ###
//>>> Fetch the education data
d3.json( 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json' )
  .then( educationData => {
    //console.log(educationData);
    //>>> Fetch the county data
    d3.json( 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json' )
      .then( countyData => {
        //console.log(countyData);
        //>>> Create the map
        createMap( educationData, countyData );
      } );
  } )
  .catch( error => {
    console.log( 'Error fetching data: ', error );
  } );


//### CREATE THE MAP ###
function createMap ( educationData, countyData ) {
  //_____ VARIABLES _____
  //>>> DOM and layout:
  //ignore const margin = { top: 0, right: 0, bottom: 0, left: 0 }; //--- Not used
  const container = d3.select( '#container' );
  //>>> SVG dimensions (viewBox and preserveAspectRatio are set in the SVG element):
  const width = 1050;
  const height = 620;

  //>>> Styling constants:
  const offWhite = '#f4f4f4';


  //_____ EXTRACT DATA _____
  //>>> Create a map from fips to education data for quick lookup:
  const educationLookup = educationData.reduce( ( acc, d ) => {
    acc[ d.fips ] = d;
    return acc;
  }, {} );

  // ignore:
  // //>>> Get the highest and lowest education and country values:
  // const educationValues = educationData.map( d => d.bachelorsOrHigher );
  // const minEducation = d3.min( educationValues );
  // const maxEducation = d3.max( educationValues );
  // //>>> Get the highest and lowest values and return the county, state and value, and log the results:
  // const minMaxEducation = educationData.reduce( ( acc, d ) => {
  //   if ( d.bachelorsOrHigher === minEducation ) acc.min = d;
  //   if ( d.bachelorsOrHigher === maxEducation ) acc.max = d;
  //   return acc;
  // }, {} );
  // console.log( 'minMaxEducation:', minMaxEducation );




  //_____ SVG _____
  const svg = container
    .append( 'svg' )
    //>>> Set position and dimensions of the SVG
    //::::: Use a viewBox and preserveAspectRatio to make the SVG responsive
    .attr( 'viewBox', `-80 -5 ${width} ${height}` )
    .attr( 'preserveAspectRatio', 'xMidYMid meet' )
    .append( 'g' )
    .attr( 'id', 'map' );


  //_____ DEFINE THE COLOR SCALE _____
  //>>> Use a quantize scale to map the education data to colors
  //::::: blue to purple color scale
  const colorScale = d3.scaleQuantize()
    .domain( [ 0, d3.max( educationData, d => d.bachelorsOrHigher ) ] )
    .range( d3.schemeBuPu[ 9 ] );


  //_____ CREATE THE GEOPATH GENERATOR _____
  const path = d3.geoPath();


  //_____ DRAW THE COUNTIES _____
  //::::: Select the SVG and append paths for the counties
  svg.selectAll( 'path' )
    .data( topojson.feature( countyData, countyData.objects.counties ).features )
    .enter()
    .append( 'path' )
    .attr( 'class', 'county' )
    .attr( 'd', path )
    .attr( 'fill', d => {
      //--- Use FIPS code to lookup education data and color the county
      const education = educationLookup[ d.id ];
      return education ? colorScale( education.bachelorsOrHigher ) : offWhite;
    } )
    .attr( 'data-fips', d => d.id )
    .attr( 'data-education', d => {
      const education = educationLookup[ d.id ];
      return education ? education.bachelorsOrHigher : 0;
    } );
  //>>> Additional attributes for user stories...


  //_____ TOOLTIP _____
  //>>> Define and style the tooltip:
  const tooltip = d3.select( 'body' ).append( 'div' )
    .attr( 'id', 'tooltip' )
    .style( 'opacity', 0 );

  //>>> Add mouse events to the counties:
  svg.selectAll( '.county' )
    //>>> Display the tooltip on mouseover:
    .on( 'mouseover', ( event, d ) => {
      //>>> Add a transition:
      tooltip.transition()
        .duration( 200 )
        .style( 'opacity', 0.9 );
      // .style( 'visibility', 'visible' );

      //>>> Position the tooltip:
      tooltip
        .style( 'left', event.pageX - 60 + 'px' )
        .style( 'top', event.pageY - 70 + 'px' );

      //>>> Lookup the education data for the county:
      const education = educationLookup[ d.id ];

      //>>> Set the tooltip content:
      tooltip.html( education && `
        <p>
          ${education.area_name.replace( ' County', ' Co.' )} <br>
          ${education.state} <br>
          ${education.bachelorsOrHigher}%   
        </p> 
      `)
        .attr( 'data-education', education ? education.bachelorsOrHigher : 0 );
    } )

    //>>> Hide the tooltip on mouseout with a transition:
    .on( 'mouseout', () => {
      tooltip.transition()
        .duration( 500 )
        // .style( 'visibility', 'hidden' );
        .style( "opacity", 0 );
    } );


  //_____ LEGEND _____
  //>>> Create the legend:
  const x = d3.scaleLinear()
    .domain( [ 0, d3.max( educationData, d => d.bachelorsOrHigher ) ] )
    .rangeRound( [ 500, 860 ] );

  //>>> Append the legend group:
  const legend = svg.append( "g" )
    .attr( "id", "legend" )
    .attr( "transform", "translate(0,20)" );

  //>>> Add the legend rectangles:
  legend.selectAll( "rect" )
    .data( colorScale.range().map( function ( color ) {
      const d = colorScale.invertExtent( color );
      if ( d[ 0 ] == null ) d[ 0 ] = x.domain()[ 0 ];
      if ( d[ 1 ] == null ) d[ 1 ] = x.domain()[ 1 ];
      return d;
    } ) )
    .enter().append( "rect" )
    .attr( "height", 10 )
    .attr( "x", d => x( d[ 0 ] ) )
    .attr( "width", d => x( d[ 1 ] ) - x( d[ 0 ] ) )
    .attr( "fill", d => colorScale( d[ 0 ] ) );

  //>>> Calculate the tick values, including the last value of the domain
  const tickValues = colorScale.range().map( ( d ) => colorScale.invertExtent( d )[ 0 ] );
  //>>> Add the last value manually by extending the array
  tickValues.push( d3.max( educationData, d => d.bachelorsOrHigher ) );

  //>>> Add legend axis
  const legendAxis = d3.axisBottom( x )
    .tickSize( 17 )
    .tickFormat( x => Math.round( x ) + '%' )
    .tickValues( tickValues ); //--- Use manually specified tick values

  //>>> Apply the axis to legend SVG:
  const legendAxisGroup = svg.append( "g" )
    .attr( "transform", "translate(0,20)" )
    .call( legendAxis );

  //>>> Remove the domain line:
  legendAxisGroup.select( ".domain" ).remove();

  //>>> Select the line elements and style them:
  legendAxisGroup.selectAll( 'line' )
    .style( 'stroke', offWhite );

  //>>> Select the text elements and style them:
  legendAxisGroup.selectAll( 'text' )
    .style( 'font-size', '1rem' )
    .style( 'fill', offWhite );


}
