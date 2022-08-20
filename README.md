# Snap

@Todo -- what is this about?

Snap using a profile and save screenshots to a directory:

```
./snap.js profiles/sample.json snaps/main
```

Typically you'd then switch to your feature branch or newer git commit and create a new set of screenshots:

```
./snap.js profiles/sample.json snaps/branch
```

Then compare (diff) the screenshots:

```
./snap.js compare snaps/main snaps/branch
```


## Requirements

- Node
- nvm


## Setup

```bash
nvm use
npm install
```

## Notes
