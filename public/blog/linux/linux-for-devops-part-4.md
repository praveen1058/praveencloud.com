---
title: Linux for DevOps — Part 4: Networking, SSH and Managing Remote Servers
description: Linux networking essentials, SSH key-based access, and the day-to-day workflow of managing remote Linux servers.
date: 2026-06-23
tags:
- Linux
- Networking
- SSH
- DevOps
cover: /images/architecture-placeholder.svg
author: Praveen Kumar
readingTime: 18 min
---

# Linux for DevOps — Part 4

## Networking, SSH & Managing Remote Linux Servers

> **Linux for DevOps Series — Part 4 of 4**

If you have followed the first three parts, you already know the Linux basics:

* How Linux works
* Common Linux commands
* Files and directories
* Users and groups
* File permissions
* Package management
* Processes and services
* Basic Bash scripting

Now we move to something that is extremely important for a DevOps engineer:

> **How do Linux servers communicate with each other, and how do we manage a server remotely?**

In real DevOps work, you will rarely sit in front of the production server.

You will normally have something like:

```text
Your Laptop
     |
     | SSH
     v
 Linux Server
     |
     +---- Application
     |
     +---- Database
     |
     +---- Logs
     |
     +---- Docker
     |
     +---- Other Servers
```

So in this final part, we will focus on:

1. Basic networking
2. IP addresses
3. Ports
4. DNS
5. Firewalls
6. SSH
7. SSH keys
8. SCP
9. Basic network troubleshooting
10. Linux server security
11. How all of this fits into a DevOps role

---

# 1. Why Does a DevOps Engineer Need Networking?

Imagine you have a web application running on one server.

Your users are somewhere else.

They need to access your application.

So the request has to travel through a network.

For example:

```text
User
 |
 | HTTPS
 v
Internet
 |
 v
AWS Load Balancer
 |
 v
Web Server
 |
 v
Application Server
 |
 v
Database Server
```

A DevOps engineer does not necessarily need to become a network engineer.

But you **must understand the basics**.

You should be comfortable answering questions such as:

* What is an IP address?
* What is a port?
* What is DNS?
* What is a subnet?
* What is a firewall?
* What is SSH?
* Why can't I connect to my server?
* Why is my application not reachable?
* Why does `curl localhost:8080` work but the browser cannot access it?

These are common DevOps problems.

---

# 2. What Is an IP Address?

An IP address identifies a device/interface on a network.

For example:

```text
192.168.1.10
```

Another server could have:

```text
192.168.1.20
```

The machines can communicate with each other using their network addresses.

For IPv4, an address contains 32 bits.

For example:

```text
192.168.1.10
```

Each section is called an octet.

```text
192   .   168   .   1   .   10
```

Each octet can have a value from:

```text
0 - 255
```

---

# 3. Private vs Public IP

This is especially important when working with AWS.

A server can have a **private IP address** and, depending on the setup, a **public IP address**.

For example:

```text
Private IP:
172.31.10.25

Public IP:
13.x.x.x
```

The private IP is generally used for communication inside the private network.

The public IP allows communication from outside through the appropriate network configuration.

A simplified AWS architecture could look like:

```text
                  Internet
                     |
                     |
              Public IP
                     |
              +-------------+
              |   Server    |
              |             |
              | Private IP  |
              | 172.31.x.x  |
              +-------------+
```

---

# 4. What Is a Port?

An IP address identifies the machine.

A port identifies the network service on that machine.

Think of it like this:

```text
IP Address = Building address

Port = Door inside the building
```

A server can run many services at the same time.

For example:

```text
Server
 |
 +-- SSH       -> 22
 |
 +-- HTTP      -> 80
 |
 +-- HTTPS     -> 443
 |
 +-- Tomcat    -> 8080
 |
 +-- MySQL     -> 3306
 |
 +-- PostgreSQL-> 5432
```

So:

```text
192.168.1.10:22
```

means:

