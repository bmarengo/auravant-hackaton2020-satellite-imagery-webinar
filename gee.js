
var point1 = ee.Geometry.Point([-57.50209, -35.51153], 'EPSG:4326');
var point2 = ee.Geometry.Point([-57.49819, -35.50871], 'EPSG:4326');

point1 = ee.Feature(point1, {'id': 1});
point2 = ee.Feature(point2, {'id': 2});

var points = ee.FeatureCollection([point1, point2]);

//points = points.filter(ee.Filter.eq('id',1));

Map.addLayer(points, 'points');


// -----------------------
// Función de filtrado de nubes.
function sclFilter(image){
  var scl = image.select('SCL')
    .expression("b(0) == 2 ||(b(0) > 3 && b(0) < 8)");
  return image.mask(scl);
}


// -----------------------
// Obtener imagen de Sentinel filtrando por fecha y geometría.

var start_date = '2020-04-01';
var end_date = '2020-06-01';

var im = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(points)
    .filterDate(start_date, end_date)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 1))
    //.map(sclFilter)
    //.select(['B2', 'B3', 'B4'])
    .reduce(ee.Reducer.mean());


print(im);


Map.addLayer(im, {bands: ['B4_mean', 'B3_mean', 'B2_mean'], min: 0, max: 3000}, 'rgb');


// ----------------------
// NDVI

var ndvi = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(points)
    .filterDate(start_date, end_date)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 1))
    //.map(sclFilter)
    //.select(['B2', 'B3', 'B4'])
    .first()
    .normalizedDifference(['B8', 'B4']);

print(ndvi);

Map.addLayer(ndvi, {min: -1, max: 1}, 'ndvi');


// -----------------------
// Sampleo de Geometrías


var samples = ndvi.sampleRegions({collection:points, projection:'EPSG:4326', scale:10});
print(samples);

