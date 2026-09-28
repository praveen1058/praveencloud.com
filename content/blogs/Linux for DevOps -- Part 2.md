---
title: Linux for DevOps — Part 2: Files, Permissions, Users, Processes and Services
description: Working on a real Linux server: managing files and users, reading permissions, and controlling processes and services.
date: 2026-06-09
tags:
- Linux
- DevOps
- Linux Administration
cover: /images/architecture-placeholder.svg
author: Praveen Kumar
readingTime: 25 min
---

# Linux for DevOps — Part 2: Files, Permissions, Users, Processes & Services

> **DevOps Linux Series — Part 2 of 4**

In Part 1, we built a basic understanding of Linux.

We learned:

* What an operating system is
* What Linux is
* What a Linux distribution is
* Linux file-system structure
* Terminal, CLI and shell
* Basic commands such as `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `cp`, `mv` and `rm`

Now we are going to start doing things that a DevOps engineer actually does on a Linux server.

For example:

> "Create a user."

> "Give this user access to a directory."

> "Why can't this application read the configuration file?"

> "Which process is using the CPU?"

> "Is Nginx running?"

> "Install Git."

> "Restart the application."

These questions bring us to some of the most important Linux concepts:

```text
Files
  |
  v
Ownership
  |
  v
Permissions
  |
  v
Users & Groups
  |
  v
Processes
  |
  v
Services
  |
  v
Package Management
```

Let's go step by step.

---

# 1. Linux Is a Multi-User System

One important thing about Linux is that it is designed to support multiple users.

Imagine a server used by a DevOps team.

```text
                    Linux Server
                         |
          +--------------+--------------+
          |              |              |
        Alice           Bob           Jenkins
       Developer       DevOps         Service
```

Each user can have:

* Their own account
* Their own home directory
* Their own files
* Their own permissions
* Different levels of access

This is extremely important on servers.

You don't want every person or every application to have unlimited access to the entire machine.

---

# 2. Root User

Linux has a special user called:

```text
root
```

The root user has extremely powerful privileges.

Root can:

* Install software
* Create users
* Delete users
* Change ownership
* Change permissions
* Modify system configuration
* Start and stop services
* Access most files

You can think of root as the administrator of the Linux system.

```text
Regular User
     |
     | limited permissions
     v
Linux System

Root User
     |
     | very high privileges
     v
Linux System
```

Because root has so much power, you should be careful when using it.

A simple mistake as root can affect the entire server.

---

# 3. What Is `sudo`?

You will frequently see commands like:

```bash
sudo apt update
```

`sudo` allows an authorized user to execute a command with elevated privileges.

For example:

```bash
apt update
```

might require administrative permissions.

Instead of logging in as root, you can use:

```bash
sudo apt update
```

This is generally a better approach because you elevate privileges only for the command that needs them.

Think of it like this:

```text
Normal User
     |
     | sudo
     v
Administrative Command
```

---

# 4. Checking Which User You Are

Use:

```bash
whoami
```

Example:

```text
ubuntu
```

This tells you the current username.

Another useful command is:

```bash
id
```

Example:

```text
uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)
```

We will understand UID, GID and groups shortly.

---

# 5. Creating Users

As an administrator, you can create a user.

For example:

```bash
sudo useradd -m devops
```

The `-m` option creates a home directory.

You can verify:

```bash
id devops
```

And check the home directory:

```bash
ls /home
```

You might see:

```text
ubuntu
devops
```

So the user:

```text
devops
```

normally has:

```text
/home/devops
```

as its home directory.

---

# 6. Setting a User Password

To set a password:

```bash
sudo passwd devops
```

Linux will ask you to enter the password.

You can then switch to that user:

```bash
su - devops
```

Check:

```bash
whoami
```

Output:

```text
devops
```

To return to the previous shell:

```bash
exit
```

---

# 7. User ID — UID

Every Linux user has a numeric identifier called a:

**UID — User ID**

Run:

```bash
id devops
```

You might see:

```text
uid=1001(devops) gid=1001(devops) groups=1001(devops)
```

Here:

```text
1001
```

is the UID.

Linux uses the UID internally to identify the user.

The username is what humans normally see.

The UID is what the system uses to identify the account.

---

# 8. Linux Groups

Users can belong to groups.

Why?

Because permissions are often easier to manage using groups.

Imagine a company has:

```text
Alice
Bob
Charlie
```

All three need access to an application directory.

Instead of giving permissions to each user individually, create a group:

```text
developers
```

Then:

```text
developers
    |
    +--- Alice
    +--- Bob
    +--- Charlie
