---
title: Docker and Containerization — Part 1: The Foundation
description: What containers, images and Docker Engine actually are, how containers differ from virtual machines, and why container registries matter.
date: 2026-07-07
tags:
- Docker
- Containers
- DevOps
cover: /images/project-placeholder.svg
author: Praveen Kumar
readingTime: 17 min
---

# Docker and Containerization — Part 1: The Foundation Every DevOps Engineer Should Know

If you are preparing for a **DevOps Engineer** or **Kubernetes Engineer** role, Docker is one of the technologies you should understand well.

You don't need to become a Docker expert before learning Kubernetes, but you should clearly understand:

* What is Docker?
* What is containerization?
* What is a container?
* What is a Docker image?
* What is the difference between an image and a container?
* Docker vs Virtual Machines
* What is Docker Engine?
* What is a container registry?
* How does a Docker image move through a CI/CD pipeline?
* Why are containers important for Kubernetes?

Let's understand these concepts in simple language.

---

# 1. What Is Containerization?

Let's start with a common problem.

Suppose a developer creates a Java application on their laptop.

The application requires:

```text
Java 17
Tomcat 8.5
Application libraries
Configuration files
Environment variables
```

The developer tests everything and says:

> "It is working perfectly on my machine."

Now the application is given to the QA team.

QA installs the application on another server, but suddenly there is a problem.

Maybe QA has:

```text
Java 11
```

while the developer used:

```text
Java 17
```

Or perhaps QA has a different version of Tomcat.

Or maybe one of the required dependencies is missing.

Now QA says:

> "The application is not working."

And the developer says:

> "But it is working on my machine."

This is a very common problem in software development.

## This is where containerization helps.

**Containerization is the process of packaging an application together with everything it needs to run.**

For example:

```text
Application
    +
Dependencies
    +
Configuration
    +
Required Runtime
        |
        v
Container Image
```

Now instead of asking another team to manually install everything, we provide them with a container image.

The same image can be used in:

```text
Developer Environment
        |
        v
QA Environment
        |
        v
UAT Environment
        |
        v
Production Environment
```

This gives us much more consistency between environments.

---

# 2. What Is Docker?

**Docker is an open-source containerization platform.**

Docker provides tools to:

* Build container images
* Download container images
* Run containers
* Stop containers
* Remove containers
* Manage container networks
* Manage persistent storage
* Push images to registries
* Pull images from registries

One important point:

> Docker did not invent containers.

Container technologies existed before Docker.

Docker made containers much easier to use and helped make containerization extremely popular among developers and DevOps teams.

Today, when someone says:

> "Let's containerize this application."

Docker is often one of the first technologies that comes to mind.

---

# 3. Why Do We Need Containers?

Let's understand the problem containers solve.

Imagine we have three applications:

```text
Application A --> Java 11
Application B --> Java 17
Application C --> Java 21
```

If all three applications run directly on the same server, managing different dependency versions can become difficult.

We can end up with:

```text
Server
 |
 +-- Java 11
 +-- Java 17
 +-- Java 21
 +-- Different libraries
 +-- Different configurations
```

This can lead to dependency conflicts.

With containers, each application can have its own isolated environment.

```text
Server
 |
 +-- Container A
 |     |
 |     +-- Application A
 |     +-- Required dependencies
 |
 +-- Container B
 |     |
 |     +-- Application B
 |     +-- Required dependencies
 |
 +-- Container C
       |
       +-- Application C
       +-- Required dependencies
```

This makes application deployment more predictable and manageable.

---

# 4. Application Development Before and After Containers

## Before Containers

Before containers, developers and operations teams often had to install applications manually.

For example:

```text
Install Java
Install Maven
Install Node.js
Install libraries
Configure environment variables
Configure application
Start application
```

The installation process could be different on every machine.

For example:

```text
Developer Laptop
       |
       +-- Different OS
       +-- Different Java version
       +-- Different libraries
       +-- Different configuration
```

This can create the famous:

> "It works on my machine."

problem.

---

## After Containers

With containers, we package the application and its dependencies together.

For example:

```text
Application
    +
Java
    +
Libraries
    +
Configuration
        |
        v
Container Image
```

Now another developer can use the same image.

QA can use the same image.

UAT can use the same image.

