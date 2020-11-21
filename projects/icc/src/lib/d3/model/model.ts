
export const DEFAULT_CHART_OPTIONS = {
  chartType: 'lineChart',
  useInteractiveGuideline: false,
  margin: { top: 10, right: 10, bottom: 20, left: 40 },
  width: '100%',
  height: 500,
  brushYWidth: 50,
  xScaleType: 'time', // time, band  TO DO add others
  yScaleType: 'linear', // linear    TO DO add others
  legendHeight: 20,
  x0: (d) => d.key,
  y0: (d) => d.values,
  x: (d) => d.x,
  y: (d) => d.y,
  drawColor: (d, i) => d.key,
  duration: 0,
  zoom: {
    enabled: true,
    // scaleExtent: [1, 10],
    // useFixedDomain: false,
    // useNiceScale: false,
    horizontalOff: false,
    horizontalBrushShow: true,
    verticalOff: false,
    verticalBrushShow: true
    // unzoomEventType: 'dblclick.zoom'
  }
};