```

Give the group access to the application directory.

Now all three users can access it.

This becomes much easier to manage.

---

# 9. Creating a Group

Create a group:

```bash
sudo groupadd developers
```

Check:

```bash
getent group developers
```

You can add a user to the group:

```bash
sudo usermod -aG developers devops
```

The important part here is:

```text
-aG
```

It means to append the user to the supplementary group without removing existing supplementary group memberships.

Check:

```bash
groups devops
```

You might see:

```text
devops : devops developers
```

---

# 10. Why Groups Matter in DevOps

Suppose you have an application:

```text
/opt/myapp
```

You have five engineers who need access.

Instead of doing:

```text
Alice -> permissions
Bob -> permissions
Charlie -> permissions
David -> permissions
Eve -> permissions
```

you can create:

```text
appteam
```

and add everyone to it.

Then:

```text
appteam
   |
   +---- Alice
   +---- Bob
   +---- Charlie
   +---- David
   +---- Eve
```

Now permissions can be managed at the group level.

This is one of the fundamental ideas behind Linux access management.

---

# 11. Linux File Ownership

Now let's connect users and groups with files.

Run:

```bash
ls -l
```

You might see:

```text
-rw-r--r-- 1 ubuntu ubuntu 120 Jun 10 10:20 config.txt
```

There is a lot of information here.

For now, focus on:

```text
ubuntu ubuntu
```

The first `ubuntu` is the **owner**.

The second `ubuntu` is the **group owner**.

So the file has:

```text
Owner = ubuntu
Group = ubuntu
```

Every file and directory has an owner and a group.

---

# 12. Understanding `ls -l`

Let's look at this again:

```text
-rw-r--r-- 1 ubuntu ubuntu 120 Jun 10 10:20 config.txt
```

Break it down:

```text
-rw-r--r--   permissions
1            link count
ubuntu       owner
ubuntu       group
120          size
Jun 10       modification date
10:20        modification time
config.txt   filename
```

The permissions are the part we are interested in now.

```text
-rw-r--r--
```

Let's break that apart.

---

# 13. Linux Permission Structure

Linux permissions are divided into three categories:

```text
Owner
Group
Others
```

For example:

```text
-rw-r--r--
```

can be understood as:

```text
-   rw-   r--   r--
|    |     |     |
|    |     |     +---- Others
|    |     +---------- Group
|    +---------------- Owner
|
+--------------------- File type
```

The three permission groups are:

```text
Owner
Group
Others
```

---

# 14. Read, Write and Execute

There are three basic permissions:

```text
r = read
w = write
x = execute
```

Think of them simply as:

| Permission | Meaning            |
| ---------- | ------------------ |
| `r`        | Read the content   |
| `w`        | Modify the content |
| `x`        | Execute / access   |

For a regular file:

```text
r
```

means you can read it.

```text
w
```

means you can modify it.

```text
x
```

means it can be executed as a program/script when appropriate.

---

# 15. Reading a Permission String

Consider:

```text
-rwxr-xr--
```

Break it down:

```text
-    rwx    r-x    r--
     |      |      |
   Owner   Group  Others
