catmullrom2bezier
=================

Catmull-Rom Spline to Bezier Spline Converter, from [Douglas Alan Schepers](http://schepers.cc/getting-to-the-point).

This is an experimental extension of the SVG 'path' element syntax to 
allow Catmull-Rom splines, which differs from Bezier curves in that all
defined points on a Catmull-Rom spline are on the path itself.

This is intended to serve as a proof-of-concept toward inclusion of a 
Catmull-Rom path command into the SVG 2 specification.  As such, it is 
not production-ready, nor are the syntax or resulting rendering stable;
notably, it does not include a 'tension' parameter to allow the author 
to specify how tightly the path interpolates between points. Feedback
on this and other aspects is welcome.
 
The syntax is as follows:

```html
import cr2bezier from 'catmullrom2bezier' 

const crPath = [
  'M20,380', 
  'R58,342', 
  '100,342', 
  '100,300', 
  '140,250', 
  '190,210', 
  '220,197', 
  '250,184', 
  '280,155', 
  '310,260', 
  '404,20'  
].join(' ')

const bezierPath = cr2bezier(crPath)
document.getElementById('the-path').setAttribute('d', bezierPath)
```

In other words, there must be at least one coordinate pair preceding the 
Catmull-Rom path segment (just as with any other path segment), followed
by the new path command 'R', followed by at least two coordinate pairs,
with as many optional subsequent coordinate pairs as desired.
 
(As with path syntax in general, the numbers may be positive or negative 
floating-point values, and the delimiter is any combination of spaces 
with at most one comma.)
