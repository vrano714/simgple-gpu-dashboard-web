# Simple GPU utilization dashboard

Tiny toy using React MUI and Python + Shell scripts

![Image](https://github.com/user-attachments/assets/3784dade-3f42-481c-8376-f17c259f9327)

## Preparation

### Download files

If just using download zip from release.

If considering modify, clone this repository.  
(And build client side with `npm run build`)

At the machine which you host this dashboard, place files like this:  
(just uncompress zip should make this structure)

```
.
├── app.py
├── dist (includes client code)
│
├── get_gpu_utilization.sh
├── hosts.txt
├── id_gpu_check
├── id_gpu_check.pub
└── servers
    ├── alpha
    │   └── status.txt
    ├── bravo
    │   └── status.txt
    ├── charlie
    │   └── status.txt
```

### Set up target machines to accept public key auth for SSH

Target machines (for monitoring) should accept publickey authentication.

Generate SSH key pair at your side and confirm that an account can log-in with that key.  
(Log-in at least one to avoid host key verification dialog!)

Then *write the account info and the location of the key in `server/get_gpu_utilizaation.sh`*.

### Set up a Python environment

Make an environment with your favorite way and install `flask` and `flask-cors`.

Typically, this should be done by `pip3 install flask flask-cors`.

## Run and view

At the machine which you host this dashboard, navigate to `server` directory and run `python3 app.py`  
(note that this project just use flask's dev mode, which may be not suitable for production use)

Then with your browser, access `http://your.host.machines.ip:9999/index.html` (write IP address instead of `your.host.machines.ip`)  
For example, if the machine's IP is `192.168.100.254`, the URL should be `http://192.168.100.254:9999/index.html`
