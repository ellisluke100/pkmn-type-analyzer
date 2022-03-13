# pkmn-type-analyzer
Webpage where you can put in your team of 6 pokemon and view an analysis of that team's type resistances and weaknesses.

Uses PokeAPI (https://pokeapi.co/) in order to obtain pokemon information. Also uses Chart.js (https://www.chartjs.org/) to visualise the team's resistances and weaknesses.

The chart graphs a value that is calculated per type for the whole team, representing how good the team overall is against that type. For example, a value of 1 indicates there is 1 more pokemon that resists it than the other pokemon that are weak or neutral to it. A value of 2 would indicate 2 more pokemon, or that 1 pokemon has an immunity or quad resistance.

Quad resistance / Immunity = +2  
Half resistance = +1  
Neutral = +0  
Half weakness = -1  
Quad weakness = -2  

This value is used to calculate the overall rating of the team, i.e. GOOD, VERY GOOD. There are thresholds for each of these ratings which I just intuited, they might not be true at the highest level of play, but are useful for how I may use this tool. Anyway, it was fun to make, and I learned a bunch! Awesome!
