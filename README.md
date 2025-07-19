# Running the application

## Server

Open a terminal, go to the backend directory and run:

```bash
npm run install
npm run dev
```

This will run the server in development mode. When the server first initializes it will create a pokedex.json file. It will fetch all the info of every pokemon from PokeAPI, and populate these with caught data from caught-pokemon.json, just so we can have some data for caught pokemon in development.

## Client

Open another terminal and run:

```bash
npm install
npm run build
npx vite preview
```

This will build the client and run a preview of it. The reason we want to run it this way is because Vite disables service workers on Dev mode because of the HMR. This is the only way we can check that the app works offline.

## Some notes on the app

Most of the frontend is self-explanatory, some quirks to note are:

- The progress bar on the homepage represents the progress of the trainer, filling up as the trainer catches more pokemon. It's a percentage of the number of pokemons caught / total pokemon on the database.
- Clicking this progress bar takes the user to another webpage showing all the caught pokemon.
- Clicking on a row of the table of the homepage (or a card if in mobile view) takes the user to a dedicated webpage for that pokemon, which can be shared to another user.
- There is extensive filtering and sorting of pokemons, and also a possibility to select some pokemons to remove them from the listing, and an undo action to list them again.
- The pokedex is available offline (provided the user has requested the resources beforehand, so there is something cached on the browser).
- There is a little pokeball next to a pokemon's id that indicates if a trainer has caught that pokemon or not (if it's in grayscale, pokemon hasn't been caught. If the pokeball is in color, then the pokemon has been caught).
- There's a "Download CSV" button that does just that. Exporting a CSV of all pokemon on the pokedex with all of their relevant info.

## Future improvements

Some notable improvements that could be made to the application:

- The server is very simple as it is and a lot of it was done just to run as a demo. It should store the info for the pokemons in a actual database (relational or not).
- This could be split into multiple services depending on the complexity we would be ok with, but a service to run and check periodically the PokeAPI to see if new pokemons are added, for example and update this app's db. Another one to communicate with the clients, for example, providing the endpoints it provides right now.
- Another obvious improvement would be to implement user authentication to have multiple people access the service and actually make a differentiation between trainers on which pokemons each one has caught and when. Also the notes that each user can write to each pokemon.
- Other things would be better styling on the client side of the application and actually developing some CI/CD pipeline and test coverage, I didn't really had much time to cover these areas.
