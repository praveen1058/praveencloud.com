---
title: Linux for DevOps — Part 1: Understanding Linux Before You Start Using It
description: Operating systems, distributions, the Linux file-system layout, and the first commands every DevOps engineer needs.
date: 2026-06-02
tags:
- Linux
- DevOps
cover: /images/architecture-placeholder.svg
author: Praveen Kumar
readingTime: 19 min
---

# Linux for DevOps — Part 1: Understanding Linux Before You Start Using It

> **DevOps Linux Series — Part 1 of 4**

If you are learning DevOps, sooner or later you will spend a lot of time on Linux servers.

You might SSH into a server, install a package, check a log file, change permissions, restart a service, or troubleshoot an application that is not working.

At first, Linux can feel confusing.

There are commands everywhere:

```bash
ls
cd
pwd
cat
grep
chmod
chown
sudo
systemctl
ssh
```

And then you see directories such as:

```text
/etc
/var
/usr
/opt
/home
/tmp
```

The good news is that you **do not need to become a Linux expert to start working as a DevOps engineer**.

You need a solid understanding of the fundamentals and enough hands-on practice to work comfortably on a server.

This is the first part of a four-part Linux series for DevOps.

---

# What We Will Learn

In this first part, we will build the foundation.

We will understand:

* What an operating system is
* What Linux actually is
* Linux vs Windows
* What a Linux distribution means
* Linux architecture
* The terminal, shell and CLI
* The Linux file system
* Important Linux directories
* Files and hidden files
* Basic navigation commands
* Creating, reading and deleting files
* Why Linux is important for DevOps

We are **not** trying to memorize hundreds of commands.

The goal is to understand how Linux works so that the commands start making sense.

---

# 1. What Is an Operating System?

Let's start from the beginning.

A computer has hardware:

```text
CPU
RAM
Hard Disk / SSD
Network Card
Keyboard
Mouse
Display
```

Applications need to use this hardware.

For example, a browser needs:

* CPU to execute instructions
* RAM to store working data
* Storage to save files
* Network access to communicate with websites

But it would be messy if every application had to communicate directly with hardware.

Imagine a browser saying:

> "Give me CPU core 2."

Then another application says:

> "I need the same CPU."

Then another application tries to directly access RAM.

That would become difficult very quickly.

This is where the **Operating System (OS)** comes in.

The operating system sits between applications and hardware.

```text
             Applications
                  |
        +---------+---------+
        |                   |
      Browser            Jenkins
        |                   |
        +---------+---------+
                  |
             Operating
               System
                  |
        +---------+---------+
        |         |         |
       CPU       RAM      Storage
```

The OS manages hardware resources and provides services that applications can use.

Examples of operating systems include:

* Windows
* macOS
* Linux
* Android
* iOS

---

# 2. What Does an Operating System Actually Do?

An operating system has many responsibilities.

For DevOps, you should understand these five particularly well.

## 1. Process Management

The CPU executes processes.

If multiple applications are running, the OS decides how CPU time is shared between them.

For example:

```text
Application A
Application B
Application C
Application D
```

The CPU switches between processes extremely quickly.

You don't normally notice this switching.

---

## 2. Memory Management

Applications need RAM to work.

The OS manages which applications can use which parts of memory.

```text
RAM
+-----------------------+
| Browser               |
+-----------------------+
| Jenkins               |
+-----------------------+
| Database              |
+-----------------------+
| Operating System      |
+-----------------------+
```

RAM is limited, so the OS has to manage it carefully.

---

## 3. Storage Management

The OS manages data stored on disks.

For example:

```text
Application files
Configuration files
Logs
Images
Videos
Database files
```

---

## 4. Device Management

The OS communicates with hardware devices using drivers.

Examples:

```text
Keyboard
Network Card
USB Device
Printer
Disk
```

---

## 5. Security and Permissions

The OS controls who can access what.

For example:

```text
User A -> Can read the file
User B -> Can modify the file
User C -> Cannot access the file
```

This becomes extremely important when managing production servers.

---

# 3. So What Exactly Is Linux?

Linux is commonly referred to as an operating system, but technically **Linux itself is the kernel**.

The kernel is the core part of the operating system.

It communicates with hardware and manages resources such as:

* CPU
* Memory
* Storage
* Networking
* Processes
* Devices
* Security

A simplified view looks like this:

```text
+----------------------------------+
|          Applications            |
|  Browser | Git | Jenkins | Nginx |
+----------------------------------+
|              Shell              |
+----------------------------------+
|          Linux Kernel            |
+----------------------------------+
|             Hardware             |
|      CPU | RAM | Disk | NIC      |
+----------------------------------+
```

