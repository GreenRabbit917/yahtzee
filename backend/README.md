# backend


## commands
to run commands like `turso` we need to access linux

to run linux commands like `turso` tursin terminal run the following.

```bash
wsl
```
Note: the ubuntu / linux password is the windows pin

login to turso
https://docs.turso.tech/cli/authentication

```bash
turso auth login --headless
```

this allows us to run turso commands, like migrate. 

note, this is different from the `.env` file credentials which allow database level auth.


test
## db
https://app.turso.tech/greenrabbit/databases/yahtsee-game-state/data

see games
http://localhost:5000/games

# next steps
- write code to create a game and add players
