# DrawMap

DrawMap is an Angular app that converts drawings on a Google map into a walkable route. This route can be exported as
 a 2-leg journey (or 1 leg, if it’s short enough).
 
## Installation
1. Clone repository.
1. Run `npm install` from the app's root.
1. Get a Google Maps API Key, put it into the appropriate spot in `app.module.ts`.
1. Run `ng serve` to turn on the development server (you'll need the Angular CLI installed globally).
 
## To-(but-probably-won't)-do
- Allow user to specify number of legs (increasing route-to-drawing fidelity by specifying more legs).
- Add touch support to make app functional on mobile devices (probably `Hammer.JS`).
- Clean up production build and deployment (currently using the built-in development server).
- Figure out a way to clear up the occasional spikes in the routes due to the waypoints. We ought to add 
some heuristics for moving the waypoints around after they're generated, to make the resulting route look a bit 
smoother.
- Waypoints are currently generated as a uniform distribution, along the PolyLine. But this is not optimal, since if 
the line curves in on itself, two adjacent points might be too close to one another to be of any use. There might be 
an analytical solution for the optimal distribution of points along a given line, to ensure the least amount of loss 
in accuracy when creating the route. If not, then some heuristics like "maintain at least X km from any other waypoint" 
would probably lead to a nicer route. (This would be a fun problem to solve)