> Connect to port 22 on the server with IP `192.168.1.10`.

---

# 5. Common Ports You Should Know

You don't need to memorize hundreds of ports.

For DevOps, know the commonly used ones.

| Service    |      Port |
| ---------- | --------: |
| SSH        |        22 |
| HTTP       |        80 |
| HTTPS      |       443 |
| DNS        |        53 |
| MySQL      |      3306 |
| PostgreSQL |      5432 |
| Tomcat     |      8080 |
| Jenkins    |      8080 |
| Docker API | 2375/2376 |

> The actual port can be changed in the application's configuration. These are common defaults.

---

# 6. What Is DNS?

Suppose you want to visit:

```text
www.example.com
```

Computers communicate using IP addresses.

So somehow:

```text
www.example.com
```

needs to be converted into something like:

```text
93.184.216.34
```

This is the job of **DNS — Domain Name System**.

Think of DNS as the phonebook of the internet.

```text
Domain Name
     |
     | DNS lookup
     v
IP Address
```

For example:

```text
example.com
     |
     v
93.184.216.34
```

Your browser can then communicate with the destination server.

---

# 7. DNS in a DevOps Environment

Imagine your application is deployed on:

```text
13.200.100.50
```

You don't want users to remember the IP address.

Instead, you create:

```text
myapp.example.com
```

DNS points the domain to the appropriate destination.

So users access:

```text
https://myapp.example.com
```

instead of:

```text
http://13.200.100.50
```

A simplified flow:

```text
User
 |
 | myapp.example.com
 v
DNS
 |
 | IP address
 v
Server / Load Balancer
 |
 v
Application
```

---

# 8. Basic Networking Commands

Linux provides many commands to troubleshoot networking.

Some useful ones are:

```bash
ip addr
```

or:

```bash
ip a
```

This shows network interfaces and IP addresses.

---

## Check the Routing Table

```bash
ip route
```

This helps you understand where network traffic is going.

---

## Test Connectivity

A common command is:

```bash
ping google.com
```

It can help determine whether a host is reachable.

For example:

```bash
ping -c 4 google.com
```

The `-c 4` option sends four packets.

---

# 9. Check DNS Resolution

Use:

```bash
nslookup google.com
```

or:

```bash
dig google.com
```

If DNS is working, you should receive information about the domain.

For example:

```text
google.com -> IP address
```

---

# 10. `curl` — Extremely Useful for DevOps

One command you should become comfortable with is:

```bash
curl
```

It is commonly used to make HTTP requests.

For example:

```bash
curl http://example.com
```

You can also check whether your local application is responding:

```bash
curl http://localhost:8080
```

This is extremely useful.

Imagine your application is running on port `8080`.

You execute:

```bash
curl http://localhost:8080
```

and receive a response.

That tells us:

> The application is responding locally.

But suppose the browser cannot access it.

Now we know the problem may be somewhere between the outside network and the server.

For example:

```text
Browser
   |
   X
   |
Firewall / Security Group
   |
   |
Server
   |
   v
Application :8080
```

This is how DevOps engineers troubleshoot problems — by checking each layer.

---

# 11. Check Listening Ports

Another useful command is:

```bash
ss -tulpn
```

It can show listening network sockets.

For example, you may see:

```text
LISTEN
0.0.0.0:22
0.0.0.0:80
0.0.0.0:8080
```

This tells you that services are listening on those ports.

A simpler command is:

```bash
ss -lntp
```

---

# 12. Firewall — What Is It?

A firewall controls network traffic.

Think of a firewall as a security guard.

```text
Internet
   |
   |
   v
+-----------+
| Firewall  |
+-----------+
   |
   |
   v
Server
```

The firewall can decide:

```text
Allow
or
Block
```

For example:

```text
Allow TCP 22
Allow TCP 80
Allow TCP 443
Block everything else
```

This means:

* SSH is allowed
* HTTP is allowed
* HTTPS is allowed
* Other traffic may be blocked

---

