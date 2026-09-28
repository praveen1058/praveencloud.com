---
title: Docker and Containerization — Part 2: Commands, Containers, Ports and Volumes
description: Hands-on Docker CLI work: pulling images, running and managing containers, mapping ports and persisting data with volumes.
date: 2026-07-14
tags:
- Docker
- Containers
- DevOps
cover: /images/project-placeholder.svg
author: Praveen Kumar
readingTime: 24 min
---

# Docker and Containerization — Part 2: Docker Commands, Containers, Ports and Volumes

In **Part 1**, we understood the foundation of Docker.

We discussed:

* What is containerization?
* What is Docker?
* What is a container?
* What is a Docker image?
* Image vs container
* Containers vs virtual machines
* Docker Engine
* Container registries
* Docker Hub
* How Docker fits into CI/CD
* Why Docker knowledge is important for Kubernetes engineers

Now it is time to get practical.

In this part, we are going to start working with Docker commands.

We will learn how to:

* Download images
* List images
* Create containers
* Run containers
* Run containers in the background
* Access running containers
* Stop containers
* Start stopped containers
* Remove containers
* Remove images
* Map container ports
* Check container resource usage
* Persist data using Docker volumes

The goal is not to memorize commands.

The goal is to understand **what Docker is doing when we execute each command**.

---

# 1. Docker CLI

Docker provides a command-line interface called the **Docker CLI**.

We use the Docker CLI to communicate with Docker Engine.

For example:

```bash
docker --version
```

This checks the installed Docker version.

You can think of the architecture like this:

```text
Developer
    |
    | docker command
    v
Docker CLI
    |
    v
Docker Engine
    |
    +-- Images
    +-- Containers
    +-- Networks
    +-- Volumes
```

So whenever you execute:

```bash
docker run
```

or:

```bash
docker ps
```

you are using the Docker CLI to interact with Docker.

---

# 2. Checking Docker Installation

Before running containers, make sure Docker is installed.

On an Ubuntu machine, Docker can be installed using:

```bash
sudo -i

apt install docker.io -y
```

After installation, check the version:

```bash
docker --version
```

For example, you may see something similar to:

```text
Docker version 27.x.x
```

The exact version will depend on your installation.

---

# 3. First Docker Command — docker images

Let's start with a simple command:

```bash
docker images
```

This command lists the Docker images available on the local machine.

For example:

```text
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
ubuntu       latest    abc123456789   2 weeks ago    78MB
nginx        latest    def987654321   1 week ago     188MB
```

The important fields are:

```text
REPOSITORY
TAG
IMAGE ID
CREATED
SIZE
```

For example:

```text
ubuntu:latest
```

Here:

```text
ubuntu
   |
   +-- Image name

latest
   |
   +-- Tag
```

Remember:

> `docker images` shows images that already exist on your local machine.

It does not show containers.

---

# 4. Docker Hub and docker pull

Now imagine we want to use an Ubuntu image.

First, we need to download the image.

We can use:

```bash
docker pull ubuntu
```

Docker contacts the configured container registry and downloads the image.

Usually, Docker Hub is the default public registry for an image reference such as:

```bash
docker pull ubuntu
```

You can also explicitly specify the tag:

```bash
docker pull ubuntu:latest
```

Another example:

```bash
docker pull tomcat:8.0
```

Another:

```bash
docker pull redis:alpine
```

---

# 5. What Happens During docker pull?

Suppose we execute:

```bash
docker pull ubuntu
```

The flow is roughly:

```text
Your Machine
    |
    | docker pull ubuntu
    v
Docker Registry
    |
    | Download image layers
    v
Local Docker Image Store
```

After the image is downloaded, check:

```bash
docker images
```

You should now see the Ubuntu image.

---

# 6. Image Tags

Docker images can have different versions.

For example:

```text
ubuntu:20.04
ubuntu:22.04
ubuntu:24.04
```

The part after `:` is called the **tag**.

For example:

```text
ubuntu:22.04
```

means:

```text
ubuntu
  |
  +-- Image name

22.04
  |
  +-- Tag
```

Tags are useful for identifying versions.

For example:

```text
web-app:v1.0
web-app:v1.1
web-app:v2.0
```

In real production environments, using specific versions is generally safer than blindly depending on a moving tag such as `latest`.

---

# 7. What Happens If We Don't Specify a Tag?

Suppose we run:

```bash
docker pull ubuntu
```

Docker interprets this as:

```bash
docker pull ubuntu:latest
```

In other words, when no tag is specified, Docker uses `latest` as the default tag for the image reference.

But remember:

> `latest` does not necessarily mean "the newest version of the application" in a semantic versioning sense.

It is simply a tag maintained by the image publisher.

For production systems, it is usually better to use an explicit version or immutable image reference when appropriate.

---

# 8. docker ps

Now let's look at containers.

The command:

```bash
docker ps
```

shows currently running containers.

For example:

```text
CONTAINER ID   IMAGE     COMMAND       STATUS
173233fbe3a3   ubuntu    "bash"        Up 20 seconds
```

The important point is:

```text
docker images
```

shows images.

While:

```text
docker ps
```

shows running containers.

Remember this distinction.

---

# 9. docker ps -a

What happens if a container has stopped?

It will not appear in:

```bash
docker ps
```

To see both running and stopped containers, use:

```bash
docker ps -a
```

For example:

```text
CONTAINER ID   IMAGE     STATUS
173233fbe3a3   ubuntu    Up 20 seconds
7abc12345678   ubuntu    Exited
```

So:

```bash
docker ps
```

means:

> Show running containers.

And:

```bash
docker ps -a
```

means:

> Show all containers, including stopped containers.

This is one of the first commands you should learn when troubleshooting Docker.

---

# 10. docker run

Now we are ready to create a container.

The basic syntax is:

```bash
docker run <image>
```

For example:

```bash
docker run ubuntu
```

What happens here?

Docker:

1. Checks whether the image exists locally.
2. If necessary, pulls the image.
3. Creates a container from the image.
4. Starts the container.

Conceptually:

```text
Ubuntu Image
     |
     | docker run
     v
Ubuntu Container
```

---

# 11. Image vs Container — Practical Example

Suppose we have:

```bash
docker pull ubuntu
```

Now:

```text
Local Machine
    |
    +-- ubuntu image
```

Then we execute:

```bash
docker run ubuntu
```

Now:

```text
Local Machine
    |
    +-- ubuntu image
    |
    +-- ubuntu container
```

The image can be used to create multiple containers.

For example:

```text
ubuntu image
     |
     +-- Container 1
     |
     +-- Container 2
     |
     +-- Container 3
```

This is an important concept.

One image can be used to create multiple containers.

---

# 12. Why Does docker run ubuntu Sometimes Exit Immediately?

This confuses many beginners.

Suppose you execute:

```bash
docker run ubuntu
```

You may not see an interactive Ubuntu shell.

The container may start and then stop immediately.

Why?

Because a container normally lives as long as its main process is running.

If the main process finishes, the container exits.

Think about this:

```text
Container
    |
    +-- Main Process
            |
            +-- Running
                 |
                 v
              Container
                Running
```

When the process finishes:

```text
Main Process
     |
     v
Process exits
     |
     v
Container exits
```

This is a very important container concept.

---

# 13. Running a Command Inside a Container

Let's try:

```bash
docker run ubuntu sleep 20
```

Here Docker creates an Ubuntu container and runs:

```bash
sleep 20
```

The container remains running for approximately 20 seconds.

After the `sleep` command finishes:

```text
sleep 20
   |
   v
Process exits
   |
   v
Container exits
```

Now run:

```bash
docker ps -a
```

You will see the container with an `Exited` status.

This demonstrates an important rule:

> A container is closely tied to its main process.

---

# 14. Foreground / Attached Mode

By default, Docker runs a container in the foreground, also called **attached mode**.

For example:

```bash
docker run ubuntu sleep 20
```

Your terminal remains attached to the container process.

You can think of it like this:

```text
Terminal
   |
   | docker run
   v
Container
   |
   +-- Main Process
```

Your terminal is attached to that process.

---

# 15. Detached Mode

Sometimes we don't want the container to occupy our terminal.

