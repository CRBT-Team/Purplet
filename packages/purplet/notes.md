okay so purplet 2 had to get rushed for the CRBT Event on jul 9. what i would like to change

- rewrite the entire internal feature/hook system to be simply ids, and then a function that would, given an array of instances, handle init, cleanup, and hmr (the array changes). this is kinda how purplet v1 handles things but it wasn't composable like the new api embraces.
- gatewaybot is a crazy large class. it should be broken up into smaller things, maybe not even be a class at all. point one might help this out
- with point one, command groups can be better implemented vs the current really bad solution it is rn.
