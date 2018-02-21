import _ from 'lodash';
const moment = require('moment');
const d3 = require('d3');

export default function(_data: any, _trades: any, _height: any) {

  const trades = _trades.map((t) => {
    return {
      price: t.price,
      date: moment.utc(t.date).toDate(),
      action: t.action,
    };
  });

  const data = _data.map((c) => {
    return {
      price: c.close,
      date: moment.utc(c.start).toDate(),
    };
  });

  const dates = data.map((c) => +c.date);
  const prices = data.map((c) => +c.price);

  const svg = d3.select('#chart');

  svg.attr('width', window.innerWidth - 20);

  const margin = {top: 20, right: 20, bottom: 110, left: 40};
  const height = _height - margin.top - margin.bottom;
  const margin2 = {top: _height - 70, right: 20, bottom: 30, left: 40};
  const width = +svg.attr('width') - margin.left - margin.right;
  const height2 = _height - margin2.top - margin2.bottom;

  const x = d3.scaleUtc().range([0, width]),
      x2 = d3.scaleUtc().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      y2 = d3.scaleLinear().range([height2, 0]);

  const xAxis = d3.axisBottom(x),
      xAxis2 = d3.axisBottom(x2),
      yAxis = d3.axisLeft(y).ticks(_height / 50);

  const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on('brush end', brushed);

  const zoom = d3.zoom()
      .scaleExtent([1, 100])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on('zoom', zoomed);

  const line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.price); });

  const line2 = d3.line()
      .x(function(d) { return x2(d.date); })
      .y(function(d) { return y2(d.price); });

  svg.append('defs').append('clipPath')
      .attr('id', 'clip')
    .append('rect')
      .attr('width', width)
      .attr('height', height);

  const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(prices) * 0.99,
    d3.max(prices) * 1.01,
  ]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append('path')
      .datum(data)
      .attr('class', 'line price')
      .attr('d', line);

  focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

  context.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line2);

  context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height2 + ')')
      .call(xAxis2);

  const circles = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .selectAll('circle')
      .data(trades)
      .enter().append('circle')
        .attr('class', function(d) { return d.action; })
        .attr('cx', function(d) { return x(d.date); })
        .attr('cy', function(d) { return y(d.price); })
        .attr('r', 5);

  const brushCircles = context
    .append('g')
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .selectAll('circle')
      .data(trades)
      .enter().append('circle')
        .attr('class', function(d) { return d.action; })
        .attr('cx', function(d) { return x2(d.date); })
        .attr('cy', function(d) { return y2(d.price); })
        .attr('r', 3);


  context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range());

  svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; } // ignore brush-by-zoom
    const s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));

    scaleY(x.domain());

    svg.select('.axis--y')
      .call(yAxis);

    circles
      .attr('cx', function(d) { return x(d.date); })
      .attr('cy', function(d) { return y(d.price); });

    focus.select('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
  }

  function scaleY(domain) {
    const [min, max] = domain;

    const minIndex = _.sortedIndex(dates, min);
    const maxIndex = _.sortedIndex(dates, max);

    const set = prices.slice(minIndex, maxIndex);
    y.domain([
      d3.min(set) * 0.9995,
      d3.max(set) * 1.0005,
    ]);
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') { return; } // ignore zoom-by-brush
    const t = d3.event.transform;

    scaleY(t.rescaleX(x2).domain());

    svg.select('.axis--y')
      .call(yAxis);

    x.domain(t.rescaleX(x2).domain());
    focus.select('.line').attr('d', line);

    circles
      .attr('cx', function(d) { return x(d.date); })
      .attr('cy', function(d) { return y(d.price); });


    focus.select('.axis--x').call(xAxis);
    context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
  }
}