We want it to run in the background.

For that, we use:

```bash
-d
```

Example:

```bash
docker run -d ubuntu sleep 20
```

Now the container runs in detached/background mode.

You get your terminal back immediately.

For example:

```text
Terminal
   |
   | docker run -d
   v
Container
   |
   +-- Running in background
```

Then check:

```bash
docker ps
```

You should see the running container.

---

# 16. Interactive Mode

Now suppose we want to actually enter an Ubuntu container and work inside it.

We can use:

```bash
docker run -it ubuntu bash
```

Let's break this down.

```text
docker run
```

Create and start a container.

```text
-i
```

Keep standard input open.

```text
-t
```

Allocate a terminal.

```text
ubuntu
```

Use the Ubuntu image.

```text
bash
```

Start the Bash shell.

So:

```bash
docker run -it ubuntu bash
```

gives us an interactive shell inside the container.

You may see:

```text
root@173233fbe3a3:/#
```

Now you are inside the container.

---

# 17. Working Inside a Container

Once inside:

```bash
ls
```

You can explore the container filesystem.

For example:

```bash
pwd
```

or:

```bash
cat /etc/os-release
```

You can install packages, create files, and execute commands depending on the image and user permissions.

For example:

```bash
apt update
```

However, remember that changes made directly inside a container are not automatically part of the original image.

This becomes important when learning image creation.

We will cover that in Part 3.

---

# 18. Exiting a Container

If you are inside an interactive container:

```bash
exit
```

This exits the shell.

For example:

```text
root@container:/# exit
```

After exiting, the container may stop if the shell was its main process.

Check:

```bash
docker ps -a
```

You may see:

```text
STATUS
Exited
```

Again, the reason is simple:

> The main process ended, so the container stopped.

---

# 19. docker exec

Now let's say we already have a running container.

We don't want to create a new container.

Instead, we want to enter the existing running container.

This is where `docker exec` is useful.

Example:

```bash
docker exec -it <container_id> bash
```

For example:

```bash
docker exec -it 173233fbe3a3 bash
```

Now you get a shell inside the existing running container.

This is different from:

```bash
docker run
```

because `docker run` creates a new container.

While:

```bash
docker exec
```

executes a command inside an existing running container.

---

# 20. docker run vs docker exec

This is an important distinction.

### docker run

Creates a new container:

```bash
docker run -it ubuntu bash
```

Flow:

```text
Image
  |
  | docker run
  v
New Container
```

### docker exec

Runs a command inside an existing container:

```bash
docker exec -it <container_id> bash
```

Flow:

```text
Existing Container
       |
       | docker exec
       v
Command / Shell
```

Remember:

> `docker run` creates a container.
> `docker exec` runs a command inside an existing container.

---

# 21. Starting a Stopped Container

Suppose a container has stopped.

You can see it using:

```bash
docker ps -a
```

You can start it again with:

```bash
docker start <container_id>
```

For example:

```bash
docker start 173233fbe3a3
```

This starts the existing container.

Notice the difference:

```text
docker run
    |
    +-- Creates a NEW container

docker start
    |
    +-- Starts an EXISTING stopped container
```

This is another important interview concept.

---

# 22. Stopping a Container

To stop a running container:

```bash
docker stop <container_id>
```

For example:

```bash
docker stop 173233fbe3a3
```

The container is stopped but not deleted.

You can still see it:

```bash
docker ps -a
```

The status will show something similar to:

```text
Exited
```

So:

```text
docker stop
```

means:

> Stop the container, but keep it.

---

# 23. Removing a Container

If you no longer need a container, you can remove it.

Use:

```bash
docker rm <container_id>
```

For example:

```bash
docker rm 173233fbe3a3
```

Now the container is deleted.

Remember:

```text
docker stop
    |
    +-- Stop container

docker rm
    |
    +-- Remove container
```

Stopping and removing are two different operations.

---

# 24. Removing an Image

Containers and images are different objects.

If you want to remove an image:

```bash
docker rmi <image>
```

For example:

```bash
docker rmi ubuntu
```

Docker will remove the image if it is not required by existing containers.