# 13. AWS Security Groups

When working with AWS EC2, you will commonly configure a **Security Group**.

For example:

```text
Inbound Rules

SSH      TCP 22    Your IP
HTTP     TCP 80    0.0.0.0/0
HTTPS    TCP 443   0.0.0.0/0
```

A common mistake is opening everything:

```text
0.0.0.0/0
```

on every port.

Don't do this unless there is a very specific reason.

For SSH, it is much better to restrict access to trusted IP addresses or networks where possible.

---

# 14. SSH — Secure Shell

Now we reach one of the most important Linux concepts for DevOps.

**SSH = Secure Shell**

SSH allows you to connect to another computer securely.

For example:

```text
Your Laptop
     |
     | SSH
     v
Ubuntu Server
```

You can then execute commands on the remote server.

---

# 15. Basic SSH Command

The basic syntax is:

```bash
ssh username@server-ip
```

For example:

```bash
ssh ubuntu@13.126.190.242
```

Your computer connects to:

```text
13.126.190.242
```

using:

```text
username = ubuntu
port = 22
```

unless another SSH configuration is specified.

---

# 16. SSH Using a Private Key

Cloud servers commonly use SSH key authentication.

For example:

```bash
ssh -i AWS_MLOps_KeyPair.pem ubuntu@13.126.190.242
```

Here:

```text
-i
```

specifies the private key file.

The flow is:

```text
Your Laptop
     |
     | Private Key
     |
     | SSH
     v
Linux Server
     |
     | Checks authorized public key
     v
Access Granted
```

---

# 17. Public Key vs Private Key

This is very important.

An SSH key pair contains:

```text
Private Key
Public Key
```

For example:

```text
id_ed25519
id_ed25519.pub
```

The private key:

```text
id_ed25519
```

must remain secret.

The public key:

```text
id_ed25519.pub
```

can be placed on the server.

Think of it like this:

```text
PRIVATE KEY
     |
     +---- Your secret
     |
     +---- Never share

PUBLIC KEY
     |
     +---- Goes to server
```

---

# 18. Generate an SSH Key

On your Linux machine:

```bash
ssh-keygen -t ed25519
```

You will normally get:

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

Check:

```bash
ls -la ~/.ssh
```

---

# 19. `authorized_keys`

On the server, authorized public keys are commonly stored in:

```bash
~/.ssh/authorized_keys
```

For example:

```text
Server
 |
 +-- /home/ubuntu/.ssh/
       |
       +-- authorized_keys
```

The server checks whether the connecting client has the corresponding private key.

---

# 20. SSH Key Permissions

SSH is strict about permissions.

For example:

```bash
chmod 700 ~/.ssh
```

and:

```bash
chmod 600 ~/.ssh/authorized_keys
```

For a private key:

```bash
chmod 600 ~/.ssh/id_ed25519
```

When using an AWS `.pem` file, you may commonly see:

```bash
chmod 400 AWS_MLOps_KeyPair.pem
```

---

# 21. SCP — Copy Files Over SSH

SSH is not only for logging into servers.

You can also transfer files.

One common command is:

```bash
scp
```

For example:

```bash
scp application.jar ubuntu@13.126.190.242:/home/ubuntu/
```

This means:

```text
Local Machine
     |
     | application.jar
     | SCP / SSH
     v
Remote Server
     |
     +-- /home/ubuntu/application.jar
```

---

# 22. Copy a Directory

Use:

```bash
scp -r myapp ubuntu@13.126.190.242:/home/ubuntu/
```

The `-r` means recursive.

It allows the directory and its contents to be copied.

---

# 23. A Real DevOps Example

Imagine a Java application.

The developer creates:

```text
myapp.jar
```

The application needs to be deployed to a server.

A simple manual process could be:

```text
Developer
    |
    v
Build application
    |
    v
myapp.jar
    |
    | SCP
    v
Linux Server
    |
    v
Restart application
```

For example:

```bash
scp myapp.jar ubuntu@server:/opt/myapp/
```

Then SSH:

```bash
ssh ubuntu@server
```

And restart the service:

```bash
sudo systemctl restart myapp
```

Later, instead of doing this manually, we automate it using:

```text
Jenkins
Ansible
Docker
Kubernetes
CI/CD
```

This is where Linux knowledge becomes extremely useful.

---

# 24. Authentication vs Authorization

These two terms are often confused.

## Authentication

Authentication asks:

> **Who are you?**

Examples:

```text
Username + Password
SSH Key
MFA
Certificate
```

---

## Authorization

Authorization asks:

> **What are you allowed to do?**

For example:

```text
Developer
    |
    +-- Read application logs
    +-- Restart application

Junior Admin
    |
    +-- Manage application
    +-- Limited sudo

Senior Admin
    |
    +-- Full administration
```

Linux permissions, groups and `sudo` are all part of access control.

---

# 25. Linux Server Security

As a DevOps engineer, security should not be an afterthought.

Some basic practices:

### 1. Don't use root for everything

Prefer:

```bash
sudo command
```

instead of always working as root.

---

### 2. Use strong authentication

Prefer SSH keys where appropriate.

---

### 3. Protect private keys

Never commit:

```text
.pem
.key
id_rsa
id_ed25519
```

to Git repositories.

---

### 4. Keep packages updated

For Ubuntu:

```bash
sudo apt update
```

and:

```bash
sudo apt upgrade
```

---

### 5. Close unnecessary ports

If your server doesn't need a service, don't expose its port.

---

### 6. Restrict SSH access

SSH is powerful.

Don't unnecessarily expose port `22` to everyone.

---

### 7. Use least privilege

Give users only the permissions they actually need.

---

# 26. A Simple Linux Troubleshooting Approach

This is one of the most useful things you can learn.

Suppose someone says:

> "The application is down."

Don't immediately restart everything.

Start checking step by step.

---

## Step 1 — Is the Server Reachable?

Try:

```bash
ping server-ip
```

or:

```bash
ssh user@server-ip
```

---

## Step 2 — Is the Application Running?

Check the service:

```bash
systemctl status myapp
```

---

## Step 3 — Is the Application Listening?

Use:

```bash
ss -lntp
```

Look for the expected port.

For example:

```text
8080
```

---

## Step 4 — Test Locally

Run:

```bash
curl http://localhost:8080
```

If this works:

```text
Application
    |
    v
Working locally
```

Then investigate network access.

---

## Step 5 — Check Firewall / Security Group

Ask:

```text
Is port 8080 allowed?
```

If this is an AWS server:

```text
EC2
 |
 +-- Security Group
       |
       +-- Inbound Rules
```

---

## Step 6 — Check Application Logs

For a systemd service:

```bash
journalctl -u myapp
```

Or:

```bash
journalctl -u myapp -f
```

The `-f` option follows new log entries.

---

# 27. Troubleshooting Flow

A useful mental model:

```text
             Application Problem
                     |
                     v
              Is server reachable?
                /            \
              No              Yes
              |                |
        Check network       Is service running?
                               /       \
                             No         Yes
                             |           |
                        Check logs    Is port listening?
                                         /       \
                                       No         Yes
                                       |           |
                                  Fix service   Test locally
                                                   |
                                                   v
                                            curl localhost:PORT
                                                   |
                                           +-------+-------+
                                           |               |
                                         Works          Doesn't work
                                           |               |
                                      Check firewall     App issue
                                      / security group
```

This type of structured troubleshooting is much more useful than randomly running commands.

---

# 28. Linux in a Typical DevOps Environment

Let's put everything together.

Imagine a company has:

```text
                 Internet
                     |
                     v
               Load Balancer
                     |
          +----------+----------+
          |                     |
          v                     v
      Server 1              Server 2
          |                     |
          +----------+----------+
                     |
                     v
                Application
                     |
                     v
                 Database
```