Production can use the same image.

This is one of the biggest advantages of containerization.

---

# 5. Application Deployment Before and After Containers

Let's look at deployment.

## Before Containers

Suppose we want to deploy a Java application on a new server.

Someone may need to follow a deployment document:

```text
1. Install Java 17
2. Install Tomcat
3. Configure Tomcat
4. Copy the WAR file
5. Configure environment variables
6. Configure dependencies
7. Start the application
```

If someone misses one step, the deployment can fail.

There can also be dependency conflicts between applications.

---

## After Containers

Developers and operations teams can package the application into a container image.

For example:

```text
web_app_image:v1.0
    |
    +-- web_app.war
    +-- Java 17
    +-- Tomcat
    +-- Required dependencies
    +-- Configuration
```

The deployment server mainly needs a container runtime.

The image can then be downloaded and started.

This is one reason containers became so important in DevOps.

---

# 6. What Is a Container?

A **container is a running instance of a container image**.

Think about it like this:

```text
Image
  |
  | docker run
  v
Container
```

The image is the package.

The container is the running environment created from that package.

For example:

```text
ubuntu image
      |
      | docker run
      v
ubuntu container
```

Or:

```text
tomcat image
      |
      | docker run
      v
tomcat container
```

A simple way to remember it:

> **Image = Package**
> **Container = Running Instance**

---

# 7. Docker Image vs Docker Container

This is one of the most important Docker concepts for interviews.

## Docker Image

A Docker image is a **read-only template/package** used to create containers.

It contains the application and the files and dependencies required by the application.

For example:

```text
web_app_image:v1.0

    Application
    Java
    Tomcat
    Libraries
    Configuration
```

An image is an artifact that can be:

* Built
* Stored
* Versioned
* Shared
* Pushed
* Pulled

An image itself is not the running application.

---

## Docker Container

A container is created from an image and provides the runtime environment for the application.

For example:

```text
Image
  |
  | docker run
  v
Container
  |
  +-- Application Running
```

So remember:

> **A Docker image is the package, while a Docker container is the running instance of that package.**

This is a very good way to explain it during an interview.

---

# 8. Docker Images Are Made of Layers

Docker images are generally composed of multiple layers.

For example:

```text
Application Layer
-----------------
Application files

Dependency Layer
-----------------
Application libraries

Runtime Layer
-----------------
Java / Node.js / Python

Base Image Layer
-----------------
Ubuntu / Alpine / etc.
```

Dockerfile instructions contribute to these layers.

For example:

```dockerfile
FROM ubuntu

RUN apt update

RUN apt install maven -y

COPY application.jar /app/
```

The resulting image contains the required filesystem changes from these instructions.

The layer concept is important because Docker can reuse existing layers.

This can make image builds faster and reduce unnecessary duplication.

We will discuss Dockerfiles and image building in detail in **Part 3**.

---

# 9. Containers vs Virtual Machines

This is one of the most common DevOps interview questions.

Both containers and virtual machines provide virtualization, but they work at different levels.

---

## Virtual Machines

Virtual machines use **hardware-level virtualization**.

A **hypervisor** is used to create and manage virtual machines.

For example:

```text
Physical Server
       |
       v
   Hypervisor
       |
       +-- VM 1 --> Guest OS
       |
       +-- VM 2 --> Guest OS
       |
       +-- VM 3 --> Guest OS
```

Each VM has its own operating system.

For example:

```text
VM 1 --> Linux
VM 2 --> Linux
VM 3 --> Windows
```

Because every VM includes a full operating system, VMs generally require more resources.

---

# 10. How Are Containers Different?

Containers provide **OS-level virtualization**.

Multiple containers can share the host operating system kernel.

Conceptually:

```text
Host Operating System
        |
        +-- Container 1
        |
        +-- Container 2
        |
        +-- Container 3
```

Each container gets an isolated environment for its processes, filesystem, networking, and other resources.

Because containers don't need a separate full guest operating system for every application, they are generally much lighter than VMs.

---

# 11. VM vs Container

Here is a simple comparison:

| Virtual Machine                      | Container                                   |
| ------------------------------------ | ------------------------------------------- |
| Hardware-level virtualization        | OS-level virtualization                     |
| Uses a hypervisor                    | Uses a container runtime                    |
| Includes a full guest OS             | Shares the host kernel                      |
| Usually larger                       | Usually smaller                             |
| Usually takes longer to start        | Usually starts faster                       |
| Strong OS-level isolation            | Application/process-level isolation         |
| Can run a different OS from the host | Container must use a compatible host kernel |

A simplified architecture looks like this.

### Virtual Machine

```text
Physical Hardware
       |
       v
   Hypervisor
       |
       +-- VM
       |    |
       |    +-- Guest OS
       |    |
       |    +-- Application
       |
       +-- VM
            |
            +-- Guest OS
            |
            +-- Application
```

### Container

```text
Physical Hardware
       |
       v
    Host OS
       |
       v
Container Runtime
       |
       +-- Container
       |     |
       |     +-- Application
       |
       +-- Container
             |
             +-- Application
```

---

# 12. Can Containers Completely Replace Virtual Machines?

No.

This is an important point for interviews.

Containers can reduce the number of VMs required in some architectures, but they do not completely eliminate VMs.

For example, in a cloud environment you might have:

```text
Cloud Infrastructure
       |
       +-- Virtual Machine
              |
              +-- Container Runtime
                     |
                     +-- Container
                     +-- Container
                     +-- Container
```

This is a very common architecture.

Cloud Kubernetes clusters, for example, commonly use virtual machines as worker nodes, with containers running on those nodes.

So don't say:

> "Containers completely replace VMs."

A better explanation is:

> **Containers and VMs solve different problems, and containers often run on virtual machines.**

---

# 13. What Makes Containers Isolated?

Two important Linux kernel features behind container isolation and resource management are:

```text
Namespaces
Control Groups (cgroups)
```

You don't need to be a Linux kernel developer to understand the basic idea.

---

## Namespaces

Namespaces provide isolation.

They help make processes inside a container see an isolated environment.

Namespaces can isolate things such as:

* Processes
* Network
* Mounts
* Users
* Hostnames

For example:

```text
Host
 |
 +-- Container 1
 |     |
 |     +-- Process namespace
 |     +-- Network namespace
 |
 +-- Container 2
       |
       +-- Process namespace
       +-- Network namespace
```

---

## Control Groups — cgroups

Control groups, commonly called **cgroups**, help control and limit resource usage.

For example:

```text
Container A
    |
    +-- CPU: 1 core
    +-- Memory: 512 MB

Container B
    |
    +-- CPU: 2 cores
    +-- Memory: 1 GB
```

Together, namespaces and cgroups are fundamental Linux technologies used to provide container isolation and resource management.

---

# 14. What Is Docker Engine?

**Docker Engine** is the core technology used to build and run Docker containers.

When you execute commands such as:

```bash
docker pull
docker run
docker stop
docker rm
```

you are using Docker's command-line interface to interact with the Docker Engine.

A simplified view:

```text
You
 |
 | docker command
 v
Docker CLI
 |
 v
Docker Engine
 |
 +---- Images
 |
 +---- Containers
 |
 +---- Networks
 |
 +---- Volumes
```

The **Docker CLI** is the interface we use to send commands.

The **Docker Engine** performs the container management work.

---

# 15. Docker Architecture

Let's understand Docker architecture from a practical point of view.

Suppose you execute:

```bash
docker pull nginx
```

You are asking Docker to download an image from a container registry.

Then you execute:

```bash
docker run nginx
```

Docker uses that image to create and start a container.

A simplified architecture looks like this:

```text
Developer
    |
    v
Docker CLI
    |
    v
Docker Engine
    |
    +---- Images
    |
    +---- Containers
    |
    +---- Networks
    |
    +---- Volumes
```

So when working with Docker, you are usually interacting with these major components:

* Docker CLI
* Docker Engine
* Docker Images
* Docker Containers
* Docker Networks
* Docker Volumes
* Container Registries

---

# 16. What Is a Container Registry?

Now we have another important question.

Suppose you build a Docker image on your laptop.

How do you give that image to another server?

You store the image in a **container registry**.

A container registry is a service used to **store, manage, and distribute container images**.

The basic flow is:

```text
Developer Machine
       |
       | docker push
       v
Container Registry
       |
       | docker pull
       v
Production Server
```

---

# 17. Docker Hub

