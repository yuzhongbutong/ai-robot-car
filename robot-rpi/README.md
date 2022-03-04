# robot-rpi

## Run App

```bash
# python V3.7
python -m venv venv
```

```bash
# Windows
.\venv\Scripts\activate

# Linux
source ./venv/bin/activate
```

```bash
pip install -r requirements.txt
```

## Install Raspbian

```bash
# x64 bit
https://www.raspberrypi.com/software/operating-systems/
# unzip package
# Write the img to SD card.
```

## Remote rpi

```bash
# ssh
sudo apt update
sudo apt install openssh-server
sudo systemctl start ssh
sudo systemctl enable ssh
```

```bash
# xrdp
sudo apt install xrdp
```