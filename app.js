const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const req = new XMLHttpRequest()




req.open('GET', dataset, true)
req.onload = () => {
    let values = JSON.parse(req.responseText)

    // Canvas setup
    let svg = d3.select('svg')
    let width = 800
    let height = 500
    let padding = 40
    svg.attr('width', width)
    svg.attr('height', height)


    // Define scales
    let yScale = d3.scaleTime()
        .domain([d3.min(values, (d) => {
            return new Date(d['Seconds'] * 1000)
        }), d3.max(values, (d) => {
            return new Date(d['Seconds'] * 1000)
        })])
        .range([padding, height - padding])

    let xScale = d3.scaleLinear()
        .domain([d3.min(values, (d) => {
            return d['Year']
        }), d3.max(values, (d) => {
            return d['Year']
        })])
        .range([padding, width - padding])



    //Setup axises
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')

     //Create tooltip to display selected bar values
     let tooltip = d3.select('body')
     .append('div')
     .attr('id', 'tooltip')
     .style('visibility', 'hidden')
     .style('width', 'auto')
     .style('height', 'auto')

    //Draw data points for scatter plot
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '4')
        .attr('data-xvalue', (d) => {
            return d['Year']
        })
        .attr('data-yvalue', (d) => {
            return new Date(d['Seconds'] * 1000)
        })
        .attr('cx', (d) => {
            return xScale(d['Year'])
        })
        .attr('cy', (d) => {
            return yScale(new Date(d['Seconds'] * 1000))
        })
        .attr('fill', (d) => {
            if(d['Doping'] != '') {
                return '#03045e'
            } else {
                return 'white'
            }
        })

         //Code for tooltip updating 
         .on('mouseover', (d) => {

            tooltip.transition()
                .style('visibility', 'visible')
                .style('left', d3.event.pageX + 10 + 'px')
            .style('top', d3.event.pageY - 10 + 'px')
            .style('background-color', '#caf0f8')
            if(d['Doping'] != '') {
                tooltip.html(d['Year'] + ' ' + d['Name'] + ' ' + d['Time'] + ' ' + ' ' + d['Doping'])
            } else {
                tooltip.html(d['Year'] + ' ' + d['Name'] + ' ' + d['Time'] + ' ' + ' ' + 'No Allegations')

            }
            document.querySelector('#tooltip').setAttribute('data-year', d['Year'])

        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

req.send()