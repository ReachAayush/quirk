
jQuery(function($){

  $('#image2').Jcrop({
    onChange:   showCoords,
    onSelect:   showCoords,
    onRelease:  clearCoords
  });

  $('#image3').Jcrop({
    onChange:   showCoords2,
    onSelect:   showCoords2,
    onRelease:  clearCoords2
  });
});

// Simple event handler, called from onChange and onSelect
// event handlers, as per the Jcrop invocation above
function showCoords(c)
{
  $('#x1').val(c.x);
  $('#y1').val(c.y);
  $('#x2').val(c.x2);
  $('#y2').val(c.y2);
  $('#w').val(c.w);
  $('#h').val(c.h);
};
function showCoords2(c)
{
  $('#x12').val(c.x);
  $('#y12').val(c.y);
  $('#x22').val(c.x2);
  $('#y22').val(c.y2);
  $('#w2').val(c.w);
  $('#h2').val(c.h);
};

function clearCoords2()
{
  $('#coords2 input').val('');
};
function clearCoords()
{
  $('#coords input').val('');
};