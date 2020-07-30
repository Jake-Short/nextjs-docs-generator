---
sidebarText: Runtime server
order: 5
---
# Altering the runtime server

If necessary, the runtime server *can* be altered.

>! Altering this is not recommended. The runtime server interacts with the file system (creating and saving .md files) and serves the content when running in development. Altering the functionality of this could cause issues.

## Development runtime server

To make changes to the runtime server that is used during development (`yarn dev`) you can change the `internal/runtimeserver.js` file.