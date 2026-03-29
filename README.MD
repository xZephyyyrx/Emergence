To-do:

Figure out how to make dynamic lighting...

Possible option...
1. Render backdrop on lowest z-level canvas
2. Draw a semi-transparent black layer on the next z-level canvas
3. Use a gradient clearRect() at particle position to clear black layer on this canvas?

Need to look into whether clearRect applies to only its own canvas or all layers

much to consirder,...