A DevOps engineer may need to:

* SSH into servers
* Install packages
* Configure users
* Set permissions
* Manage services
* Check logs
* Troubleshoot networking
* Deploy applications
* Configure firewalls
* Automate repetitive tasks
* Monitor systems

Linux is underneath many of these activities.

---

# 29. Where Bash Fits Into DevOps

Suppose you have 20 servers.

You need to install:

```text
Git
Java
Docker
Nginx
```

Doing it manually:

```text
Server 1 -> commands
Server 2 -> commands
Server 3 -> commands
...
Server 20 -> commands
```

That's repetitive.

Instead, you can create automation.

```text
Bash Script
     |
     +---- Install packages
     +---- Create directories
     +---- Create users
     +---- Configure files
     +---- Start services
```

Later, you may replace or complement this with tools such as:

```text
Ansible
Terraform
Jenkins
Docker
Kubernetes
```

But the underlying Linux concepts are still important.

---

# 30. What Linux Knowledge Does a DevOps Engineer Actually Need?

This is probably the most important question in this entire series.

You **do not need to become a Linux kernel developer** to start a DevOps career.

You should be comfortable with the following.

## Level 1 — Must Know

```text
pwd
ls
cd
mkdir
touch
cp
mv
rm
cat
less
grep
find
```

You should know how to navigate and work with files.

---

## Level 2 — Must Know

```text
chmod
chown
users
groups
sudo
```

You should understand permissions and access.

---

## Level 3 — Must Know

```text
apt
systemctl
journalctl
ps
top
df
du
free
```

You should be able to install software, manage services and inspect system resources.

---

## Level 4 — Must Know

```text
ssh
scp
ip
ss
ping
curl
dig
```

You should be comfortable connecting to servers and doing basic network troubleshooting.

---

## Level 5 — Must Know

Bash fundamentals:

```text
Variables
Conditions
Loops
Functions
Arguments
Exit codes
Pipes
Redirection
```

You don't need to write huge applications in Bash.

But you should be able to automate simple operational tasks.

---

# 31. What You Don't Need to Master Initially

As a beginner DevOps engineer, don't get stuck trying to master every Linux topic.

You don't initially need deep knowledge of:

```text
Linux kernel development
Kernel modules
Advanced filesystem internals
Writing device drivers
Advanced network protocol implementation
Kernel scheduling algorithms
```

Those are valuable areas, but they are not prerequisites for becoming productive in DevOps.

Focus on:

> **Using Linux to manage, deploy, troubleshoot and automate systems.**

---

# 32. The DevOps Linux Skill Map

Here's a practical way to remember it.

```text
                 LINUX
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
    Files        Users       Network
       |           |           |
       v           v           v
 Permissions    Groups        SSH
       |           |           |
       +-----------+-----------+
                   |
                   v
              Services
                   |
                   v
               Packages
                   |
                   v
              Bash Scripts
                   |
                   v
              Automation
                   |
                   v
                DevOps
```

---

# 33. Final Hands-On Project

If you want to test whether you actually understand the Linux basics, build this small project.

## Goal

Create a Linux server and deploy a simple application.

### Step 1 — Create an Ubuntu EC2 Instance

Create:

```text
Ubuntu Server
```

---

### Step 2 — Connect Using SSH

```bash
ssh -i key.pem ubuntu@SERVER_IP
```

---

### Step 3 — Update Packages

```bash
sudo apt update
```

---

### Step 4 — Install Nginx

```bash
sudo apt install nginx -y
```

---

### Step 5 — Check the Service

```bash
systemctl status nginx
```

---

### Step 6 — Test Locally

```bash
curl http://localhost
```

You should receive the web server response.

---

### Step 7 — Check the Port

```bash
ss -lntp
```

Look for port:

```text
80
```

---

### Step 8 — Configure AWS Security Group

Allow:

```text
HTTP
TCP
80
```

from the appropriate source.

---

### Step 9 — Open the Public IP