Think of the relationship like this:

```text
Docker Image
     |
     +-- Container 1
     |
     +-- Container 2
```

You generally cannot remove an image if a container still depends on it in a way that prevents deletion.

So when cleaning up Docker resources, understand the relationship between:

```text
Image
  |
  v
Container
```

---

# 25. Container Lifecycle

Let's put the commands together.

A typical container lifecycle looks like this:

```text
Docker Image
     |
     | docker run
     v
Created + Running
     |
     | docker stop
     v
Stopped
     |
     | docker start
     v
Running
     |
     | docker rm
     v
Removed
```

This is much easier to remember than memorizing commands individually.

---

# 26. Container IDs

When you create a container, Docker assigns it a unique container ID.

For example:

```text
173233fbe3a3
```

You can use the full ID:

```bash
docker stop 173233fbe3a3
```

or often a sufficiently unique shortened ID:

```bash
docker stop 1732
```

You can also give containers meaningful names.

For example:

```bash
docker run --name my-ubuntu ubuntu
```

Now you can use:

```bash
docker stop my-ubuntu
```

instead of remembering the ID.

Naming containers is especially useful when working with multiple containers.

---

# 27. Port Mapping

Now let's discuss one of the most important concepts when running web applications in Docker.

Suppose we run a Tomcat container.

Tomcat listens on:

```text
8080
```

inside the container.

But the container has its own network namespace.

The host machine does not automatically expose the container's port directly to users.

We can map a host port to the container port.

The syntax is:

```bash
-p <host_port>:<container_port>
```

For example:

```bash
docker run -it -p 8085:8080 tomcat:8.0
```

This means:

```text
Host Port 8085
       |
       v
Container Port 8080
       |
       v
Tomcat
```

So users can access the application through the host's port `8085`.

---

# 28. Why Do We Need Port Mapping?

Imagine two Tomcat containers.

Both applications listen on port `8080` inside their containers.

That is completely fine.

We can have:

```text
Container 1
    |
    +-- Tomcat --> 8080

Container 2
    |
    +-- Tomcat --> 8080
```

Because each container has its own network namespace.

But if both containers need to be accessed through the same host IP address, we cannot bind both of them to the same host port.

So we can use:

```bash
docker run -it -p 8085:8080 tomcat:8.0
```

and:

```bash
docker run -it -p 8086:8080 tomcat:8.0
```

Now:

```text
Host:8085
    |
    v
Container 1:8080


Host:8086
    |
    v
Container 2:8080
```

The **container port can be the same**, but the **host ports must be different** when bound to the same host IP/interface.

---

# 29. A Simple Port Mapping Example

Suppose our application runs inside the container on port `8080`.

We execute:

```bash
docker run -d -p 8085:8080 my-web-app:v1.0
```

The mapping is:

```text
Browser
   |
   | http://HOST_IP:8085
   v
Host Port 8085
   |
   v
Container Port 8080
   |
   v
Application
```

This is how we expose many containerized web applications to users.

---

# 30. Container Statistics

Docker also provides a command to monitor container resource usage.

Use:

```bash
docker stats <container_id>
```

For example:

```bash
docker stats 173233fbe3a3
```

You can see information such as:

```text
CPU usage
Memory usage
Network I/O
Block I/O
```

This is useful when troubleshooting resource consumption.

For example:

```text
Container A --> CPU 5%
Container B --> CPU 90%
Container C --> CPU 10%
```

If Container B is consuming a lot of CPU or memory, you can investigate further.

---

# 31. Why Do We Need Docker Volumes?

Now we come to an extremely important Docker topic:

**Persistence.**

Imagine we run a database inside a container.

For example:

```text
Database Container
       |
       +-- Customer Data
       +-- Orders
       +-- Payments
```

Where is this data stored?

By default, data written inside the container is stored in the container's writable filesystem.

The problem is:

> If the container is removed, the data stored only inside that container can be lost.

For example:

```text
Container
   |
   +-- Database Data
```

Now:

```bash
docker rm database-container
```

The container is gone.

If the data was stored only inside that container, it can be gone as well.

This is obviously a serious problem for databases and other stateful applications.

