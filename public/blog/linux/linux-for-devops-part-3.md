---
title: Linux for DevOps — Part 3: Users, Groups, Permissions and SSH
description: How Linux manages users, groups and file permissions, plus connecting to remote servers securely with SSH.
date: 2026-06-16
tags:
- Linux
- SSH
- DevOps
cover: /images/architecture-placeholder.svg
author: Praveen Kumar
readingTime: 16 min
---

# Linux for DevOps — Part 3: Users, Groups, Permissions & SSH

> **Linux for DevOps Series — Part 3**
>
> In this part, we will learn how Linux manages users, groups, file permissions, and how DevOps engineers securely connect to remote servers using SSH.

---

## Before We Start

If you are learning Linux for a **DevOps role**, you don't need to become a Linux administrator on day one.

But you should be comfortable answering questions like:

* Who am I logged in as?
* Who owns this file?
* Why can't I edit this file?
* How do I give another user access?
* What is `sudo`?
* How do I create a Linux user?
* How do I connect to another server?
* What is an SSH key?
* Where is the SSH public key stored?
* Why does SSH use port 22?

These are everyday tasks when working with servers.

---

# 1. Linux Users

A Linux server can have many users.

For example, imagine a company has this server:

```text
                 Linux Server
                      |
        +-------------+-------------+
        |             |             |
      Alice         Bob           Jenkins
        |             |             |
     Developer     DevOps        Automation
```

Each user can have:

* A username
* A user ID
* A home directory
* Groups
* Permissions

The important idea is:

> **Don't give everyone access to everything.**

Linux uses users, groups, and permissions to control access.

---

# 2. Who Am I?

The first command you should know is:

```bash
whoami
```

Example:

```bash
$ whoami
ubuntu
```

This tells you the username of the user currently running the shell.

This is especially useful when working with `sudo`, SSH, and multiple users.

---

# 3. User ID — UID

Linux internally identifies users using a number called a **UID**.

UID means:

```text
User ID
```

For example:

```text
ubuntu     -> UID 1000
devops     -> UID 1001
john       -> UID 1002
```

You normally work with the username, but Linux uses the UID internally.

Check a user's information:

```bash
id ubuntu
```

Example output:

```text
uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu),27(sudo)
```

Don't worry if this looks confusing initially.

The important part is:

```text
uid=1000
```

That's the user's UID.

---

# 4. The Root User

Linux has a special user called:

```text
root
```

The root user is the superuser.

Root has extremely powerful permissions.

For example, root can:

* Create users
* Delete users
* Install software
* Change file ownership
* Change permissions
* Start and stop services
* Modify system configuration

The root user normally has:

```text
UID = 0
```

You can think of it like this:

```text
Regular User
     |
     | limited permissions
     v
+-------------------+
| Linux Server      |
+-------------------+

Root User
     |
     | almost unrestricted
     v
+-------------------+
| Linux Server      |
+-------------------+
```

Because root has so much power, we should avoid using it unnecessarily.

---

# 5. What is sudo?

You will frequently see commands like:

```bash
sudo apt update
```

What does `sudo` mean?

It allows an authorized user to execute a command with elevated privileges.

For example:

```bash
apt update
```

may fail because a normal user does not have permission to modify the system package database.

So we use:

```bash
sudo apt update
```

The command is executed with elevated privileges.

Think of it as:

```text
Normal User
     |
     | sudo
     v
Administrative Permission
```

---

# 6. Creating a User

As an administrator, you can create a user:

```bash
sudo useradd -m devops
```

The `-m` option creates a home directory.

You can verify the user:

```bash
id devops
```

You can also check:

```bash
ls /home
```

You may see:

```text
ubuntu
devops
```

The new user's home directory is:

```text
/home/devops
```

---

# 7. Setting a Password

To set a password:

```bash
sudo passwd devops
```

Linux will ask you to enter the password.

Example:

```text
New password:
Retype new password:
passwd: password updated successfully
```

---

# 8. Switching Users

You can switch to another user using:

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

# 9. Linux Groups

Now imagine you have 20 developers.

You don't want to give permissions to each developer individually.

Instead, create a group:

```text
developers
```