Open:

```text
http://SERVER_PUBLIC_IP
```

You should see the Nginx welcome page.

---

# 34. Final Challenge

Now try to do the same thing without following a tutorial.

Create a new server and:

```text
1. Connect using SSH
2. Create a new Linux user
3. Create an application directory
4. Change its ownership
5. Create a simple HTML file
6. Install Nginx
7. Configure Nginx
8. Start the service
9. Check the service
10. Check the listening port
11. Test using curl
12. Test from your browser
13. Check the logs
```

If you can do this comfortably, you are already moving beyond "I know Linux commands" toward:

> **I can work with a Linux server.**

That is the skill a DevOps engineer actually needs.

---

# 35. Linux → DevOps: What's Next?

Linux is not the final destination.

It is the foundation.

A typical DevOps learning journey can look like:

```text
Linux
  |
  v
Networking Basics
  |
  v
Git
  |
  v
Bash
  |
  v
AWS / Cloud
  |
  v
Docker
  |
  v
Jenkins / CI-CD
  |
  v
Terraform
  |
  v
Ansible
  |
  v
Kubernetes
  |
  v
Monitoring
  |
  v
Production DevOps
```

And notice something important.

Linux doesn't disappear.

Even after learning:

```text
AWS
Docker
Kubernetes
Terraform
Jenkins
```

you will still encounter:

```text
Linux servers
Processes
Ports
Files
Permissions
Logs
SSH
Networking
Shell commands
```

That's why Linux is such an important foundation for DevOps.

---

# 36. Final Takeaways

If you remember only a few things from this four-part Linux series, remember these:

### 1. Linux is a working environment, not just a list of commands.

Learn how the pieces fit together.

### 2. Files and permissions matter.

A large part of Linux administration involves managing:

```text
Files
Users
Groups
Permissions
```

### 3. Learn SSH properly.

Most remote Linux administration starts with:

```bash
ssh user@server
```

### 4. Understand ports and networking.

When an application doesn't work, ask:

```text
Is the server reachable?
Is the service running?
Is the port listening?
Is the firewall allowing it?
Is the application responding?
```

### 5. Learn Bash for automation.

If you repeat the same commands every day, there is probably an opportunity to automate them.

### 6. Don't try to become a Linux expert before becoming a DevOps engineer.

You need **practical Linux skills**.

Your goal should be:

> **"Give me a Linux server and I should be able to connect, understand what's running, manage files and users, troubleshoot basic problems, install software, check logs, and automate repetitive tasks."**

Once you can do that, you have a solid Linux foundation for DevOps.

---

# Linux for DevOps — 4-Part Series Complete

```text
PART 1
Linux Fundamentals
       |
       v
PART 2
Files, Permissions & Users
       |
       v
PART 3
Bash & Automation
       |
       v
PART 4
Networking, SSH & Server Management
       |
       v
========================
     DEVOPS FOUNDATION
========================
```

## Keep Practicing

Don't just read these commands.

Open a Linux machine.

Run them.

Break something in a safe lab.

Fix it.

That is how Linux becomes a skill instead of just another topic on your resume.

---

## Quick Revision Cheat Sheet

```bash
# System
hostname
whoami
id
pwd

# Files
ls -la
cd
mkdir
touch
cp
mv
rm
cat
less

# Permissions
chmod
chown

# Users
useradd
passwd
usermod
groups

# Packages
sudo apt update
sudo apt install <package>

# Services
systemctl status <service>
sudo systemctl start <service>
sudo systemctl stop <service>
sudo systemctl restart <service>

# Logs
journalctl -u <service>
journalctl -u <service> -f

# Networking
ip addr
ip route
ss -lntp
ping
curl
nslookup
dig

# Remote Access
ssh user@server
scp file user@server:/path/

# Bash
echo
read
if
for
while
function
$1
$2
$#
$@
```

---

# End of Part 4

**Linux is the foundation. DevOps is what you build on top of it.**
