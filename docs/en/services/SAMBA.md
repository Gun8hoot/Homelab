<div align="center">
	<h1>Samba</h1>
</div>

Samba is an SMB/CIFS file server. This container exports a shared folder that every device on my network (laptops, phones, the Proxmox host) can mount as a network drive, without any extra client software — SMB is natively supported by Windows, macOS and most Linux desktops.

<div align="center">
	<h2>Configuration</h2>
</div>

```yaml
  samba:
    image: dockurr/samba
    container_name: homelab-samba
    environment:
      UID: "1000"
      GID: "1000"
      NAME: ${SMB_NAME}
      USER: ${SMB_USER}
      PASS: ${SMB_PASS}
    ports:
      - 445:445
    volumes:
      - ${SMB_PATH}:/shared
    restart: always
    networks:
      - network_access
```

`image: dockurr/samba` : A minimal Samba image that auto-creates the share and the user from the environment variables, no config file needed<br>
`environment:` : `NAME` is the share name clients see, `USER`/`PASS` the credentials they must provide (both defined in the [`.env` file](../../../config/.env.template)), and `UID`/`GID` map the files written by clients to my user on the host, so no permission fights<br>
`ports: 445:445` : The standard SMB port, published so LAN devices outside Docker can connect<br>
`volumes:` : The directory at `${SMB_PATH}` on the host is mounted at `/shared` and becomes the share content — files written by clients land directly in that folder<br>
`restart: always` : The container restarts automatically after a crash or a reboot<br>

<div align="center">
	<h2>Usage</h2>
</div>

From a file manager, connect to the share with:

```
smb://<host-ip>/<SMB_NAME>       # Linux / macOS
\\<host-ip>\<SMB_NAME>           # Windows
```

and authenticate with the `SMB_USER` / `SMB_PASS` credentials.

<h2>Notes</h2>

- SMBv1 is a frequent attack vector; the image only enables modern dialects, and the port is reachable only inside my LAN (it's not routed through WireGuard by default).
- Since the share points at a real host directory, anything already present there is immediately visible to clients — mounting `${SMB_PATH}` to an existing folder is the easiest way to expose existing files.
