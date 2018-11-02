/* Catmull-Rom Spline to Bezier Spline Converter
 *
 * Forked from github.com/ariutta/catmullrom2bezier
 * further: http://schepers.cc/getting-to-the-point
 *
 * License: MIT, see LICENSE file
 *
 * Contact info:
 * if it is about the algorithm or original source:
 *   www-svg@w3.org for public comments (preferred),
 *   schepers@w3.org for personal comments.
 * if it is about this library please use Github issues.
 *
 * © schepers 2010
 * ES6 library adaption @ koehr 2018
 */

// expects String describing path (d property of <path>)
// returns String describing Bezier equivalent
// NOTE: This code supports only absolute command coordinates.
function parsePath (d) {
  let pathArray = []
  let lastX = ''
  let lastY = ''

  // no need to redraw the path if no Catmull-Rom segments are found
  if (d.search(/[rR]/) < 0) {
    return d
  }

  const pathSplit = d.split(/([A-Za-z])/)

  for (let i = 0, iLen = pathSplit.length; iLen > i; i++) {
    const segment = pathSplit[i]
    const command = segment.toLowerCase() // lower case for easier matching

    // whoops, not a command
    if (command.search(/[a-z]/) < 0) continue

    let val = ''
    if (command !== 'z') {
      i++
      val = pathSplit[i].replace(/\s+$/, '')
    }

    // "R" and "r" are the a Catmull-Rom spline segment
    if (command === 'r') {
      const points = `${lastX},${lastY} ${val}`
      const beziers = catmullRom2bezier(points) // convert to Bézier
      pathArray.push(beziers) // and put it back
    } else {
      pathArray.push(segment + val) // not our business, put back directly

      // find last x,y points, for feeding into Catmull-Rom conversion algorithm
      if (command === 'h') {
        lastX = val
      } else if (command === 'v') {
        lastY = val
      } else if (command !== 'z') {
        const c = val.split(/[,\s]/)
        lastY = c.pop()
        lastX = c.pop()
      }
    }
  }

  // return recombined path segments
  return pathArray.join(' ')
}

function catmullRom2bezier (points) {
  const crp = points.split(/[,\s]/).map(n => parseFloat(n))
  let d = ''

  for (let i = 0, iLen = crp.length; iLen - 2 > i; i += 2) {
    let p = []

    if (i === 0) {
      p.push({ x: crp[i], y: crp[i + 1] })
      p.push({ x: crp[i], y: crp[i + 1] })
      p.push({ x: crp[i + 2], y: crp[i + 3] })
      p.push({ x: crp[i + 4], y: crp[i + 5] })
    } else if (i === iLen - 4) {
      p.push({ x: crp[i - 2], y: crp[i - 1] })
      p.push({ x: crp[i], y: crp[i + 1] })
      p.push({ x: crp[i + 2], y: crp[i + 3] })
      p.push({ x: crp[i + 2], y: crp[i + 3] })
    } else {
      p.push({ x: crp[i - 2], y: crp[i - 1] })
      p.push({ x: crp[i], y: crp[i + 1] })
      p.push({ x: crp[i + 2], y: crp[i + 3] })
      p.push({ x: crp[i + 4], y: crp[i + 5] })
    }

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    let bp = []
    bp.push({ x: p[1].x, y: p[1].y })
    bp.push({ x: ((-p[0].x + 6 * p[1].x + p[2].x) / 6), y: ((-p[0].y + 6 * p[1].y + p[2].y) / 6) })
    bp.push({ x: ((p[1].x + 6 * p[2].x - p[3].x) / 6), y: ((p[1].y + 6 * p[2].y - p[3].y) / 6) })
    bp.push({ x: p[2].x, y: p[2].y })

    d += `C${bp[1].x},${bp[1].y} ${bp[2].x},${bp[2].y} ${bp[3].x},${bp[3].y} `
  }

  return d
}

export default parsePath