---

# 32. Docker Volumes

Docker volumes provide a way to persist data outside the container's lifecycle.

Conceptually:

```text
Host
 |
 +-- Persistent Storage
       |
       v
Container
 |
 +-- Application
 +-- Database
```

The container uses a mounted storage location.

If the container is removed, the volume can remain.

Then a new container can mount the same volume.

```text
Volume
   |
   +----------------+
   |                |
   v                v
Container 1      Container 2
```

This allows data to survive container replacement.

---

# 33. Why Are Volumes Important?

Volumes are especially important for:

* Databases
* Stateful applications
* Uploaded files
* Application-generated data
* Persistent configuration/data

For example:

```text
MongoDB Container
       |
       v
MongoDB Data
       |
       v
Docker Volume
```

If the MongoDB container is replaced:

```text
Old MongoDB Container
       |
       X
     Removed
```

the volume can remain:

```text
Docker Volume
       |
       +-- Existing MongoDB Data
```

A new MongoDB container can mount the same volume.

---

# 34. Docker Volume Types

There are three common ways to mount storage:

1. Host volumes / bind mounts
2. Anonymous volumes
3. Named volumes

Let's understand them one by one.

---

# 35. Host Volume / Bind Mount

With a bind mount, you decide exactly where the data exists on the host filesystem.

For example:

```text
Host
/home/mount/data
       |
       | Mount
       v
Container
/var/lib/mysql/data
```

The command can look like:

```bash
docker run -v /home/mount/data:/var/lib/mysql/data mysql
```

The syntax is:

```text
-v <host_path>:<container_path>
```

For example:

```text
/home/mount/data
        :
/var/lib/mysql/data
```

The first path belongs to the host.

The second path belongs to the container.

---

# 36. Anonymous Volumes

With an anonymous volume, Docker creates the storage location for you.

For example:

```bash
docker run -v /var/lib/mysql/data mysql
```

Docker creates an automatically managed volume associated with the container.

You don't explicitly give the volume a name.

Conceptually:

```text
Container
    |
    +-- /var/lib/mysql/data
             |
             v
Docker-managed volume
```

Anonymous volumes can be useful in certain scenarios, but they are harder to manage by name.

---

# 37. Named Volumes

Named volumes are usually easier to manage because you give the volume a name.

First create a volume:

```bash
docker volume create pl-vol1
```

Now list volumes:

```bash
docker volume ls
```

You should see:

```text
pl-vol1
```

Inspect it:

```bash
docker volume inspect pl-vol1
```

Then mount it into a container:

```bash
docker run -it \
  --mount source=pl-vol1,destination=/pl-vol1 \
  ubuntu bash
```

The important part is:

```text
source=pl-vol1
destination=/pl-vol1
```

This means:

```text
Docker Volume
pl-vol1
    |
    v
Container
/pl-vol1
```

---

# 38. Named Volume Example

Let's make the example easier.

Create the volume:

```bash
docker volume create mydata
```

Run a container:

```bash
docker run -it \
  --mount source=mydata,destination=/data \
  ubuntu bash
```

Inside the container:

```bash
cd /data
```

Create a file:

```bash
echo "Hello Docker" > message.txt
```

Now exit:

```bash
exit
```

The container may stop.

But the volume still exists.

Check:

```bash
docker volume ls
```

You should still see:

```text
mydata
```

Now create another container and mount the same volume:

```bash
docker run -it \
  --mount source=mydata,destination=/data \
  ubuntu bash
```

Inside:

```bash
cd /data
ls
```

You should find:

```text
message.txt
```

This demonstrates persistence.

The container changed.

The data remained in the volume.

---

# 39. Container Storage vs Persistent Storage

This distinction is extremely important.

### Container filesystem

```text
Container
    |
    +-- Application data
```

If the container is removed, that container-specific data can disappear.

### Volume

```text
Container
    |
    v
Volume
    |
    v
Persistent Data
```

The volume has a lifecycle independent of the individual container.

So:

> **Containers can be temporary. Data often needs to be permanent. Volumes provide persistent storage for containerized applications.**

---

# 40. A Database Example

Imagine we run MySQL.