One of the most popular public container registries is **Docker Hub**.

Docker Hub:

https://hub.docker.com/

You can find many public images there, such as:

```text
ubuntu
nginx
tomcat
redis
mongo
mysql
```

For example:

```bash
docker pull ubuntu
```

Docker downloads the Ubuntu image from a registry.

We can then create a container from that image.

---

# 18. Public vs Private Container Registries

Not every image should be publicly available.

Companies usually have private container registries for internal applications.

Examples include:

* AWS Elastic Container Registry (ECR)
* Azure Container Registry (ACR)
* Google Artifact Registry
* JFrog Artifactory

For example:

```text
Private Registry
       |
       +-- company-web:v1.0
       +-- company-web:v1.1
       +-- payment-service:v2.0
       +-- user-service:v3.2
```

Production servers can authenticate to the private registry and pull the required images.

---

# 19. What Is a Container Repository?

A **container repository** is used to organize images within a registry.

Think about it like this:

```text
Container Registry
       |
       +-- web-app
       |     |
       |     +-- v1.0
       |     +-- v1.1
       |     +-- v2.0
       |
       +-- payment-service
             |
             +-- v1.0
             +-- v2.0
```

The registry is the overall image storage service.

The repository organizes images for a particular application or component.

---

# 20. Docker Image Naming

You will often see Docker images written like this:

```text
repository/image:tag
```

For example:

```text
loksaieta/pl-java-mvn-build:v1.0
```

We can break this down:

```text
loksaieta
    |
    +-- Docker Hub username/repository

pl-java-mvn-build
    |
    +-- Image/repository name

v1.0
    |
    +-- Tag
```

Another example from a private registry could look like:

```text
523450290.dkr.ecr.eu-central-1.amazonaws.com/my-app:1.0
```

Here the image is stored in an AWS ECR registry.

---

# 21. How Images Move Through a CI/CD Pipeline

Now let's connect Docker with DevOps and CI/CD.

Imagine a developer writes Java source code.

The code is stored in GitHub.

Jenkins builds the application.

The build creates:

```text
web_app.war
```

Then Docker is used to create an image.

The flow looks like this:

```text
GitHub
   |
   | Source Code
   v
Jenkins
   |
   | Build
   v
web_app.war
   |
   | Docker Build
   v
web_app_image:v1.0
   |
   | Docker Push
   v
Container Registry
   |
   | Docker Pull
   v
Production
   |
   | Docker Run
   v
Container
   |
   v
Application
```

This is a very common DevOps workflow.

---

# 22. Example: Java Application

Suppose we have:

```text
web_app.war
```

The application requires:

```text
JDK 17
Tomcat 8.5
Application dependencies
Configuration
```

Without containerization, we might have:

```text
Server
 |
 +-- Install JDK
 +-- Install Tomcat
 +-- Configure Tomcat
 +-- Copy WAR
 +-- Configure dependencies
 +-- Start application
```

With containerization, we create an image:

```text
web_app_image:v1.0
 |
 +-- web_app.war
 +-- Java runtime
 +-- Tomcat
 +-- Dependencies
 +-- Configuration
```

Then we push the image:

```bash
docker push web_app_image:v1.0
```

The image is stored in a container registry.

Another environment can download it:

```bash
docker pull web_app_image:v1.0
```

and run a container.

---

# 23. Why Is Containerization Useful in DevOps?

Containerization fits very well with the DevOps philosophy.

The development team creates the application and packages it into an image.

Operations can deploy the same image.

For example:

```text
Developer
    |
    | Build
    v
Docker Image
    |
    +----------------+
    |                |
    v                v
    QA              UAT
    |                |
    +--------+-------+
             |
             v
        Production
```

Instead of rebuilding the application differently in every environment, we can promote the same image through the pipeline.

This improves consistency.

---

# 24. Why Should a Kubernetes Engineer Know Docker?

Kubernetes is a container orchestration platform.

Before Kubernetes can manage an application, the application needs to be packaged as a container image.

The basic flow is:

```text
Application Source Code
        |
        v
Docker Image
        |
        v
Container Registry
        |
        v
Kubernetes
        |
        v
Pod
        |
        v
Container
        |
        v
Application
```

So if you want to become a Kubernetes engineer, you should understand Docker/container fundamentals.

