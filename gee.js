
var points = ee.FeatureCollection(data_train);
points = points.filter(ee.Filter.eq('Campania','19/20'));
//print(points)

function sclFilter(image){
  var scl = image.select('SCL')
    .expression("b(0) == 2 ||(b(0) > 3 && b(0) < 8)");
  return image.mask(scl);
}
//;

// Map the function over one year of data and take the median.
// Load Sentinel-2 TOA reflectance data.
var dates = ['2018-12-01', '2018-12-31', 
            '2019-01-31', '2019-02-20', 
            //  '2019-02-15', '2019-03-15', 
              '2019-03-15', '2019-04-15'];

var dates2 = ['2019-12-20', '2020-01-15', 
             '2020-01-31', '2020-02-20',
             //'2020-02-25', '2020-03-20', 
             '2020-03-20', '2020-04-01'];

var i =2;

var im = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(geometry)
    .filterDate(dates[i*2], dates[i*2+1])
    // Pre-filter to get less cloudy granules.
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
    //.map(maskS2clouds)
    .map(sclFilter)
    .reduce(ee.Reducer.firstNonNull())

//var samples = im.sampleRegions({collection:points,projection:'EPSG:32720', scale:10});
//print(samples);
Map.addLayer(im, {bands: ['B4_first', 'B3_first', 'B2_first'], min: 0, max: 3000}, 'rgb');
//print(im);

var im2 = ee.ImageCollection('COPERNICUS/S2_SR')
    .filterBounds(geometry)
    .filterDate(dates2[i*2], dates2[i*2+1])
    // Pre-filter to get less cloudy granules.
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
    //.map(maskS2clouds)
    .map(sclFilter)
    .reduce(ee.Reducer.firstNonNull())

//var samples2 = im2.sampleRegions({collection:points,projection:'EPSG:32720', scale:10})

//print(samples2)
// Display the results.

Map.addLayer(im2, {bands: ['B4_first', 'B3_first', 'B2_first'], min: 0, max: 3000}, 'rgb')

//Map.addLayer({eeObject:points,shown:false})
