import flask
from flask_cors import CORS

import subprocess
import signal

# change working directory to the directory of this file
import os
os.chdir(os.path.dirname(__file__))

host_config = "hosts.txt"
ssh_script = "./get_gpu_utilization.sh"

app = flask.Flask(
    __name__, 
    static_folder="dist",
    static_url_path=''
)
CORS(app)

@app.route("/")
def root():
    return flask.redirect("/index.html") 

@app.route('/data')
def get_gpu_utilization():
    ret = {}
    # TODO: nested with is not needed
    # by just put hostnames in ret when processing host_config
    with open(host_config, "r") as f:
        for line in f:
            line = line.replace("\n", "")
            # skip empty lines and comments
            if not line or line[0] == "#":
                continue
            hostname = line.split(",")[0]
            print(hostname)
            with open("./servers/" + hostname + "/status.txt", "r") as f2:
                for line2 in f2:
                    line2 = line2.replace("\n", "")
                    if not line2:
                        continue
                    sp = line2.split(",")
                    print(sp)
                    ret[hostname + "#" + sp[0]] ={
                        "name": sp[1].replace(" NVIDIA ", ""),
                        "VRAM(free)": sp[2][1:],
                        "VRAM(used)": sp[3][1:],
                        "VRAM(total)": sp[4][1:],
                        "util(compute)": sp[5][1:],
                        "util(vram)": sp[6][1:],
                        "temp": sp[7][1:],
                        "fan_speed": sp[8][1:],
                        "poll_time": sp[9][1:],
                    }
            print("")
    return flask.jsonify(ret)

def timer_run(signum, frame):
    # TODO should use paramiko instead of running shell script via subprocess?
    # Popen does not block, so flask will continue to run
    subprocess.Popen(ssh_script)

if __name__ == '__main__':
    signal.signal(signal.SIGALRM, timer_run)
    # 0.1s to first run, then every 5 minutes
    signal.setitimer(signal.ITIMER_REAL, 0.1, 5 * 60)

    # do not use in production!
    app.run(host="0.0.0.0", port=9999)