You should be comfortable with concepts such as:

```text
Container
Image
Registry
Dockerfile
Container Runtime
Port Mapping
Volume
Networking
```

Then Kubernetes introduces additional concepts such as:

```text
Pod
Deployment
ReplicaSet
Service
ConfigMap
Secret
Ingress
StatefulSet
```

---

# 25. A Simple Microservice Example

Suppose an e-commerce application has three major components:

```text
Frontend
Backend
Database
```

We can package them separately:

```text
Frontend Image
Backend Image
Database Image
```

Then run them as containers:

```text
E-Commerce Application
        |
        +-- Frontend Container
        |
        +-- Backend Container
        |
        +-- Database Container
```

In a larger environment, Kubernetes can manage these containers.

For example:

```text
Kubernetes Cluster
        |
        +-- Frontend Pods
        |
        +-- Backend Pods
        |
        +-- Database Pods
```

This is where containerization becomes the foundation for modern microservice deployments.

---

# 26. The Complete Docker Flow

At this point, you should understand the complete picture:

```text
Developer
    |
    | Write Code
    v
GitHub
    |
    | CI Build
    v
Application Artifact
    |
    | Docker Build
    v
Docker Image
    |
    | Docker Push
    v
Container Registry
    |
    | Docker Pull
    v
Deployment Environment
    |
    | Docker Run
    v
Docker Container
    |
    v
Application Running
```

And with Kubernetes:

```text
Developer
    |
    v
GitHub
    |
    v
CI/CD Pipeline
    |
    v
Docker Image
    |
    v
Container Registry
    |
    v
Kubernetes
    |
    v
Pods
    |
    v
Containers
    |
    v
Application
```

---

# 27. Interview Questions You Should Be Able to Answer

After understanding Part 1, you should be able to explain these questions in your own words.

### What is Docker?

Docker is an open-source containerization platform used to build, package, distribute, and run applications as containers.

### What is containerization?

Containerization is the process of packaging an application with its dependencies and configuration so that it can run consistently across different environments.

### What is a Docker image?

A Docker image is a packaged, read-only template used to create containers.

### What is a Docker container?

A Docker container is a running instance created from a Docker image.

### What is a container registry?

A container registry is a service used to store and distribute container images.

### What is Docker Hub?

Docker Hub is a popular public container registry where users can store and download container images.

### What is the difference between a VM and a container?

A VM virtualizes hardware and contains a full guest operating system, while containers provide OS-level isolation and share the host kernel.

### Can containers completely replace VMs?

No. Containers and VMs solve different problems, and containers commonly run on VMs in cloud environments.

### What are namespaces?

Namespaces provide isolation for processes and resources used by containers.

### What are cgroups?

cgroups help control and limit resources such as CPU and memory for containers.

---

# 28. Final Takeaway

If you remember only a few things from Part 1, remember these:

```text
Containerization
    =
Application + Dependencies + Configuration
```

```text
Docker Image
    =
Package / Template
```

```text
Docker Container
    =
Running Instance of an Image
```

```text
Container Registry
    =
Place to Store and Distribute Images
```

And the overall DevOps flow:

```text
Code
  |
  v
Build
  |
  v
Docker Image
  |
  v
Container Registry
  |
  v
Container
  |
  v
Application
```

For a **DevOps Engineer**, Docker is important because it makes application packaging and deployment more consistent.

For a **Kubernetes Engineer**, Docker/container knowledge is even more important because Kubernetes is built around managing containerized workloads.

The important thing is not to memorize Docker commands blindly.

First understand the flow:

> **Application → Image → Registry → Container → Deployment**

Once this flow is clear, Docker commands become much easier to understand.

---

# Coming Next: Part 2 — Docker Hands-On

In Part 2, we will move from theory to practical Docker.

We will learn:

```text
docker pull
docker images
docker run
docker ps
docker ps -a
docker start
docker stop
docker exec
docker rm
docker rmi
docker stats
```

Then we will understand:

* Foreground vs detached containers
* Interactive containers
* Container lifecycle
* Port mapping
* Why host ports must be unique
* Docker volumes
* Persistent data
* Host volumes
* Anonymous volumes
* Named volumes
* Real-world Docker examples

This is where we start working with Docker from the command line.
