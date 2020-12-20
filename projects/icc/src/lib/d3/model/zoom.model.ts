export interface IccD3ZoomOptions {
  enabled?: boolean;
  // scaleExtent?: [1, 10],
  // useFixedDomain?: boolean;
  // useNiceScale?: boolean;
  horizontalOff?: boolean;
  horizontalBrushShow?: boolean;
  verticalOff?: boolean;
  verticalBrushShow?: boolean;
  // unzoomEventType?: 'dblclick.zoom'
}

export const DEFAULT_D3ZOOM_OPTIONS: IccD3ZoomOptions = {
  enabled: true,
  horizontalOff: false,
  horizontalBrushShow: true,
  verticalOff: false,
  verticalBrushShow: true
};