You will often hear people say:

> "I am using Linux."

That's perfectly normal.

In practice, when people say Linux, they usually mean a complete Linux-based operating system distribution.

---

# 4. What Is a Linux Distribution?

You may have heard names like:

```text
Ubuntu
Debian
Fedora
Red Hat Enterprise Linux
Rocky Linux
AlmaLinux
```

These are Linux distributions, often called **distros**.

A distribution combines the Linux kernel with other software required to provide a usable operating system.

For example:

```text
             Ubuntu
                |
      +---------+---------+
      |                   |
 Linux Kernel         Applications
      |                   |
      +---------+---------+
                |
        Package Manager
                |
        System Utilities
```

Different distributions may use different package managers, default configurations and software versions.

For example:

| Distribution | Package Manager |
| ------------ | --------------- |
| Ubuntu       | `apt`           |
| Debian       | `apt`           |
| RHEL         | `dnf`           |
| Fedora       | `dnf`           |
| Rocky Linux  | `dnf`           |

For this series, we will mainly use **Ubuntu**, because it is widely used and is a good distribution for learning Linux and DevOps.

---

# 5. Linux vs Windows

If you have used Windows, Linux may initially look very different.

On Windows you might see:

```text
C:\
D:\
E:\
```

Linux uses a different file system structure.

Linux has **one root directory**:

```text
/
```

Everything starts from this root.

For example:

```text
/
├── home
├── etc
├── var
├── usr
├── opt
├── tmp
└── root
```

Think of `/` as the starting point of the entire Linux file system.

---

# 6. The Linux File System

One of the most important things to understand is that Linux uses a hierarchical file system.

It looks like a tree.

```text
/
├── bin
├── boot
├── dev
├── etc
├── home
│   ├── ubuntu
│   └── devops
├── opt
├── tmp
├── usr
└── var
```

There is one root:

```text
/
```

Everything else exists somewhere below it.

---

# 7. Important Linux Directories

You don't need to memorize every Linux directory.

For DevOps, start with these.

---

## `/home`

This is where normal users usually have their home directories.

For example:

```text
/home/ubuntu
/home/devops
/home/testuser
```

If your username is `ubuntu`, your home directory is commonly:

```text
/home/ubuntu
```

You can also use:

```bash
~
```

as shorthand for your home directory.

For example:

```bash
cd ~
```

---

## `/root`

This is the home directory of the root user.

It is different from:

```text
/
```

The root directory is:

```text
/
```

The root user's home directory is:

```text
/root
```

These two terms are easy to confuse.

---

## `/etc`

This directory contains many system and application configuration files.

For example:

```text
/etc/ssh
/etc/nginx
/etc/hosts
```

As a DevOps engineer, you will frequently work with configuration files under `/etc`.

---

## `/var`

`/var` contains data that changes while the system is running.

One particularly important location is:

```text
/var/log
```

This is where many system and application logs are stored.

For example:

```text
/var/log/
```

When troubleshooting a Linux server, logs are often one of the first places you investigate.

---

## `/tmp`

Used for temporary files.

Files stored here are generally considered temporary.

```text
/tmp
```

---

## `/usr`

Contains many user-space programs, libraries and related files.

You will often see:

```text
/usr/bin
/usr/lib
/usr/local
```

Don't worry about understanding every directory under `/usr` yet.

---

## `/opt`

Often used for optional or third-party software.

For example, an organization might install a custom application under:

```text
/opt/myapp
```

---

# 8. "Everything Is a File" in Linux

You will often hear this statement:

> **Everything is a file in Linux.**

Don't take this too literally.

It means Linux represents many different resources through file-like interfaces.

Normal files are obvious:

```text
config.yaml
application.log
script.sh
```

Directories are also represented through the file system.

Linux also exposes things such as devices through special file interfaces.

For example:

```text
/dev
```

contains device-related entries.

This idea is one reason Linux provides a very consistent way of interacting with different resources.

---

# 9. What Is the Terminal?

Now let's talk about something you will use every day as a DevOps engineer.

The **terminal**.

A terminal is the interface through which you interact with the command line.

You type:

```bash
ls
```

and see the result.

For example:

```text
$ ls
app
config
logs
script.sh
```

The terminal itself is not the shell.

This distinction is useful.

---

# 10. Terminal vs Shell vs CLI

These three terms are often mixed together.

## CLI

CLI means:

**Command Line Interface**

It is an interface where you interact with a computer by typing commands instead of clicking graphical elements.

---

## Terminal

The terminal is the program/window through which you interact with the command line.

Examples include terminal applications on Linux, macOS and Windows.

---

