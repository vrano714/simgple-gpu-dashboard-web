#!/bin/bash

INFILE="hosts.txt"
SSHUSER="someuser"
# ssh key (private key) for above user
IDENTITYFILE="./id_gpu_check"

# cd to the dir of this file
cd "$(dirname "$0")" || exit 1

# read hostname and address from INFILE,
# (which does not start with comment '#')
# then nvidia-smi via ssh
cat $INFILE | grep -v "#" | while IFS=',' read -r host address; do
    if [ -z "$host" ] || [ -z "$address" ]; then
        continue
    fi
    echo -n "retrieving from $host($address)... "
    gpu_report=$(ssh $SSHUSER@$address -n -i $IDENTITYFILE -o "ConnectTimeout 60" nvidia-smi --query-gpu=index,name,memory.free,memory.used,memory.total,utilization.gpu,utilization.memory,temperature.gpu,fan.speed,timestamp --format=csv,noheader)
    if [ $? -eq 0 ]; then
        echo "success"
    else
        echo "failed"
    fi
    if [ ! -d "./$host/status.txt" ]; then
        mkdir -p ./servers/$host
    fi
    # echo "$gpu_report"
    echo ""
    echo "$gpu_report" > ./servers/$host/status.txt
done