```text
MySQL Container
       |
       +-- /var/lib/mysql
```

This directory contains database data.

We can mount a named volume:

```bash
docker volume create mysql-data
```

Then:

```bash
docker run -d \
  --mount source=mysql-data,destination=/var/lib/mysql \
  mysql
```

Now:

```text
MySQL Container
       |
       | /var/lib/mysql
       v
mysql-data Volume
       |
       v
Persistent Database Data
```

If we replace the container, we can mount the same volume into the new container.

This is why volumes are important for stateful workloads.

---

# 41. `-v` vs `--mount`

You will see both styles in Docker commands.

For example:

```bash
docker run -v mydata:/data ubuntu
```

And:

```bash
docker run \
  --mount source=mydata,destination=/data \
  ubuntu
```

Both can be used to mount storage.

The `--mount` syntax is more explicit and easier to read when configurations become complex.

For example:

```text
source=mydata
destination=/data
```

is very clear about what is being mounted where.

---

# 42. Important Docker Commands So Far

Let's create a quick reference.

## Docker Version

```bash
docker --version
```

## List Images

```bash
docker images
```

## Download Image

```bash
docker pull ubuntu
```

## Run Container

```bash
docker run ubuntu
```

## Run in Background

```bash
docker run -d ubuntu sleep 20
```

## Interactive Container

```bash
docker run -it ubuntu bash
```

## List Running Containers

```bash
docker ps
```

## List All Containers

```bash
docker ps -a
```

## Start Container

```bash
docker start <container_id>
```

## Stop Container

```bash
docker stop <container_id>
```

## Execute Command in Running Container

```bash
docker exec -it <container_id> bash
```

## Remove Container

```bash
docker rm <container_id>
```

## Remove Image

```bash
docker rmi <image>
```

## Monitor Container

```bash
docker stats <container_id>
```

## List Volumes

```bash
docker volume ls
```

## Create Volume

```bash
docker volume create mydata
```

## Inspect Volume

```bash
docker volume inspect mydata
```

---

# 43. A Practical Docker Workflow

Let's put everything together.

Suppose we want to run an application.

### Step 1 — Pull the Image

```bash
docker pull nginx
```

### Step 2 — Verify the Image

```bash
docker images
```

### Step 3 — Run the Container

```bash
docker run -d --name my-nginx nginx
```

### Step 4 — Check the Container

```bash
docker ps
```

### Step 5 — Execute a Command

```bash
docker exec -it my-nginx bash
```

If Bash isn't available in the image, you may need to use another shell, such as:

```bash
docker exec -it my-nginx sh
```

### Step 6 — Exit

```bash
exit
```

### Step 7 — Stop the Container

```bash
docker stop my-nginx
```

### Step 8 — Start It Again

```bash
docker start my-nginx
```

### Step 9 — Remove It

```bash
docker stop my-nginx
docker rm my-nginx
```

The image still exists.

You can verify:

```bash
docker images
```

This is the basic Docker container lifecycle.

---

# 44. Real DevOps Example

Let's imagine a Jenkins server.

Without containers, an infrastructure might look like:

```text
Jenkins Master
     |
     +-- VM 1 --> Java Builds
     |
     +-- VM 2 --> .NET Builds
     |
     +-- VM 3 --> Python Builds
     |
     +-- VM 4 --> Node.js Builds
```

This requires multiple VMs.

With containers, a Jenkins worker can use containers for different build environments:

```text
Jenkins Master
     |
     v
Jenkins Worker VM
     |
     +-- Java Container
     |
     +-- .NET Container
     |
     +-- Python Container
     |
     +-- Node.js Container
```

The worker can create the appropriate container for each build.

For example:

```text
Java Build
    |
    v
Java Build Container
    |
    +-- JDK
    +-- Maven
    +-- Build Tools
```

Another job can use:

```text
Python Build
    |
    v
Python Build Container
    |
    +-- Python
    +-- pip
    +-- Required Tools
```

This is one practical way containers help DevOps teams create more consistent build environments.

---

# 45. Common Beginner Mistakes

When learning Docker, there are a few mistakes that happen frequently.