Then add users to the group:

```text
developers
   |
   +-- Alice
   +-- Bob
   +-- Charlie
   +-- David
```

Now you can give permissions to the group.

This is much easier to manage.

---

# 10. Creating a Group

Create a group:

```bash
sudo groupadd developers
```

Verify:

```bash
getent group developers
```

---

# 11. Adding a User to a Group

Suppose we have a user:

```text
devops
```

Add the user to the `developers` group:

```bash
sudo usermod -aG developers devops
```

The important part is:

```text
-aG
```

It means we are adding the user to an additional group.

Check:

```bash
groups devops
```

or:

```bash
id devops
```

---

# 12. Why Groups Matter in DevOps

Imagine a deployment directory:

```text
/opt/myapp
```

Suppose five developers need access.

Instead of doing:

```text
Give Alice access
Give Bob access
Give Charlie access
Give David access
Give Eve access
```

Create a group:

```text
developers
```

Add everyone:

```text
Alice
Bob
Charlie
David
Eve
```

Then give the group permission.

This is much easier to manage.

---

# 13. Linux File Ownership

Let's look at a file:

```bash
ls -l
```

Example:

```text
-rw-r--r-- 1 ubuntu developers 120 Jun 10 10:30 app.conf
```

There is a lot of information here.

The important part for now is:

```text
ubuntu developers
```

That means:

```text
Owner = ubuntu
Group = developers
```

Every file has an owner and a group.

---

# 14. Linux Permissions

The first part:

```text
-rw-r--r--
```

contains the permissions.

Let's break it down.

```text
-rw-r--r--
 |||||||||
 |||||||||
 ||||||||+--- Others
 ||||||+----- Others
 |||||+------ Others
 |||+-------- Group
 ||+--------- Group
 |+---------- Group
 +----------- Owner
```

A simpler way to remember it:

```text
        Owner    Group    Others
          |        |        |
          v        v        v
        rw-      r--      r--
```

There are three permission categories:

```text
Owner
Group
Others
```

And three basic permissions:

```text
r = read
w = write
x = execute
```

---

# 15. Read Permission

`r` means read.

For a normal file, read permission means:

> The user can view the contents of the file.

For example:

```bash
cat app.conf
```

If you don't have read permission, Linux may show:

```text
Permission denied
```

---

# 16. Write Permission

`w` means write.

It allows a user to modify the contents of a file.

For example:

```bash
vi app.conf
```

If you don't have write permission, you may not be able to save changes.

---

# 17. Execute Permission

`x` means execute.

For a script:

```bash
./deploy.sh
```

the script needs execute permission when run directly this way.

For example:

```bash
chmod +x deploy.sh
```

Then:

```bash
./deploy.sh
```

can execute it.

---

# 18. Understanding 755

You will see permissions such as:

```bash
chmod 755 script.sh
```

But what does `755` mean?

Linux represents permissions numerically.

```text
r = 4
w = 2
x = 1
```

So:

```text
rwx = 4 + 2 + 1 = 7
rw- = 4 + 2     = 6
r-x = 4     + 1 = 5
r-- = 4         = 4
```

Therefore:

```text
755
```

means:

```text
Owner  -> 7 -> rwx
Group  -> 5 -> r-x
Others -> 5 -> r-x
```

So:

```text
755
```

is:

```text
rwxr-xr-x
```

---

# 19. Understanding 644

Another very common permission is:

```text
644
```

Break it down:

```text
Owner  -> 6 -> rw-
Group  -> 4 -> r--
Others -> 4 -> r--
```

So:

```text
644
```

means:

```text
rw-r--r--
```

This is common for regular configuration or text files.

---

# 20. Changing Permissions — chmod

The command used to change permissions is:

```bash
chmod
```

For example:

```bash
chmod 755 deploy.sh
```

Check the result:

```bash
ls -l deploy.sh
```

You may see:

```text
-rwxr-xr-x
```

---

# 21. Changing Ownership — chown

The command used to change ownership is:

```bash
chown
```

Example:

```bash
sudo chown devops app.conf
```

Now `devops` becomes the owner.

You can change both owner and group:

```bash
sudo chown devops:developers app.conf
```

Now:

```text
Owner = devops
Group = developers
```

---

# 22. A Practical Example

Let's create a small project directory:

```bash
sudo mkdir /opt/myapp
```

Create a configuration file:

```bash
sudo touch /opt/myapp/app.conf
```

Check:

```bash
ls -l /opt/myapp
```

You may see something like:

```text
-rw-r--r-- 1 root root 0 Jun 10 11:00 app.conf
```

The owner is:

```text
root
```

The group is:

```text
root
```

Now change the ownership:

```bash
sudo chown devops:developers /opt/myapp/app.conf
```

Check again:

```bash
ls -l /opt/myapp
```

Now you should see:

```text
devops developers
```

This is a very common type of task on Linux servers.

---

# 23. Authentication vs Authorization

This distinction is very important for DevOps interviews.

## Authentication

Authentication answers:

> **Who are you?**

Examples:

```text
Username + Password
SSH Key
MFA
Certificate
```

## Authorization

Authorization answers:

> **What are you allowed to do?**

Examples:

```text
File permissions
Groups
sudo
IAM policies
```

Think about logging into a server.

First:

```text
Authentication
      |
      v
"Are you really Alice?"
      |
      v
       YES
```

Then:

```text
Authorization
      |
      v
"What is Alice allowed to access?"
```

---

# 24. Now Let's Talk About SSH

SSH is one of the most important Linux concepts for DevOps.

SSH stands for:

```text
Secure Shell
```

It allows us to securely connect to another computer over a network.

For example:

```text
Your Laptop
     |
     | SSH
     |
     v
Linux Server
```

Once connected, you can execute commands on the remote server.

---

# 25. Why Do DevOps Engineers Need SSH?

Imagine you have a server running in AWS.

You are sitting at home.

You don't physically have access to the server.

How do you manage it?

Using SSH.

For example:

```text
Laptop
   |
   | Internet
   |
   | SSH
   v
AWS EC2
```

You can then:

* Install software
* Check logs
* Restart services
* Deploy applications
* Modify configuration
* Check disk space
* Troubleshoot problems

---

# 26. SSH Client and SSH Server

SSH follows a client-server model.

```text
+----------------+             +----------------+
| SSH Client     |             | SSH Server     |
|                |             |                |
| Your Laptop    | ----------> | Linux Server   |
+----------------+     SSH     +----------------+
```

Your computer runs the SSH client.

The remote Linux server runs an SSH server.

---

# 27. SSH Port

The standard SSH port is:

```text
22
```

So you can think of:

```text
Server
  |
  +---- Port 22 -> SSH
```

When connecting through a cloud provider such as AWS, the firewall/security rules must allow the required SSH traffic.

---

# 28. Basic SSH Command

The basic syntax is:

```bash
ssh username@server-ip
```

For example:

```bash
ssh ubuntu@203.0.113.10
```

Here:

```text
ubuntu
    -> username

203.0.113.10
    -> server IP
```

---

# 29. SSH Using a Private Key

Cloud servers often use SSH keys instead of passwords.

For example:

```bash
ssh -i my-key.pem ubuntu@203.0.113.10
```

Here:

```text
-i my-key.pem
```

tells SSH which private key to use.

---

# 30. What Is an SSH Key Pair?

An SSH key pair contains two keys:

```text
SSH Key Pair
     |
     +----------------+
     |                |
     v                v
Private Key       Public Key
```

The private key must remain secret.

The public key can be shared with the server.

Think of it like a lock and key:

```text
Public Key
    |
    | installed on server
    v
+-------------------+
| Linux Server      |
|                   |
|     🔒 Lock       |
+-------------------+

Private Key
    |
    | kept by you
    v
🔑
```

The private key proves that you are authorized to use the corresponding public key.

---

# 31. Private Key vs Public Key

This is extremely important.

### Private Key

Example:

```text
id_ed25519
```

or sometimes:

```text
my-server.pem
```

Keep it secret.

Never:

```text
Upload to GitHub
Send on WhatsApp
Put in a public folder
Share with everyone
Commit into Git
```

### Public Key

Example:

```text
id_ed25519.pub
```