## Shell

The shell is the program that interprets the commands you type.

Common shells include:

```text
sh
bash
zsh
fish
```

Bash is especially important in DevOps.

Bash stands for:

**Bourne Again SHell**

A simplified flow is:

```text
You type a command
        |
        v
     Terminal
        |
        v
       Shell
        |
        v
      Kernel
        |
        v
     Hardware
```

For example:

```bash
ls
```

You type `ls`.

The shell interprets the command and asks the operating system to perform the required operation.

---

# 11. Why Do DevOps Engineers Use the CLI So Much?

This is an important question.

Why not just use a graphical interface?

Because servers are often managed through the command line.

A production server might not have a desktop GUI installed at all.

You may connect to it using:

```bash
ssh user@server
```

and see:

```text
Welcome to Ubuntu

user@server:~$
```

That's it.

No desktop.

No mouse.

Just the command line.

And that's completely normal in server environments.

---

# 12. Why CLI Is Useful in DevOps

The command line is powerful because you can:

### Work quickly

Instead of opening multiple screens, you can run commands directly.

### Automate work

Commands can be placed inside scripts.

```bash
#!/bin/bash

apt update
apt install nginx
systemctl restart nginx
```

### Perform bulk operations

You can operate on many files or servers programmatically.

### Work remotely

You can manage a server without being physically near it.

This is one of the biggest reasons CLI skills are important for DevOps.

---

# 13. Your First Linux Commands

Let's start with a small set of commands.

Don't try to memorize 100 commands.

Learn these first.

---

# `pwd` — Where Am I?

`pwd` means:

**Print Working Directory**

Run:

```bash
pwd
```

Example:

```text
/home/ubuntu
```

It tells you where you currently are.

This is one of the first commands you should run when you're unsure about your current location.

---

# `ls` — What Is Here?

Run:

```bash
ls
```

Example:

```text
app
config
logs
script.sh
```

It lists files and directories in the current location.

---

## `ls -l`

Run:

```bash
ls -l
```

This gives a detailed listing.

Example:

```text
-rw-r--r-- 1 ubuntu ubuntu 120 Jun 10 10:20 config.txt
drwxr-xr-x 2 ubuntu ubuntu 4096 Jun 10 10:21 logs
```

We'll learn what these permissions mean in Part 2.

---

## `ls -la`

Run:

```bash
ls -la
```

This also shows hidden files.

---

# 14. Hidden Files

In Linux, a file whose name starts with `.` is generally treated as a hidden file.

For example:

```text
.bashrc
.profile
.gitconfig
```

You won't normally see these with:

```bash
ls
```

Use:

```bash
ls -la
```

to see them.

You will encounter hidden configuration files frequently when working with Linux and development tools.

For example:

```text
~/.ssh
~/.bashrc
~/.gitconfig
```

---

# 15. `cd` — Change Directory

To move to another directory:

```bash
cd /etc
```

Now check:

```bash
pwd
```

You should see:

```text
/etc
```

---

## Go Back One Level

```bash
cd ..
```

If you are here:

```text
/home/ubuntu
```

and run:

```bash
cd ..
```

you will move to:

```text
/home
```

---

## Go Home

You can run:

```bash
cd ~
```

or simply:

```bash
cd
```

---

## Go to Root

```bash
cd /
```

Then:

```bash
pwd
```

Output:

```text
/
```

---

# 16. Absolute Path vs Relative Path

This is an important concept.

An **absolute path** starts from `/`.

Example:

```text
/home/ubuntu/app/config.yaml
```

A **relative path** starts from your current directory.

Suppose you are here:

```text
/home/ubuntu
```

and there is an `app` directory.

You can use:

```bash
cd app
```

That's a relative path.

Or:

```bash
cd /home/ubuntu/app
```

That's an absolute path.

Think about it this way:

```text
Absolute path
     |
     v
Starts from /

Relative path
     |
     v
Starts from where you currently are
```

---

# 17. Creating Directories

Use:

```bash
mkdir
```

For example:

```bash
mkdir devops
```

Now:

```bash
ls
```

You should see:

```text
devops
```

---

## Creating Nested Directories

You can use:

```bash
mkdir -p devops/linux/scripts
```

This creates:

```text
devops
└── linux
    └── scripts
```

The `-p` option creates parent directories when necessary.

---

# 18. Creating Files

Use:

```bash
touch
```

Example:

```bash
touch notes.txt
```

Check:

```bash
ls
```

You should see:

```text
notes.txt
```

`touch` is commonly used to create an empty file, although it can also update a file's timestamps.

---

# 19. Writing Something Into a File

You can use `echo`.