```

Therefore:

```text
Owner  -> rwx
Group  -> r-x
Others -> r--
```

Meaning:

### Owner

```text
rwx
```

Can read, write and execute.

### Group

```text
r-x
```

Can read and execute, but cannot write.

### Others

```text
r--
```

Can only read.

---

# 16. Numeric Permissions

Linux also represents permissions using numbers.

The values are:

```text
Read     = 4
Write    = 2
Execute  = 1
```

So:

```text
rwx = 4 + 2 + 1 = 7
rw- = 4 + 2     = 6
r-x = 4 + 1     = 5
r-- = 4         = 4
-w- = 2
--x = 1
--- = 0
```

This gives us common permission combinations:

```text
755
644
700
600
```

---

# 17. Understanding `755`

Consider:

```bash
chmod 755 script.sh
```

Break down:

```text
7   5   5
|   |   |
|   |   +---- Others
|   +-------- Group
+------------ Owner
```

`7` means:

```text
rwx
```

`5` means:

```text
r-x
```

So:

```text
755
```

means:

```text
Owner  -> rwx
Group  -> r-x
Others -> r-x
```

This is a very common permission for executable scripts.

---

# 18. Understanding `644`

Consider:

```bash
chmod 644 config.txt
```

This means:

```text
Owner  -> rw-
Group  -> r--
Others -> r--
```

The owner can read and modify the file.

Everyone else can only read it.

This is a common permission pattern for regular text/configuration files.

---

# 19. Changing Permissions with `chmod`

`chmod` means:

**change mode**

Example:

```bash
chmod 755 script.sh
```

Now check:

```bash
ls -l script.sh
```

You might see:

```text
-rwxr-xr-x
```

The owner can execute the script.

---

# 20. Symbolic Permissions

You don't always need to use numbers.

You can modify permissions using letters.

For example:

```bash
chmod g-w config.yaml
```

means:

```text
Remove write permission from the group.
```

Where:

```text
u = user/owner
g = group
o = others
a = all
```

Examples:

```bash
chmod u+x script.sh
```

Add execute permission for the owner.

```bash
chmod g+w file.txt
```

Add write permission for the group.

```bash
chmod o-r file.txt
```

Remove read permission from others.

---

# 21. Changing Ownership with `chown`

Suppose a file currently belongs to:

```text
ubuntu
```

but your application should own it as:

```text
devops
```

You can use:

```bash
sudo chown devops config.yaml
```

You can also change both owner and group:

```bash
sudo chown devops:developers config.yaml
```

Now:

```text
Owner = devops
Group = developers
```

---

# 22. Why Ownership Matters for Applications

Imagine an application is running as:

```text
appuser
```

The application needs to write logs to:

```text
/opt/myapp/logs/
```

But the directory belongs to:

```text
root
```

and the application user doesn't have write permission.

The application may fail with an error such as:

```text
Permission denied
```

This is a very common Linux troubleshooting problem.

You need to understand:

```text
Who is running the application?
            |
            v
Who owns the file/directory?
            |
            v
What permissions exist?
            |
            v
Is access allowed?
```

---

# 23. Permissions on Directories

Permissions on directories are slightly different from regular files.

For a directory:

```text
r
```

generally means you can list its contents.

```text
w
```

allows creating, deleting or renaming entries, subject to other permission controls.

```text
x
```

means you can access/traverse the directory.

This is why a directory might have:

```text
drwxr-xr-x
```

The first character:

```text
d
```

means it is a directory.

---

# 24. A Practical Permissions Example

Let's create a directory:

```bash
mkdir project
```

Create a file:

```bash
touch project/config.txt
```

Check:

```bash
ls -ld project
```

and:

```bash
ls -l project
```

Now imagine you want a group called:

```text
developers
```

to work with this directory.

You can change the group:

```bash
sudo chown "$USER":developers project
```

Then you can adjust permissions according to your team's requirement.

For example:

```bash
chmod 775 project
```

This gives:

```text
Owner  -> rwx
Group  -> rwx
Others -> r-x
```

Always choose permissions based on the actual requirement rather than blindly using `777`.

---

# 25. Avoid `chmod 777`

You will sometimes see people solve permission problems with:

```bash
chmod 777 file
```

This is usually a bad habit.

`777` means:

```text
Owner  -> rwx
Group  -> rwx
Others -> rwx
```

Everyone gets full permissions.

Instead of asking:

> "How can I make this work?"

ask:

> "Who actually needs access, and what access do they need?"

This is the **principle of least privilege**.

Give only the permissions that are required.

---

# 26. Processes

So far we've talked about files and users.

Now let's talk about processes.

A **process** is a running instance of a program.

For example, when you start:

```text
Nginx
```

Linux creates one or more processes for it.

When you start:

```text
Java application
```

Linux creates a process.

When you run:

```bash
ls
```

the command also runs as a process, although usually for a very short time.

---

# 27. Process ID — PID

Every process has a unique process identifier called a:

**PID — Process ID**

You can see processes using:

```bash
ps
```

A more detailed view is:

```bash
ps aux
```

Example:

```text
USER       PID %CPU %MEM COMMAND
root         1  0.0  0.1 /sbin/init
ubuntu    1250  0.1  0.5 sshd
ubuntu    1400  0.0  0.1 bash
```

The PID is the process identifier.

---

# 28. Finding a Process

Suppose you want to know whether Nginx is running.

You can use:

```bash
ps aux | grep nginx
```

The `|` symbol is called a **pipe**.

It sends the output of one command into another command.

Here:

```text
ps aux
   |
   v