This can be installed on the server.

---

# 32. Where Does Linux Store SSH Keys?

The default SSH directory is:

```bash
~/.ssh
```

For example:

```text
/home/ubuntu/.ssh
```

or:

```text
/home/devops/.ssh
```

Common files include:

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
~/.ssh/authorized_keys
~/.ssh/known_hosts
```

---

# 33. `authorized_keys`

On the server, authorized public keys are commonly stored in:

```text
~/.ssh/authorized_keys
```

For example:

```text
/home/ubuntu/.ssh/authorized_keys
```

The server checks this file when someone attempts key-based authentication.

Conceptually:

```text
Your Laptop
    |
    | Private Key
    |
    v
Linux Server
    |
    | checks
    v
authorized_keys
```

If the key matches an authorized public key, authentication can succeed.

---

# 34. Generating an SSH Key

On your local machine:

```bash
ssh-keygen -t ed25519
```

You will normally get:

```text
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

Remember:

```text
id_ed25519
      |
      +--> PRIVATE KEY

id_ed25519.pub
      |
      +--> PUBLIC KEY
```

---

# 35. Copying a Public Key

A convenient command is:

```bash
ssh-copy-id username@server-ip
```

For example:

```bash
ssh-copy-id devops@203.0.113.10
```

This installs your public key into the user's:

```text
~/.ssh/authorized_keys
```

After that, you can connect using your private key.

---

# 36. SSH Best Practice

A common production approach is:

```text
Developer Laptop
       |
       | SSH Key
       v
Linux Server
       |
       +---- Normal User
                 |
                 +---- sudo when required
```

Instead of:

```text
Developer Laptop
       |
       | SSH
       v
root
```

Using a normal user and granting only the required administrative privileges is safer.

---

# 37. SCP — Copy Files Over SSH

SSH is not only used for logging in.

We can also transfer files.

The command is:

```bash
scp
```

For example:

```bash
scp app.jar devops@203.0.113.10:/opt/myapp/
```

This means:

```text
Local Computer
      |
      | app.jar
      | SCP over SSH
      v
Remote Server
      |
      +-- /opt/myapp/
```

---

# 38. Copy a Directory

To copy a directory:

```bash
scp -r myapp devops@203.0.113.10:/opt/
```

The `-r` means recursive.

It allows the command to copy directories and their contents.

---

# 39. A Simple DevOps Example

Imagine your build server creates:

```text
application.jar
```

You need to move it to an application server.

One possible workflow is:

```text
Developer
    |
    v
Git Repository
    |
    v
Build Server
    |
    | application.jar
    v
Application Server
```

A simple file transfer could use:

```bash
scp application.jar devops@app-server:/opt/myapp/
```

Later, tools such as Jenkins, Ansible, or deployment platforms can automate this process.

---

# 40. Important Security Rules

When working with Linux servers, remember these rules.

### Rule 1 — Don't use root unnecessarily

Prefer:

```bash
sudo command
```

instead of staying logged in as root.

---

### Rule 2 — Protect private keys

Never commit:

```text
*.pem
*.key
id_rsa
id_ed25519
```

to a public Git repository.

---

### Rule 3 — Use least privilege

A user should have only the permissions required to perform their job.

---

### Rule 4 — Don't open every port

If your application only needs:

```text
22
80
443
```

don't randomly expose additional ports.

---

### Rule 5 — Be careful with permissions

Avoid blindly doing:

```bash
chmod 777
```

on production files.

`777` gives:

```text
Owner  -> rwx
Group  -> rwx
Others -> rwx
```

That is often far more permission than necessary.

---

# 41. A Small Hands-On Lab

Let's put everything together.

## Step 1 — Create a User

```bash
sudo useradd -m devops
```

Set a password:

```bash
sudo passwd devops
```

---

## Step 2 — Create a Group

```bash
sudo groupadd developers
```

---

## Step 3 — Add User to Group

```bash
sudo usermod -aG developers devops
```

Verify:

```bash
groups devops
```

---

## Step 4 — Create a Directory

```bash
sudo mkdir -p /opt/myapp
```

---

## Step 5 — Create a File