```bash
echo "Hello Linux"
```

This simply prints:

```text
Hello Linux
```

To write it to a file:

```bash
echo "Hello Linux" > notes.txt
```

Now read the file:

```bash
cat notes.txt
```

Output:

```text
Hello Linux
```

---

# 20. `>` vs `>>`

This is important.

## `>`

The `>` operator writes output to a file and replaces the existing content.

Example:

```bash
echo "Line 1" > notes.txt
```

Then:

```bash
echo "Line 2" > notes.txt
```

The file now contains only:

```text
Line 2
```

---

## `>>`

The `>>` operator appends to the file.

Example:

```bash
echo "Line 1" > notes.txt
echo "Line 2" >> notes.txt
```

Now:

```text
Line 1
Line 2
```

Remember:

```text
>   Replace
>>  Append
```

---

# 21. Reading Files

The simplest command is:

```bash
cat notes.txt
```

For a small file, this is fine.

But if the file is large, you don't necessarily want to print the entire thing on the screen.

That's where commands such as:

```bash
less
```

become useful.

Example:

```bash
less /var/log/syslog
```

You can move through the file and exit with:

```text
q
```

---

# 22. Copying Files

Use:

```bash
cp
```

Example:

```bash
cp notes.txt notes_backup.txt
```

Now:

```bash
ls
```

You should see:

```text
notes.txt
notes_backup.txt
```

---

# 23. Moving and Renaming Files

Use:

```bash
mv
```

For example:

```bash
mv notes.txt linux_notes.txt
```

This renames the file.

You can also move it:

```bash
mv linux_notes.txt /tmp/
```

So `mv` is used for both:

```text
Move
Rename
```

---

# 24. Deleting Files

Use:

```bash
rm
```

Example:

```bash
rm linux_notes.txt
```

The file is deleted.

Be careful with `rm`.

There is usually no recycle bin like you may be used to on a desktop operating system.

---

# 25. Deleting Directories

An empty directory can be removed with:

```bash
rmdir directory_name
```

For directories containing files, you may see:

```bash
rm -r directory_name
```

You will also commonly see:

```bash
rm -rf directory_name
```

Be **very careful** with this command.

`rm -rf` can recursively remove files and directories without asking for confirmation.

Before running a destructive command, especially with `sudo`, stop and check:

```bash
pwd
```

and:

```bash
ls
```

A small mistake in a production environment can become a big problem.

---

# 26. A Small Practice Session

Let's put everything together.

Create a practice directory:

```bash
mkdir linux-practice
```

Enter it:

```bash
cd linux-practice
```

Check where you are:

```bash
pwd
```

Create a file:

```bash
touch notes.txt
```

Write something:

```bash
echo "I am learning Linux for DevOps" > notes.txt
```

Read it:

```bash
cat notes.txt
```

Add another line:

```bash
echo "Linux is important for DevOps" >> notes.txt
```

Read again:

```bash
cat notes.txt
```

Create a backup:

```bash
cp notes.txt notes_backup.txt
```

List everything:

```bash
ls -l
```

You should have:

```text
notes.txt
notes_backup.txt
```

Now rename the backup:

```bash
mv notes_backup.txt backup.txt
```

Finally:

```bash
ls -l
```

You should see:

```text
backup.txt
notes.txt
```

That's already a useful first Linux exercise.

---

# 27. Linux Directory Practice

Now let's create something closer to a DevOps project.

Run:

```bash
mkdir -p devops-project/{app,config,logs,scripts}
```

The structure becomes:

```text
devops-project/
├── app/
├── config/
├── logs/
└── scripts/
```

Create some files:

```bash
touch devops-project/config/application.conf
touch devops-project/logs/application.log
touch devops-project/scripts/deploy.sh
```

Now:

```bash
ls -R devops-project
```

You should see something similar to:

```text
devops-project:
app
config
logs
scripts

devops-project/app:

devops-project/config:
application.conf

devops-project/logs:
application.log

devops-project/scripts:
deploy.sh
```

This is the type of structure you will encounter when working with applications on Linux servers.

---

# 28. Why Does This Matter for DevOps?

Imagine your application is running on a Linux server.

Something goes wrong.

Your first questions might be:

> Where is the application?

> Where is its configuration?

> Where are its logs?

> Which user is running it?

> What permissions does it have?

> Which process is running?

> Which port is it listening on?

> Is the service running?

Linux knowledge allows you to answer these questions.

For example, you might eventually work with:

```text
Application
    |
    +---- Configuration -> /etc
    |
    +---- Application -> /opt
    |
    +---- Logs -> /var/log
    |
    +---- User -> application user
    |
    +---- Process -> Linux process
    |
    +---- Port -> Network port
```