grep nginx
```

So:

```bash
ps aux | grep nginx
```

means:

> Show running processes and search the output for `nginx`.

We will use pipes frequently in Linux.

---

# 29. `top`

Another useful command is:

```bash
top
```

It shows running processes and system resource usage.

You can see information such as:

```text
CPU usage
Memory usage
Processes
Load
```

This is useful when a server suddenly becomes slow.

For example:

```text
Server is slow
     |
     v
Check CPU
     |
     v
Check memory
     |
     v
Find expensive process
     |
     v
Investigate application
```

---

# 30. `htop`

If installed, `htop` provides a more user-friendly process view.

You may need to install it:

```bash
sudo apt install htop
```

Then:

```bash
htop
```

It's not essential to know on day one, but it is a useful troubleshooting tool.

---

# 31. Killing a Process

Sometimes a process needs to be stopped.

Linux provides:

```bash
kill
```

For example:

```bash
kill 1234
```

where:

```text
1234
```

is the PID.

There are different signals that can be sent to a process.

A commonly known one is:

```bash
kill -9 1234
```

But don't use `kill -9` as your first option.

A normal termination request should generally be preferred first:

```bash
kill 1234
```

Give the process a chance to shut down cleanly.

Use stronger signals only when necessary.

---

# 32. Processes vs Services

These two terms are related but not identical.

A process is a running instance of a program.

A service is typically a long-running background component managed by the operating system's service manager.

For example:

```text
Nginx
Java Application
SSH Server
Docker
```

can run as services.

On modern Ubuntu systems, **systemd** is commonly used to manage services.

The command used to interact with it is:

```bash
systemctl
```

---

# 33. Checking a Service

Suppose Nginx is installed.

Check its status:

```bash
systemctl status nginx
```

You might see:

```text
Active: active (running)
```

That means the service is running.

If you see:

```text
inactive
```

the service isn't currently running.

---

# 34. Starting a Service

Start Nginx:

```bash
sudo systemctl start nginx
```

Check:

```bash
systemctl status nginx
```

---

# 35. Stopping a Service

Stop:

```bash
sudo systemctl stop nginx
```

---

# 36. Restarting a Service

Restart:

```bash
sudo systemctl restart nginx
```

This is commonly used after changing configuration.

For example:

```text
Change configuration
        |
        v
Restart service
        |
        v
Application uses new configuration
```

---

# 37. Reload vs Restart

Some services support configuration reloads without completely restarting the process.

For example:

```bash
sudo systemctl reload nginx
```

A reload tells the service to re-read configuration while avoiding a full stop/start when supported.

Whether reload is available and how it behaves depends on the service.

---

# 38. Enable a Service at Boot

Suppose you want Nginx to start automatically when the server boots.

Use:

```bash
sudo systemctl enable nginx
```

This configures the service to start during boot according to its systemd configuration.

To disable that behavior:

```bash
sudo systemctl disable nginx
```

Remember:

```text
start
    -> Start it now

enable
    -> Start it automatically during boot
```

They are different things.

---

# 39. A Typical Service Workflow

As a DevOps engineer, you may frequently do something like:

```bash
sudo systemctl status nginx
```

If it isn't running:

```bash
sudo systemctl start nginx
```

After changing configuration:

```bash
sudo systemctl restart nginx
```

Check again:

```bash
sudo systemctl status nginx
```

This simple workflow will become very familiar.

---

# 40. Package Management

Now we need a way to install software.

On Ubuntu, we commonly use:

```text
APT
```

APT stands for:

**Advanced Package Tool**

A package manager helps you:

* Install software
* Remove software
* Update package information
* Upgrade software
* Resolve dependencies

---

# 41. What Is a Package?

A software package contains the files and metadata needed to install a particular piece of software.

For example, instead of manually downloading and configuring every file needed by Nginx, you can use:

```bash
sudo apt install nginx
```

APT handles much of the work for you.

---

# 42. Update the Package Index

Before installing software, you will commonly run:

```bash
sudo apt update
```

This does **not** normally upgrade all installed software.

It updates the local package information from configured repositories.

Think of it as:

```text
Your Server
    |
    | "What software versions are available?"
    v
Package Repository
    |
    v