```bash
sudo touch /opt/myapp/application.conf
```

---

## Step 6 — Change Ownership

```bash
sudo chown devops:developers /opt/myapp/application.conf
```

---

## Step 7 — Check Permissions

```bash
ls -l /opt/myapp
```

You should understand what each section means:

```text
-rw-r--r-- devops developers application.conf
```

---

# 42. The Big Picture

At this point, you should be able to understand this diagram:

```text
                     Linux Server
                          |
          +---------------+---------------+
          |                               |
       Users                           Groups
          |                               |
    +-----+-----+                   +-----+------+
    |           |                   |            |
  Alice        Bob             Developers     Admins
    |           |                   |
    +-----------+-------------------+
                |
                v
             Files
                |
        +-------+-------+
        |       |       |
      Owner   Group   Others
        |       |       |
        +-------+-------+
                |
          Permissions
          r / w / x
                |
                v
          Access Control
```

And remote access looks like:

```text
              SSH
Laptop ----------------------> Linux Server
  |                                  |
  | Private Key                      |
  |                                  |
  +-------------------------------> |
                                     |
                              authorized_keys
```

---

# 43. What Should a DevOps Engineer Remember?

You don't need to memorize every Linux command.

Focus on understanding the concepts.

### Users

```text
whoami
id
useradd
passwd
usermod
```

### Groups

```text
groupadd
groups
usermod -aG
```

### Permissions

```text
r = read
w = write
x = execute
```

### Permission Commands

```bash
chmod
chown
```

### SSH

```bash
ssh
ssh-keygen
ssh-copy-id
```

### File Transfer

```bash
scp
```

### Administrative Access

```bash
sudo
```

---

# 44. Interview Questions You Should Be Able to Answer

### Q1. What is the root user?

The root user is the Linux superuser with highly privileged access.

### Q2. What is `sudo`?

`sudo` allows an authorized user to execute a command with elevated privileges.

### Q3. What is a UID?

UID is the numeric identifier assigned to a Linux user.

### Q4. Why do we use groups?

Groups make it easier to manage permissions for multiple users.

### Q5. What does `chmod 755` mean?

```text
Owner  -> rwx
Group  -> r-x
Others -> r-x
```

### Q6. What is `chown` used for?

`chown` changes file or directory ownership.

### Q7. What is SSH?

SSH is a secure protocol commonly used to remotely access Linux servers.

### Q8. What is the default SSH port?

```text
22
```

### Q9. What is an SSH key pair?

A pair consisting of a private key and a public key used for authentication.

### Q10. Where is the public key stored on the server?

Commonly:

```text
~/.ssh/authorized_keys
```

### Q11. What is SCP?

SCP is used to securely copy files between systems over SSH.

### Q12. Authentication vs authorization?

```text
Authentication -> Who are you?

Authorization  -> What are you allowed to do?
```

---

# 45. What Comes Next?

We have now covered the Linux access-control side of DevOps:

```text
Linux Users
     |
     v
Groups
     |
     v
File Ownership
     |
     v
Permissions
     |
     v
sudo
     |
     v
SSH
     |
     v
Remote Server
     |
     v
File Transfer
```

In the next part, we will move from **managing the server** to **automating the server**.

We will cover:

* Bash shell
* Shell scripts
* Variables
* Conditions
* Loops
* Functions
* Command-line arguments
* Environment variables
* Pipes
* Redirection
* Practical DevOps scripts

That is where Linux starts becoming really useful for automation.

---

# Final Takeaway

For a DevOps engineer, Linux knowledge is not about memorizing hundreds of commands.

The real goal is to understand:

> **Who can access what, why they can access it, and how we securely manage remote servers.**

If you understand:

```text
Users
Groups
Permissions
sudo
SSH
SSH Keys
SCP
```

you already have a strong foundation for the next step:

```text
Linux
  |
  v
Shell Scripting
  |
  v
Automation
  |
  v
CI/CD
  |
  v
Docker
  |
  v
Kubernetes
```

**Practice these concepts on an Ubuntu VM or AWS EC2 instance. Don't just read the commands — type them, make mistakes, and understand the error messages. That's how Linux becomes familiar.**
