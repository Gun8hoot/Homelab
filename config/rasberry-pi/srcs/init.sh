
mkdir -p ./cryptpad/{data/blob,data/datastore,data/logs,data/pins,data/tasks,data/block}
sudo chown -R 4001:4001 ./cryptpad/data ./cryptpad/config # Match permission with the cryptpad user inside the containe