You don't need to know everything today.

You just need to start building this mental model.

---

# 29. Linux and DevOps

Why is Linux so important in DevOps?

Because a huge amount of modern infrastructure runs on Linux.

You will encounter Linux in:

```text
AWS EC2
Docker
Kubernetes
Jenkins
Nginx
Apache
Databases
CI/CD servers
Monitoring systems
Cloud infrastructure
```

Even when you use a tool such as Docker or Kubernetes, understanding the underlying Linux system makes troubleshooting much easier.

For example:

```text
Kubernetes
     |
     v
Container
     |
     v
Linux
     |
     v
CPU / Memory / Network / Storage
```

Linux is one of the foundations underneath modern infrastructure.

---

# 30. What You Should Know After Part 1

At this point, you should be comfortable explaining:

### What is an OS?

Software that manages hardware resources and provides services to applications.

### What is Linux?

Linux is the kernel at the core of Linux-based operating systems.

### What is Ubuntu?

A Linux distribution that uses the Linux kernel and provides a complete operating-system environment.

### What is the root directory?

```text
/
```

The starting point of the Linux file system.

### What is the home directory?

Usually:

```text
/home/<username>
```

### What is `/etc`?

A major location for system and application configuration.

### What is `/var/log`?

A common location for system and application logs.

### What is the CLI?

Command Line Interface — an interface where we interact with the system using commands.

### What is a shell?

A program that interprets commands, such as Bash.

### What is SSH?

A protocol commonly used to securely connect to remote servers.

We will cover SSH properly in Part 3.

---

# 31. Commands You Should Practice

Don't just read these.

Open an Ubuntu terminal and actually run them.

```bash
pwd
ls
ls -la
cd
cd /
cd ~
cd ..
mkdir
touch
cat
cp
mv
rm
echo
less
```

If you can comfortably use these commands without constantly searching for them, you have made a good start.

---

# 32. Don't Try to Memorize Linux

This is probably the most important advice in this entire article.

You don't need to memorize every Linux command.

Even experienced engineers search for commands when they need them.

What matters is understanding the concepts.

For example, if someone tells you:

> "The application log is under `/var/log`."

You should understand what that means.

If someone says:

> "The application is running as the `appuser` user."

You should understand why that matters.

If someone says:

> "Check the configuration under `/etc`."

You should know where `/etc` is.

Once the mental model is clear, learning commands becomes much easier.

---

# 33. What Comes Next?

In **Part 1**, we focused on understanding Linux and navigating the system.

In **Part 2**, we will start working more like a Linux administrator.

We will cover:

```text
Files & Directories
        |
        v
Permissions
        |
        v
Users
        |
        v
Groups
        |
        v
sudo
        |
        v
Ownership
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

These are the skills you will use constantly while working with Linux servers.

---

# Quick Revision

```text
Operating System
        |
        v
Manages hardware + provides services
        |
        v
Linux
        |
        v
Kernel
        |
        v
Linux Distribution
        |
        +---- Ubuntu
        +---- Debian
        +---- RHEL
        +---- Fedora
        |
        v
Shell
        |
        v
Commands
        |
        v
Linux File System
        |
        +---- /
        +---- /home
        +---- /etc
        +---- /var
        +---- /opt
        +---- /tmp
```

And the first commands to remember:

```bash
pwd       # Where am I?
ls        # What is here?
cd        # Move somewhere
mkdir     # Create a directory
touch     # Create a file
cat       # Read a file
cp        # Copy
mv        # Move / rename
rm        # Delete
```

---

# Final Thought

Linux can look complicated when you first see it.

Don't try to understand everything at once.

Start with a simple mental model:

> **Linux is the environment where many of our applications and infrastructure components run.**

As a DevOps engineer, your job is not to become a Linux kernel developer.

Your job is to be comfortable enough with Linux to:

* Navigate a server
* Find files
* Read configuration
* Read logs
* Understand users
* Manage permissions
* Run commands
* Install software
* Manage services
* Troubleshoot problems
* Automate repetitive work

That is the level of Linux knowledge we are building throughout this four-part series.

**Learn the fundamentals. Practice on a real Linux machine. Then build on top of them.**

---

## Linux for DevOps — 4-Part Series

```text
PART 1
Linux Fundamentals
        |
        v
PART 2
Files, Permissions, Users & Services
        |
        v
PART 3
SSH, Remote Servers & Networking
        |
        v
PART 4
Bash Scripting & DevOps Automation
```

Start with Part 1, practice the commands yourself, and don't move forward until the Linux terminal feels a little less unfamiliar.