## Mistake 1 — Confusing Images and Containers

Remember:

```text
Image = Package
Container = Running Instance
```

---

## Mistake 2 — Using `docker run` When You Want to Start an Existing Container

If the container already exists and is stopped:

```bash
docker start <container>
```

Don't use:

```bash
docker run
```

unless you actually want a new container.

---

## Mistake 3 — Expecting `docker ps` to Show Stopped Containers

Use:

```bash
docker ps
```

for running containers.

Use:

```bash
docker ps -a
```

for all containers.

---

## Mistake 4 — Forgetting Port Mapping

If the application listens on port `8080` inside the container, you may need:

```bash
-p 8085:8080
```

to expose it through host port `8085`.

---

## Mistake 5 — Storing Important Data Only Inside a Container

Containers can be replaced.

For databases and other stateful workloads, use appropriate persistent storage such as Docker volumes.

---

# 46. Interview Questions

After Part 2, you should be able to answer these questions.

### What does `docker pull` do?

It downloads a container image from a registry to the local machine.

### What does `docker run` do?

It creates and starts a new container from an image.

### What is the difference between `docker run` and `docker start`?

`docker run` creates a new container, while `docker start` starts an existing stopped container.

### What is the difference between `docker ps` and `docker ps -a`?

`docker ps` shows running containers. `docker ps -a` shows running and stopped containers.

### What does `docker exec` do?

It executes a command inside an existing running container.

### What does `-d` mean?

It runs the container in detached/background mode.

### What does `-it` mean?

It combines interactive input with a terminal allocation, commonly used for interactive shells.

### What does `-p 8085:8080` mean?

It maps host port `8085` to container port `8080`.

### Why are Docker volumes needed?

Volumes provide persistent storage so important data can survive container replacement.

### What is a named volume?

A Docker-managed volume that you explicitly reference by name.

### What happens when a container's main process exits?

The container normally stops.

---

# 47. The Mental Model You Should Remember

Don't try to memorize 50 commands.

Understand this flow:

```text
                 Docker Image
                      |
                      | docker run
                      v
                Docker Container
                      |
          +-----------+-----------+
          |                       |
          v                       v
      Application             Volume
          |                       |
          v                       v
      Port 8080             Persistent Data
          |
          | -p 8085:8080
          v
      Host Port 8085
```

And remember the lifecycle:

```text
        Image
          |
      docker run
          |
          v
      Container
          |
      docker stop
          |
          v
       Stopped
          |
      docker start
          |
          v
       Running
          |
       docker rm
          |
          v
       Removed
```

---

# 48. Final Takeaway

At the end of Part 2, you should be comfortable with the basic Docker workflow.

You should understand:

```text
docker pull
     |
     v
Download Image
     |
     v
docker run
     |
     v
Create Container
     |
     +---- docker ps
     |
     +---- docker exec
     |
     +---- docker stop
     |
     +---- docker start
     |
     +---- docker rm
```

And for applications that need external access:

```text
Host Port
    |
    | Port Mapping
    v
Container Port
    |
    v
Application
```

And for applications that need persistent data:

```text
Container
    |
    | Mount
    v
Docker Volume
    |
    v
Persistent Data
```

The most important thing to remember is:

> **A container is temporary, but the application data may need to be permanent.**

That is why understanding **Docker volumes** is just as important as understanding `docker run`.

---

# Coming Next: Part 3 — Building Docker Images and Dockerfiles

So far, we have mostly used images that already exist.

In Part 3, we will learn how to **build our own Docker images**.

We will cover:

```text
docker commit
docker build
Dockerfile
FROM
RUN
COPY
ADD
ENV
ARG
WORKDIR
EXPOSE
CMD
ENTRYPOINT
```

We will also containerize a real application, understand Docker image layers, build an image, tag it, log in to Docker Hub, and push it to a container registry.

The flow will become:

```text
Application Source Code
        |
        v
Dockerfile
        |
        | docker build
        v
Docker Image
        |
        | docker tag
        v
Tagged Image
        |
        | docker push
        v
Container Registry
```

That is where Docker starts becoming a real **DevOps tool**, rather than just a command-line utility.