Updated Package Information
```

---

# 43. Installing Software

Install Git:

```bash
sudo apt install git
```

Or install without an interactive confirmation prompt:

```bash
sudo apt install git -y
```

Then check:

```bash
git --version
```

---

# 44. Installing Multiple Packages

You can install multiple packages in one command.

For example:

```bash
sudo apt install git curl wget -y
```

This installs:

```text
git
curl
wget
```

---

# 45. Removing Software

To remove a package:

```bash
sudo apt remove git
```

The exact effect of package removal can depend on the package and its configuration.

If you are working on a production server, understand what a package provides before removing it.

---

# 46. Upgrading Packages

To upgrade installed packages:

```bash
sudo apt upgrade
```

A common sequence is:

```bash
sudo apt update
sudo apt upgrade
```

The first command updates package information.

The second upgrades installed packages where updates are available.

---

# 47. Finding Packages

You can search for packages with:

```bash
apt search nginx
```

You can inspect package information with:

```bash
apt show nginx
```

This can help you understand what is available before installing something.

---

# 48. Where Does Linux Get Packages From?

APT normally downloads packages from configured repositories.

Conceptually:

```text
             Linux Server
                  |
                  | apt install
                  v
          Package Repository
                  |
                  v
              Package
                  |
                  v
          Installed on Server
```

A repository is a location containing software packages and package metadata.

You don't normally need to manually download every dependency.

APT helps resolve them.

---

# 49. A Simple Real-World Example

Imagine you receive a task:

> "Install Nginx on the Ubuntu server and make sure it starts automatically."

You might do:

```bash
sudo apt update
```

Then:

```bash
sudo apt install nginx -y
```

Check:

```bash
systemctl status nginx
```

Enable it at boot:

```bash
sudo systemctl enable nginx
```

If necessary:

```bash
sudo systemctl start nginx
```

Now you have combined several Linux concepts:

```text
Package Management
       |
       v
Nginx Installation
       |
       v
Service Management
       |
       v
systemctl
       |
       v
Boot Configuration
```

This is much closer to real DevOps work than simply memorizing commands.

---

# 50. Finding Where a Command Is Installed

Suppose Git is installed.

Run:

```bash
which git
```

You might get:

```text
/usr/bin/git
```

This tells you which executable would be found through your current `PATH`.

You can also use:

```bash
command -v git
```

This is often useful when troubleshooting:

> "I installed the program, but why is the shell using a different version?"

---

# 51. The `PATH` Environment Variable

When you type:

```bash
git
```

Linux needs to find the `git` executable.

It searches directories listed in the `PATH` environment variable.

Check it:

```bash
echo $PATH
```

You might see:

```text
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

The directories are separated by:

```text
:
```

So the shell searches those locations to find executable commands.

This explains why you can type:

```bash
git
```

instead of:

```bash
/usr/bin/git
```

---

# 52. Why `PATH` Matters in DevOps

Suppose you install Java manually.

You may need to configure:

```text
JAVA_HOME
PATH
```

Similarly, tools such as:

```text
Maven
Terraform
kubectl
Docker
Java
Node.js
```

may need to be available through your `PATH`.

If you see:

```text
command not found
```

one of the things to investigate is whether the program is installed and whether its executable is available through `PATH`.

---

# 53. A Practical Server Setup

Let's imagine we have a fresh Ubuntu server.

We want to prepare it for basic DevOps work.

Start by checking the user:

```bash
whoami
```

Check the current directory:

```bash
pwd
```

Update package information:

```bash
sudo apt update
```

Install common tools:

```bash
sudo apt install git curl wget -y
```

Verify:

```bash
git --version
curl --version
wget --version
```

Create a directory:

```bash
sudo mkdir -p /opt/myapp
```

Create an application user:

```bash
sudo useradd -m myapp
```

Change ownership:

```bash
sudo chown -R myapp:myapp /opt/myapp
```

Now we have a basic application directory owned by the application user.

This is the kind of thinking you should develop.

---

# 54. Why Applications Should Not Always Run as Root

Suppose you have an application called:

```text
myapp
```

You could technically run it as:

```text
root
```

But that's usually not a good security practice.

Instead, create a dedicated user:

```text
myapp
```

Then run the application as:

```text
myapp
```

Now if the application is compromised, its permissions are limited by the permissions of the `myapp` user.

Conceptually:

```text
Bad Practice

Application
     |
     v
   root
     |
     v
Almost everything


Better Practice

Application
     |
     v
  appuser
     |
     v
Only required resources
```

This is another example of least privilege.

---

# 55. A Very Common Linux Problem

Imagine your application gives you:

```text
Permission denied
```

Don't immediately run:

```bash
sudo chmod 777 ...
```

Instead investigate.

Ask:

### 1. Who am I?

```bash
whoami
```

### 2. Who owns the file?

```bash
ls -l config.yaml
```

### 3. What permissions exist?

```bash
ls -l config.yaml
```

### 4. Which user is running the application?

Check the process/service configuration.

### 5. Does that user have the required access?

This thought process is far more valuable than memorizing a particular `chmod` command.

---

# 56. A Simple Permission Troubleshooting Flow

```text
        Permission denied
                |
                v
        Who is accessing it?
                |
                v
         whoami / process
                |
                v
        Who owns the file?
                |
                v
          ls -l file
                |
                v
        What permissions?
                |
                v
        Owner / Group / Others
                |
                v
      Fix only what's required
```

This is a useful troubleshooting habit.

---

# 57. Important Commands from Part 2

Here are the commands you should practice.

## Users

```bash
whoami
id
sudo useradd -m username
sudo passwd username
su - username
```

## Groups

```bash
sudo groupadd developers
sudo usermod -aG developers username
groups username
```

## Permissions

```bash
ls -l
chmod 755 script.sh
chmod 644 config.txt
chmod u+x script.sh
```

## Ownership

```bash
chown
```

Example:

```bash
sudo chown user:group file
```

## Processes

```bash
ps
ps aux
top
```

## Services

```bash
systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
sudo systemctl disable nginx
```

## Packages

```bash
sudo apt update
sudo apt install <package>
sudo apt remove <package>
sudo apt upgrade
apt search <package>
```

---

# 58. Hands-On Lab

Now let's do one complete exercise.

The goal is to create a small application environment.

---

## Step 1 — Create an Application User

```bash
sudo useradd -m appuser
```

Check:

```bash
id appuser
```

---

## Step 2 — Create an Application Group

```bash
sudo groupadd appteam
```

Add the user:

```bash
sudo usermod -aG appteam appuser
```

Check:

```bash
groups appuser
```

---

## Step 3 — Create the Application Directory

```bash
sudo mkdir -p /opt/myapp/{config,logs,scripts}
```

You should now have:

```text
/opt/myapp
├── config
├── logs
└── scripts
```

---

## Step 4 — Change Ownership

```bash
sudo chown -R appuser:appteam /opt/myapp
```

Check:

```bash
ls -l /opt
```

And:

```bash
ls -l /opt/myapp
```

---

## Step 5 — Create a Configuration File

```bash
sudo touch /opt/myapp/config/application.conf
```

Add some content:

```bash
echo "APP_ENV=development" | sudo tee /opt/myapp/config/application.conf
```

Read it:

```bash
cat /opt/myapp/config/application.conf
```

---

## Step 6 — Create a Script

Create:

```bash
sudo touch /opt/myapp/scripts/start.sh
```

Add:

```bash
echo '#!/bin/bash' | sudo tee /opt/myapp/scripts/start.sh
echo 'echo "Application starting..."' | sudo tee -a /opt/myapp/scripts/start.sh
```

Make it executable:

```bash
sudo chmod 755 /opt/myapp/scripts/start.sh
```

Check:

```bash
ls -l /opt/myapp/scripts/start.sh
```

---

## Step 7 — Run the Script

```bash
/opt/myapp/scripts/start.sh
```

Output:

```text
Application starting...
```

Congratulations.

You just combined:

```text
User
Group
Directory
Ownership
Permissions
Script
```

These are core Linux administration concepts.

---

# 59. Another Hands-On Lab — Install Nginx

If you're using an Ubuntu VM or EC2 instance, try:

```bash
sudo apt update
```

Install:

```bash
sudo apt install nginx -y
```

Check:

```bash
systemctl status nginx
```

Find the executable:

```bash
which nginx
```

Check the process:

```bash
ps aux | grep nginx
```

Check whether it starts automatically:

```bash
systemctl is-enabled nginx
```

You have now connected:

```text
APT
 |
 +---- Install Nginx
 |
 v
systemd
 |
 +---- Manage Nginx
 |
 v
Process
 |
 +---- Nginx running
 |
 v
Network
 |
 +---- Web traffic
```

---

# 60. What You Should Understand — Not Just Memorize

At the end of this part, you should be able to explain these concepts in your own words.

### User

A person or service account that interacts with the Linux system.

### Group

A way to organize users and manage permissions collectively.

### Root

The highly privileged administrative account.

### `sudo`

A mechanism that allows authorized users to execute commands with elevated privileges.

### Ownership

Every file and directory has an owner and a group.

### Permissions

Control what owners, groups and others can do with files and directories.

### Process

A running instance of a program.

### PID

The numeric identifier of a process.

### Service

A long-running system component typically managed by a service manager such as systemd.

### `systemctl`

A command used to manage systemd services.

### Package Manager

A tool such as APT used to install and manage software packages.

---

# 61. DevOps Mental Model

When you log into a Linux server, don't think:

> "Which command should I type?"

Instead think:

> "What am I trying to find out?"

For example:

### Problem

> The application is not working.

Think:

```text
Is the application running?
        |
        v
Is the service running?
        |
        v
Check systemctl
        |
        v
Is the process running?
        |
        v
Check ps / top
        |
        v
Are permissions correct?
        |
        v
Check ls -l
        |
        v
Are configuration files correct?
        |
        v
Check /etc or application directory
        |
        v
Are there useful logs?
        |
        v
Check /var/log or application logs
```

This is the beginning of Linux troubleshooting.

---

# 62. Part 1 + Part 2 So Far

At this point, your Linux knowledge should look something like this:

```text
                 Linux
                   |
       +-----------+-----------+
       |                       |
    File System              Users
       |                       |
       |                    Groups
       |                       |
       v                       v
    Files                 Permissions
    Directories                |
       |                       |
       +-----------+-----------+
                   |
                Processes
                   |
                Services
                   |
             Package Manager
```

This is a much stronger foundation for DevOps.

---

# 63. What Comes Next?

We have learned how to work locally on a Linux machine.

But DevOps engineers rarely manage just one local machine.

They work with remote servers.

For example:

```text
Your Laptop
     |
     | SSH
     v
AWS EC2 Server
     |
     +---- Web Application
     |
     +---- Database
     |
     +---- Docker
     |
     +---- Monitoring
```

So in **Part 3**, we will focus on remote Linux administration.

We will cover:

```text
SSH
 |
 +---- Password Authentication
 |
 +---- SSH Keys
 |
 +---- Public Key
 |
 +---- Private Key
 |
 +---- authorized_keys
 |
 +---- known_hosts
 |
 +---- SSH Configuration
 |
 +---- SCP
 |
 +---- Remote Server Management
 |
 +---- Basic Networking
 |
 +---- IP Address
 |
 +---- Ports
 |
 +---- Firewall
```

This is where Linux starts connecting directly with AWS and real DevOps work.

---

# Quick Revision

Before moving to Part 3, make sure you understand this:

```text
Linux Server
     |
     +---- Users
     |      |
     |      +---- Groups
     |
     +---- Files
     |      |
     |      +---- Owner
     |      +---- Group
     |      +---- Permissions
     |
     +---- Processes
     |
     +---- Services
     |
     +---- Packages
```

And remember these commands:

```bash
whoami
id
groups

ls -l

chmod
chown

ps
top

systemctl

apt
```

You don't have to memorize every option.

Understand what each command is used for.

---

# Final Thought

Linux administration is not about knowing hundreds of commands.

It's about understanding the relationship between:

```text
Users
   |
Groups
   |
Permissions
   |
Files
   |
Processes
   |
Services
   |
Applications
```

Once this relationship becomes clear, Linux becomes much easier.

And that's exactly what a DevOps engineer needs.

You don't need to be a Linux kernel expert.

You need to be comfortable enough to log into a server, understand what's happening, make a change safely, troubleshoot a problem, and automate repetitive work.

That's the goal of this series.

---

## Linux for DevOps — 4-Part Series

```text
PART 1
Linux Fundamentals
        |
        v
PART 2
Files, Permissions, Users, Processes & Services
        |
        v
PART 3
SSH, Remote Servers & Networking
        |
        v
PART 4
Bash Scripting & DevOps Automation
```

**Practice everything in this article on an Ubuntu VM or a disposable cloud server before moving to Part 3.**
