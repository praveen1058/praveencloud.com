---
title: Docker and Containerization — Part 3: Dockerfile, Image Building and Docker Hub
description: Writing Dockerfiles, building your own images layer by layer, and pushing them to a container registry such as Docker Hub.
date: 2026-08-04
tags:
- Docker
- Dockerfile
- DevOps
cover: /images/project-placeholder.svg
author: Praveen Kumar
readingTime: 30 min
---

# Docker and Containerization — Part 3: Dockerfile, Image Building and Docker Hub

In **Part 1**, we understood what Docker and containerization are.

In **Part 2**, we worked with Docker commands and learned how to:

* Pull images
* Run containers
* Stop and start containers
* Access containers
* Map ports
* Create volumes
* Manage the container lifecycle

Now we are going one step further.

In real DevOps work, we usually don't want to manually create a container, install everything inside it, and repeat the same process again and again.

We want to define the environment as **code**.

That is where the **Dockerfile** comes in.

In this part, we will learn:

* How Docker images are created
* `docker commit`
* `docker build`
* What a Dockerfile is
* Dockerfile instructions
* Docker image layers
* Docker build context
* `.dockerignore`
* Image tagging
* Docker Hub
* `docker login`
* `docker push`
* `docker pull`
* How to containerize a real application
* Docker image best practices
* Multi-stage builds
* Security considerations

---

# 1. Why Do We Need to Build Our Own Docker Images?

Suppose you are developing a Java application.

Your application needs:

```text
Java Application
    |
    +-- JDK 17
    +-- Maven
    +-- Required libraries
    +-- Configuration
```

Without Docker, someone may manually install all these dependencies on a server.

For example:

```text
Server
 |
 +-- Install Java
 +-- Configure Java
 +-- Install Maven
 +-- Configure Maven
 +-- Copy application
 +-- Configure environment
 +-- Start application
```

Now imagine doing this for:

* Development
* QA
* UAT
* Production

And then imagine doing it for 20 applications.

It becomes difficult to maintain.

Different servers may have different versions.

One server may have:

```text
JDK 17
Maven 3.9
```

Another server may have:

```text
JDK 11
Maven 3.6
```

Now you have an environment problem.

Docker solves this by allowing us to define the environment inside an image.

```text
Application
    +
Dependencies
    +
Configuration
    |
    v
Docker Image
```

Then the same image can be used across environments.

```text
Docker Image
     |
     +----> Development
     |
     +----> QA
     |
     +----> UAT
     |
     +----> Production
```

This is one of the biggest advantages of containerization.

---

# 2. Two Ways to Create a Docker Image

There are two common approaches we should understand:

```text
1. docker commit
2. docker build
```

They solve the same broad problem, but they are used differently.

---

# 3. Creating an Image Using docker commit

Let's say we start with Ubuntu:

```bash
docker run -it ubuntu bash
```

Now we are inside the container.

We can install some software.

For example:

```bash
apt update
apt install maven -y
```

Now imagine we have customized the container.

We can create an image from this container using:

```bash
docker commit <container_id> <repository>/<image>:<tag>
```

Example:

```bash
docker commit 173233fbe3a3 loksaieta/pl-mvn-build:v1.0
```

The flow looks like this:

```text
Ubuntu Image
     |
     | docker run
     v
Ubuntu Container
     |
     | Install Maven
     | Make changes
     |
     | docker commit
     v
New Docker Image
pl-mvn-build:v1.0
```

Now check:

```bash
docker images
```

You should see your new image.

---

# 4. Why docker commit Is Not the Preferred Approach

`docker commit` is useful for learning and sometimes for capturing a manually configured container.

But it has a major problem.

The image creation process is not clearly documented as code.

Imagine someone asks:

> How exactly was this image created?

You might say:

```text
I started Ubuntu.
Then I installed Java.
Then I installed Maven.
Then I changed some configuration.
Then I installed some other packages.
Then I committed the container.
```

That is difficult to reproduce.

Another engineer may not know exactly what you did.

This is not ideal for DevOps.

We want:

```text
Configuration
      |
      v
Dockerfile
      |
      v
Repeatable Image
```

That is why `docker build` and Dockerfiles are much more important in real-world DevOps.

---

# 5. What Is a Dockerfile?

A **Dockerfile** is a text file containing instructions that Docker uses to build an image.

For example:

```dockerfile
FROM ubuntu

RUN apt update -y
RUN apt install maven -y
```

That's it.

We have now described the image creation process as code.

The flow becomes:

```text
Dockerfile
    |
    | docker build
    v
Docker Image
    |
    | docker run
    v
Container
```

This is much easier to understand, maintain, review and reproduce.

---

# 6. Creating Your First Dockerfile

Create a directory:

```bash
mkdir my-docker-image
cd my-docker-image
```

Create a file called:

```text
Dockerfile
```

For example:

```bash
vi Dockerfile
```

Add:

```dockerfile
FROM ubuntu

RUN apt update -y
RUN apt install maven -y
```

The file should look like:

```dockerfile
FROM ubuntu
RUN apt update -y
RUN apt install maven -y
```

Now we can build an image.

---

# 7. docker build

The command used to build an image is:

```bash
docker build -t <image_name> .
```

For example:

```bash
docker build -t loksaieta/pl-java-mvn-build .
```

Let's understand the command.

```text
docker build
```

Tells Docker to build an image.

```text
-t
```

Assigns a name/tag to the image.

```text
loksaieta/pl-java-mvn-build
```

Is the image name.

```text
.
```

Means:

> Use the current directory as the build context.

So:

```bash
docker build -t loksaieta/pl-java-mvn-build .
```

means:

> Build an image using the Dockerfile and files from the current directory, and tag the resulting image with this name.

---

# 8. Docker Build Context

The `.` at the end of the command is very important.

For example:

```bash
docker build -t myapp:v1.0 .
```

The final `.` means:

```text
Current Directory
       |
       +-- Dockerfile
       +-- application files
       +-- configuration files
       +-- other build files
```

Docker sends this directory as the **build context** to the Docker builder.

Diagram:

```text
myapp/
 |
 +-- Dockerfile
 +-- app.jar
 +-- config/
 +-- src/
 |
 |
 | docker build .
 v
Docker Builder
 |
 v
Docker Image
```

This is also why `.dockerignore` is important, which we will discuss later.

---

# 9. What Happens During docker build?

Suppose our Dockerfile is:

```dockerfile
FROM ubuntu

RUN apt update -y

RUN apt install maven -y
```

When we run:

```bash
docker build -t my-maven-image .
```

Docker processes the Dockerfile instructions.

Conceptually:

```text
Dockerfile
    |
    v
FROM ubuntu
    |
    v
Base Image
    |
    v
RUN apt update
    |
    v
Layer
    |
    v
RUN apt install maven
    |
    v
Layer
    |
    v
Final Docker Image
```

This leads us to one of the most important Docker concepts:

# Docker Image Layers

---

# 10. Docker Image Layers

Docker images are generally composed of multiple layers.

For example:

```text
Application Layer
----------------------
COPY application.jar

Maven/Java Layer
----------------------
RUN apt install maven

OS Update Layer
----------------------
RUN apt update

Base Image
----------------------
ubuntu
```

You can think of the image as a stack of layers.

```text
        +-----------------------+
        | Application Files     |
        +-----------------------+
        | Maven                 |
        +-----------------------+
        | Ubuntu Updates        |
        +-----------------------+
        | Ubuntu Base Image     |
        +-----------------------+
```

Each Dockerfile instruction that creates filesystem changes can contribute to another image layer.

This layered architecture provides important benefits.

---

# 11. Why Are Image Layers Useful?

Imagine you have two Docker images.

```text
Application A
    |
    +-- Ubuntu
    +-- Java
    +-- Maven
    +-- Application A

Application B
    |
    +-- Ubuntu
    +-- Java
    +-- Maven
    +-- Application B
```

Docker can reuse common layers.

Conceptually:

```text
              +-- Application A
              |
Ubuntu -------+-- Java
              |
              +-- Maven
              |
              +-- Application B
```

Instead of treating every image as completely independent data, Docker can reuse layers where possible.

This can make builds and storage more efficient.

---

# 12. Docker Build Cache

Docker also uses build caching.

Consider:

```dockerfile
FROM ubuntu

RUN apt update -y

RUN apt install maven -y

COPY app.jar /app/
```

Suppose we build this image today.

Docker processes each instruction.

Now imagine tomorrow we only change:

```text
app.jar
```

The earlier instructions may still be reusable from cache.

So Docker does not necessarily need to rebuild everything from the beginning.

Conceptually:

```text
FROM ubuntu
      |
      | Cached
      v
RUN apt update
      |
      | Cached
      v
RUN apt install maven
      |
      | Cached
      v
COPY app.jar
      |
      | Changed
      v
Rebuild
```

This is why the order of Dockerfile instructions matters.

---

# 13. Dockerfile Instruction — FROM

The first instruction you will commonly see is:

```dockerfile
FROM ubuntu
```

`FROM` defines the base image.

For example:

```dockerfile
FROM ubuntu
```

or:

```dockerfile
FROM python:3.12
```

or:

```dockerfile
FROM node:22
```

or:

```dockerfile
FROM tomcat:8.0
```

The base image provides the starting filesystem and environment for your image.

Think of it like building a house.

```text
Base Image
    |
    v
Foundation
    |
    v
Your Application
```

---

# 14. Why Should We Choose the Base Image Carefully?

The base image has a direct impact on:

* Image size
* Security
* Available packages
* Build time
* Runtime behavior

For example, instead of using a very large general-purpose operating system image, you may use a smaller image designed for your application.

For example:

```dockerfile
FROM python:3.12-alpine
```

or another trusted minimal base image when appropriate.

But don't blindly choose the smallest image.

You need to make sure your application and required libraries actually work correctly with it.

---

# 15. Dockerfile Instruction — RUN

`RUN` executes commands while building the image.

Example:

```dockerfile
FROM ubuntu

RUN apt update -y
RUN apt install maven -y
```

The commands execute during the image build.

This is different from a command executed when the container starts.

Think about the timing:

```text
docker build
     |
     +-- RUN commands execute
     |
     v
Docker Image
```

Then later:

```text
docker run
     |
     v
Container starts
```

So:

> `RUN` is primarily used to prepare the image.

---

# 16. Dockerfile Instruction — COPY

`COPY` copies files from the build context into the image.

For example:

```dockerfile
COPY app.jar /app/
```

Suppose our directory is:

```text
myapp/
 |
 +-- Dockerfile
 +-- app.jar
```

After:

```dockerfile
COPY app.jar /app/
```

the image contains:

```text
/app/app.jar
```

Diagram:

```text
Build Context
     |
     +-- app.jar
           |
           | COPY
           v
Docker Image
     |
     +-- /app/app.jar
```

`COPY` is one of the most frequently used Dockerfile instructions.

---

# 17. Dockerfile Instruction — ADD

`ADD` can also copy files into an image.

Example:

```dockerfile
ADD app.tar.gz /app/
```

`ADD` has some additional behavior, such as handling certain local archive files and supporting remote sources.

However, for straightforward local file copying, many teams prefer:

```dockerfile
COPY
```

because its behavior is simpler and more explicit.

A common rule is:

> Use `COPY` when you simply need to copy files. Use `ADD` only when you specifically need one of its additional features.

---

# 18. Dockerfile Instruction — WORKDIR

`WORKDIR` sets the working directory inside the image/container.

Example:

```dockerfile
WORKDIR /app
```

Then:

```dockerfile
COPY app.jar .
```

The `.` now refers to:

```text
/app
```

So the application ends up at:

```text
/app/app.jar
```

Instead of repeatedly writing:

```dockerfile
COPY app.jar /app/app.jar
```

you can use:

```dockerfile
WORKDIR /app
COPY app.jar .
```

It is cleaner and easier to read.

---

# 19. Dockerfile Instruction — ENV

`ENV` defines an environment variable in the image.

Example:

```dockerfile
ENV APP_ENV=production
```

You can define multiple variables:

```dockerfile
ENV APP_ENV=production
ENV APP_PORT=8080
```

Inside the container, these variables can be accessed by the application or shell.

For example:

```bash
echo $APP_ENV
```

would return:

```text
production
```

Be careful with secrets.

Do not put passwords, API keys, tokens or other sensitive credentials directly into a Dockerfile.

---

# 20. Dockerfile Instruction — ARG

`ARG` defines a build-time variable.

Example:

```dockerfile
ARG APP_VERSION=1.0
```

It can be used during the build.

For example:

```dockerfile
ARG APP_VERSION
RUN echo "Building version $APP_VERSION"
```

You can provide a value during the build:

```bash
docker build \
  --build-arg APP_VERSION=2.0 \
  -t myapp:v2.0 .
```

The important difference is:

```text
ARG
 |
 +-- Build-time value
```

while:

```text
ENV
 |
 +-- Environment variable available in the image/container
```

They are related, but they are not the same thing.

---

# 21. Dockerfile Instruction — EXPOSE

Suppose our application listens on port `8080`.

We can write:

```dockerfile
EXPOSE 8080
```

This documents that the application is intended to use port `8080`.

For example:

```dockerfile
FROM tomcat:8.0

COPY target/*.war /usr/local/tomcat/webapps

EXPOSE 8080
```

But there is an important point:

> `EXPOSE` does not by itself publish the port to the host.

You still need port mapping when running the container.

For example:

```bash
docker run -d -p 8085:8080 myapp:v1.0
```

So:

```text
EXPOSE 8080
```

documents the container port.

While:

```text
-p 8085:8080
```

publishes/maps the container port to a host port.

---

# 22. Dockerfile Instruction — CMD

`CMD` defines the default command that should run when the container starts.

For example:

```dockerfile
CMD ["echo", "Hello Docker"]
```

When you run:

```bash
docker run myimage
```

Docker starts the command defined by `CMD`.

Another example:

```dockerfile
CMD ["java", "-jar", "app.jar"]
```

Now when the container starts:

```text
Container
    |
    v
java -jar app.jar
    |
    v
Application
```

---

# 23. CMD Can Be Overridden

Suppose the Dockerfile contains:

```dockerfile
CMD ["echo", "Hello Docker"]
```

You can run:

```bash
docker run myimage
```

and Docker executes the default command.

But you can also provide another command:

```bash
docker run myimage echo "Hello DevOps"
```

The runtime command replaces the default `CMD`.

This is why `CMD` is often used for a default startup behavior.

---

# 24. Dockerfile Instruction — ENTRYPOINT

`ENTRYPOINT` defines the primary executable for the container.

For example:

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

The idea is:

> This container is intended to run this application.

`ENTRYPOINT` and `CMD` can also be used together.

For example:

```dockerfile
ENTRYPOINT ["java", "-jar"]
CMD ["app.jar"]
```

Then the effective command becomes:

```text
java -jar app.jar
```

The distinction between `CMD` and `ENTRYPOINT` is a common Docker interview question.

A simple way to remember it:

```text
CMD
 |
 +-- Default command / default arguments

ENTRYPOINT
 |
 +-- Main executable
```

The exact override behavior depends on how the instructions are written and how the container is started, so don't think of them as simply "one is permanent and one is not."

---

# 25. Shell Form vs Exec Form

You may see:

```dockerfile
CMD java -jar app.jar
```

This is called shell form.

You may also see:

```dockerfile
CMD ["java", "-jar", "app.jar"]
```

This is exec form.

For application containers, the exec form is often preferred because it gives the application a cleaner process relationship with the container and handles Unix signals more predictably.

Similarly:

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

is exec form.

As a DevOps engineer, you should be comfortable reading both styles.

---

# 26. Complete Dockerfile Example — Java Application

Let's create a simple Java application image.

Suppose the project produces:

```text
target/
    web_app.war
```

Our Dockerfile can be:

```dockerfile
FROM tomcat:8.0

COPY target/web_app.war /usr/local/tomcat/webapps/

EXPOSE 8080
```

The flow is:

```text
Java Source Code
       |
       | Build
       v
web_app.war
       |
       | COPY
       v
Docker Image
       |
       | docker run
       v
Tomcat Container
       |
       v
Web Application
```

Build the image:

```bash
docker build -t web-app:v1.0 .
```

Run it:

```bash
docker run -d -p 8085:8080 --name web-app web-app:v1.0
```

Now:

```text
Browser
   |
   | Host:8085
   v
Docker Host
   |
   | Port Mapping
   v
Container:8080
   |
   v
Tomcat
   |
   v
web_app.war
```

This is a very common containerization pattern for Java applications.

---

# 27. Complete Dockerfile Example — Python Application

Suppose we have:

```text
app.py
requirements.txt
Dockerfile
```

We can create:

```dockerfile
FROM python:3.12

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
```

The build flow becomes:

```text
Python Application
       |
       +-- requirements.txt
       +-- app.py
       |
       v
   Dockerfile
       |
       | docker build
       v
Python Docker Image
       |
       | docker run
       v
Python Container
```

---

# 28. Why COPY requirements.txt Separately?

Look at this:

```dockerfile
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
```

Why don't we simply copy everything first?

Because Docker uses build caching.

Suppose we change only:

```text
app.py
```

The dependencies in:

```text
requirements.txt
```

have not changed.

Docker may reuse the cached dependency installation layer.

Conceptually:

```text
FROM python
      |
      v
COPY requirements.txt
      |
      v
Install dependencies
      |
      | Cached
      v
COPY app.py
      |
      | Changed
      v
Rebuild this part
```

This can make builds significantly faster.

---

# 29. Docker Image Tagging

An image can have a name and tag.

For example:

```text
web-app:v1.0
```

Here:

```text
web-app
   |
   +-- Image name

v1.0
   |
   +-- Tag
```

You can build directly with a tag:

```bash
docker build -t web-app:v1.0 .
```

You can also tag an existing image using:

```bash
docker tag <source-image> <target-image>
```

For example:

```bash
docker tag web-app:v1.0 loksaieta/web-app:v1.0
```

Now the image has a Docker Hub-compatible name.

---

# 30. Docker Image Naming

A typical registry image reference can look like:

```text
registry/repository/image:tag
```

For example:

```text
docker.io/loksaieta/web-app:v1.0
```

Or:

```text
523450290.dkr.ecr.eu-central-1.amazonaws.com/my-app:1.0
```

Let's break it down:

```text
523450290.dkr.ecr.eu-central-1.amazonaws.com
              |
              +-- Registry

my-app
              |
              +-- Repository / image name

1.0
              |
              +-- Tag
```

This naming convention becomes very important when working with private registries such as AWS ECR.

---

# 31. Docker Hub

Docker Hub is a public container registry.

It can be used to:

* Store images
* Share images
* Download images
* Maintain image versions

The basic flow is:

```text
Developer
    |
    | docker build
    v
Local Docker Image
    |
    | docker push
    v
Docker Hub
    |
    | docker pull
    v
Deployment Server
```

Docker Hub:

[Docker Hub](https://hub.docker.com/?utm_source=chatgpt.com)

---

# 32. Logging in to Docker Hub

Before pushing an image, authenticate with Docker Hub.

Use:

```bash
docker login -u <username>
```

Docker may prompt you for credentials.

For Docker Hub, use a **Personal Access Token** rather than relying on your normal account password when prompted for authentication.

After successful login, Docker can authenticate against the registry.

---

# 33. Docker Push

Suppose our image is:

```text
loksaieta/web-app:v1.0
```

Push it using:

```bash
docker push loksaieta/web-app:v1.0
```

The flow is:

```text
Local Machine
     |
     +-- web-app:v1.0
     |
     | docker push
     v
Docker Hub
     |
     +-- web-app:v1.0
```

Now another machine can download it.

---

# 34. Docker Pull From Docker Hub

On another server:

```bash
docker pull loksaieta/web-app:v1.0
```

Now the image is available locally.

Then:

```bash
docker run -d -p 8085:8080 loksaieta/web-app:v1.0
```

The complete flow becomes:

```text
Developer Machine
       |
       | docker build
       v
Docker Image
       |
       | docker push
       v
Docker Hub
       |
       | docker pull
       v
QA / UAT / Production Server
       |
       | docker run
       v
Container
```

This is one of the most important Docker workflows for DevOps engineers.

---

# 35. Versioning Images

Suppose your application has multiple versions.

You can create:

```text
web-app:v1.0
web-app:v1.1
web-app:v2.0
```

Then push each version:

```bash
docker push loksaieta/web-app:v1.0
docker push loksaieta/web-app:v1.1
docker push loksaieta/web-app:v2.0
```

Now the registry contains multiple versions.

```text
Docker Hub
 |
 +-- web-app:v1.0
 |
 +-- web-app:v1.1
 |
 +-- web-app:v2.0
```

This is very useful in CI/CD.

For example:

```text
Git Commit
    |
    v
CI Build
    |
    v
Docker Image
    |
    v
web-app:v1.7
    |
    v
Container Registry
```

Later, deployment tools can deploy that exact image version.

---

# 36. Docker in a CI/CD Pipeline

Let's connect this with DevOps.

Suppose developers push code to GitHub.

The CI pipeline might look like this:

```text
Developer
    |
    | git push
    v
GitHub
    |
    v
Jenkins
    |
    +-- Build Application
    |
    +-- Run Tests
    |
    +-- Build Docker Image
    |
    +-- Tag Image
    |
    +-- Push Image
    v
Container Registry
```

For example:

```text
web_app.java
     |
     | Build
     v
web_app.war
     |
     | docker build
     v
web-app:v1.0
     |
     | docker push
     v
Docker Hub / ECR / ACR / GCR
```

Then the deployment environment pulls the image.

```text
Production
    |
    | docker pull
    v
web-app:v1.0
    |
    | docker run
    v
Container
```

This is where Docker becomes extremely valuable in CI/CD.

---

# 37. Dockerfile Best Practice — Use Trusted Base Images

One of the most important Docker security practices is:

> Use trusted and maintained base images.

For example:

```dockerfile
FROM ubuntu
```

is different from blindly using an image from an unknown source.

Before using a public image, understand:

* Who maintains it?
* Is it official?
* Is it regularly updated?
* Does it contain unnecessary software?
* Does it have known vulnerabilities?

For production workloads, don't randomly choose images from unknown sources.

---

# 38. Use Specific Versions

Avoid relying unnecessarily on floating tags.

For example:

```dockerfile
FROM python:3.12
```

is more predictable than:

```dockerfile
FROM python:latest
```

when you want the major/minor runtime version to remain stable.

For even stronger reproducibility, organizations can pin image references by digest.

For example, conceptually:

```text
image@sha256:<digest>
```

The digest identifies a specific image content.

This is particularly useful when reproducibility and supply-chain control are important.

---

# 39. Keep Images Small

Large Docker images create several problems.

They can:

* Take longer to download
* Take longer to build
* Consume more storage
* Increase the attack surface

For example, don't automatically install tools that your application does not need.

Instead of:

```text
Huge OS
+
Many development tools
+
Compilers
+
Debugging tools
+
Application
```

try to build:

```text
Minimal Base
+
Required Runtime
+
Application
```

This is one reason minimal base images are popular.

---

# 40. Use .dockerignore

Suppose your project directory contains:

```text
myapp/
 |
 +-- Dockerfile
 +-- app.py
 +-- requirements.txt
 +-- .git/
 +-- node_modules/
 +-- logs/
 +-- temporary-files/
 +-- large-test-data/
```

You probably don't want all of these files sent as part of the Docker build context.

Create:

```text
.dockerignore
```

For example:

```text
.git
node_modules
logs
tmp
*.log
```

Now Docker can exclude these files from the build context.

Conceptually:

```text
Project Directory
       |
       +-- Dockerfile
       +-- app.py
       +-- requirements.txt
       |
       X-- .git
       X-- logs
       X-- node_modules
       |
       v
Docker Build Context
```

This can reduce build context size and avoid accidentally copying unnecessary files.

---

# 41. Don't Put Secrets Inside Docker Images

This is extremely important.

Never do something like:

```dockerfile
ENV DB_PASSWORD=mysecretpassword
```

or:

```dockerfile
COPY production-password.txt /app/
```

Why?

Because Docker images are artifacts.

They can be:

* Stored
* Shared
* Downloaded
* Cached
* Scanned
* Pushed to registries

You don't want credentials baked into an image.

Instead, use appropriate secret-management mechanisms.

Examples include:

* Kubernetes Secrets
* Cloud secret managers
* CI/CD secret stores
* Docker secrets where applicable

The basic principle is:

```text
Application Image
       |
       X
   No Secrets
```

Secrets should be provided securely at runtime or through an appropriate secret-management system.

---

# 42. Run Containers as a Non-Root User

Many Docker images run processes as `root` by default.

That is not always the best security choice.

A better approach, where supported by the application, is to create a dedicated user.

For example:

```dockerfile
FROM ubuntu

RUN groupadd -r appgroup && \
    useradd -r -g appgroup appuser

WORKDIR /app

COPY app.jar .

USER appuser

CMD ["java", "-jar", "app.jar"]
```

Now the application runs as:

```text
appuser
```

rather than root.

The principle is:

> Give the application only the permissions it actually needs.

This is called the **principle of least privilege**.

---

# 43. Scan Docker Images for Vulnerabilities

A Docker image may contain:

* Operating system packages
* Runtime libraries
* Application dependencies

Any of these components can potentially contain vulnerabilities.

So image scanning is an important part of a secure container pipeline.

A typical CI/CD pipeline can look like:

```text
Source Code
     |
     v
Build
     |
     v
Docker Image
     |
     v
Security Scan
     |
     +---- Vulnerabilities found
     |          |
     |          v
     |       Fix / Reject
     |
     +---- Acceptable
              |
              v
         Push Registry
```

The exact scanning tool depends on your organization and platform.

---

# 44. Multi-Stage Builds

Now let's discuss an important Docker concept used to optimize images:

**Multi-stage builds.**

Imagine a Java application.

To build the application, you need:

```text
JDK
Maven
Source Code
Build Tools
```

But to run the application, maybe you only need:

```text
Java Runtime
Application JAR
```

Why should the production image contain Maven and all the source code?

It doesn't need them.

This is where multi-stage builds help.

---

# 45. Traditional Build Image

Without a multi-stage build:

```text
Docker Image
 |
 +-- JDK
 +-- Maven
 +-- Source Code
 +-- Dependencies
 +-- Build Tools
 +-- Application
```

The image may become unnecessarily large.

---

# 46. Multi-Stage Build

With a multi-stage build:

```text
Stage 1: Build
 |
 +-- JDK
 +-- Maven
 +-- Source Code
 |
 +-- Build Application
       |
       v
    app.jar


Stage 2: Runtime
 |
 +-- Runtime Image
 +-- app.jar
```

The final image contains only what is required to run the application.

---

# 47. Java Multi-Stage Dockerfile Example

For example:

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

Let's understand this.

First stage:

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
```

This stage contains Maven and the JDK.

Then:

```dockerfile
RUN mvn clean package -DskipTests
```

builds the application.

The result is something like:

```text
target/app.jar
```

Then we start a second stage:

```dockerfile
FROM eclipse-temurin:17-jre
```

This is the runtime image.

Finally:

```dockerfile
COPY --from=build /app/target/*.jar app.jar
```

copies only the application artifact from the build stage.

The final image doesn't need Maven or the source code.

---

# 48. Multi-Stage Build Diagram

The complete process looks like this:

```text
                 Dockerfile
                     |
        +------------+------------+
        |                         |
        v                         v
   Build Stage               Runtime Stage
        |                         |
   Maven + JDK                JRE
   Source Code                  |
        |                         |
        v                         |
    app.jar --------------------+
              COPY --from
                    |
                    v
             Final Image
                    |
                    v
               Container
```

This is a very common technique in production Dockerfiles.

---

# 49. Why Multi-Stage Builds Are Useful

They can help us:

* Reduce final image size
* Remove unnecessary build tools
* Reduce the attack surface
* Keep production images cleaner
* Separate build and runtime environments

This is especially useful for:

* Java
* Go
* Node.js
* .NET
* Frontend applications

---

# 50. Dockerfile Example for a WAR Application

Let's connect this to the Java/Tomcat example.

Suppose our CI process creates:

```text
target/web_app.war
```

Our Dockerfile could be:

```dockerfile
FROM tomcat:8.0

COPY target/web_app.war /usr/local/tomcat/webapps/

EXPOSE 8080
```

Build:

```bash
docker build -t web-app:v1.0 .
```

Run:

```bash
docker run -d \
  --name web-app \
  -p 8085:8080 \
  web-app:v1.0
```

The architecture becomes:

```text
Git Repository
      |
      v
Build Tool
      |
      v
web_app.war
      |
      v
Dockerfile
      |
      | docker build
      v
web-app:v1.0
      |
      | docker run
      v
Tomcat Container
      |
      v
Web Application
```

---

# 51. Complete CI/CD Example

Now let's imagine a real DevOps pipeline.

A developer changes the application:

```text
Source Code
     |
     v
GitHub
```

Jenkins detects the change:

```text
GitHub
   |
   v
Jenkins
```

Jenkins builds the application:

```text
Jenkins
   |
   +-- Maven Build
   |
   v
web_app.war
```

Then Docker builds the image:

```text
web_app.war
     |
     v
Dockerfile
     |
     v
docker build
     |
     v
web-app:v1.0
```

Then the image is pushed:

```text
web-app:v1.0
     |
     | docker push
     v
Container Registry
```

Production then pulls the image:

```text
Container Registry
       |
       | docker pull
       v
Production Server
       |
       | docker run
       v
Container
```

So the entire flow is:

```text
Developer
    |
    v
GitHub
    |
    v
Jenkins
    |
    +-- Build
    +-- Test
    |
    v
Application Artifact
    |
    v
Docker Build
    |
    v
Docker Image
    |
    v
Container Registry
    |
    v
Deployment
    |
    v
Container
```

This is the foundation of container-based CI/CD.

---

# 52. Public vs Private Container Registries

Not every image should be stored publicly.

For example:

### Public Images

Common open-source images:

```text
MySQL
MongoDB
Redis
Nginx
Ubuntu
Python
Node.js
```

These may come from public registries such as Docker Hub.

### Private Images

Company applications:

```text
company-payment-service
company-user-service
company-order-service
internal-web-app
```

These should generally be stored in private registries.

Examples include:

* AWS Elastic Container Registry — ECR
* Azure Container Registry — ACR
* Google Artifact Registry
* JFrog Artifactory

The architecture looks like:

```text
                    Container Registry
                           |
              +------------+------------+
              |                         |
              v                         v
        Public Images              Private Images
              |                         |
              v                         v
       Docker Hub                 Company Registry
```

---

# 53. Docker Registry in a Production Environment

Suppose a company has a Java application.

The CI pipeline creates:

```text
company-payment-service:v1.5
```

It pushes the image to a private registry:

```text
Private Registry
       |
       +-- company-payment-service:v1.5
       +-- company-payment-service:v1.4
       +-- company-payment-service:v1.3
```

Production can then pull the exact version:

```bash
docker pull company-payment-service:v1.5
```

This gives the deployment process a clear artifact to deploy.

---

# 54. Immutable Application Artifact

One of the biggest benefits of containerization is that we can treat the image as a deployment artifact.

For example:

```text
Build Once
    |
    v
web-app:v1.5
    |
    +----> QA
    |
    +----> UAT
    |
    +----> Production
```

Instead of rebuilding the application separately in each environment, the same tested image can move through the deployment pipeline.

This helps reduce:

```text
"It worked in QA, but production is different."
```

type of problems.

---

# 55. Dockerfile Best Practices — Quick List

When writing Dockerfiles, keep these principles in mind.

### 1. Use trusted base images

```dockerfile
FROM python:3.12
```

Choose images carefully.

### 2. Use specific versions

Avoid unnecessarily relying on:

```dockerfile
FROM python:latest
```

Prefer a known runtime version.

### 3. Keep images small

Don't install software that your application doesn't need.

### 4. Use `.dockerignore`

Don't send unnecessary files into the build context.

### 5. Use build cache intelligently

Place less frequently changing instructions earlier where practical.

### 6. Don't store secrets in images

Never bake passwords, tokens or API keys into Dockerfiles.

### 7. Run as a non-root user

Use least privilege whenever practical.

### 8. Scan images

Check images and dependencies for known vulnerabilities.

### 9. Use multi-stage builds

Keep build tools out of the final production image when they aren't needed at runtime.

### 10. Keep Dockerfiles readable

A Dockerfile is code.

Treat it like code.

---

# 56. Dockerfile Example Following Good Practices

Here is a simple example:

```dockerfile
FROM eclipse-temurin:17-jre

WORKDIR /app

RUN groupadd --system appgroup && \
    useradd --system --gid appgroup appuser

COPY target/app.jar app.jar

USER appuser

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

The idea is:

```text
Trusted Runtime
      |
      v
Working Directory
      |
      v
Application
      |
      v
Non-root User
      |
      v
Port Documentation
      |
      v
Application Startup
```

The exact commands for creating users vary across Linux distributions and base images, so always check the base image you're using.

---

# 57. Docker Image vs Dockerfile vs Container

At this point, beginners often confuse these three.

Let's make it simple.

## Dockerfile

Instructions:

```text
"How should I build this image?"
```

Example:

```dockerfile
FROM python:3.12
COPY app.py /app/
CMD ["python", "/app/app.py"]
```

## Docker Image

The packaged artifact:

```text
"Here is the application and its required filesystem/runtime."
```

Example:

```text
my-python-app:v1.0
```

## Docker Container

The running instance:

```text
"Run this image as an application."
```

Diagram:

```text
Dockerfile
    |
    | docker build
    v
Docker Image
    |
    | docker run
    v
Docker Container
```

This three-step relationship is extremely important.

---

# 58. A Simple Real-World Analogy

Think about a cake.

### Dockerfile

The recipe.

```text
Recipe
 |
 +-- Add flour
 +-- Add eggs
 +-- Add sugar
 +-- Bake
```

### Docker Image

The prepared cake.

```text
Cake
```

### Docker Container

The cake being served and used.

```text
Cake on the table
```

In Docker:

```text
Dockerfile
    |
    | Build
    v
Image
    |
    | Run
    v
Container
```

Once you understand this, many Docker concepts become easier.

---

# 59. Commands You Should Know After Part 3

## Build Image

```bash
docker build -t myapp:v1.0 .
```

## Tag Image

```bash
docker tag myapp:v1.0 username/myapp:v1.0
```

## Login

```bash
docker login -u <username>
```

## Push Image

```bash
docker push username/myapp:v1.0
```

## Pull Image

```bash
docker pull username/myapp:v1.0
```

## Run Image

```bash
docker run -d username/myapp:v1.0
```

## List Images

```bash
docker images
```

---

# 60. Interview Questions

After Part 3, you should be able to answer questions like these.

### What is a Dockerfile?

A Dockerfile is a text file containing instructions used to build a Docker image.

### What is the difference between `docker commit` and `docker build`?

`docker commit` creates an image from an existing container, while `docker build` creates an image from a Dockerfile and build context.

### What does `FROM` do?

It specifies the base image for the Docker image.

### What does `RUN` do?

It executes commands during the image build process.

### What does `COPY` do?

It copies files from the build context into the image.

### What does `WORKDIR` do?

It sets the working directory inside the image/container.

### What does `EXPOSE` do?

It documents the port that the application listens on inside the container. It does not itself publish the port to the host.

### What is the difference between `CMD` and `ENTRYPOINT`?

Both influence the process started when a container runs. `ENTRYPOINT` is generally used to define the primary executable, while `CMD` provides default command or arguments that can be overridden depending on how the container is started.

### What is a Docker image layer?

A layer is a filesystem change that forms part of the image's layered structure.

### Why is Docker build cache useful?

It allows Docker to reuse unchanged build steps, which can make subsequent builds faster.

### Why do we use `.dockerignore`?

To exclude unnecessary files from the Docker build context.

### Why shouldn't secrets be stored in Docker images?

Because images are distributable artifacts and secrets baked into them can be exposed through image access, layers, caches or registries.

### What is a multi-stage Docker build?

A build that uses multiple stages so that build dependencies can be kept out of the final runtime image.

---

# 61. The Docker Image Creation Flow

If you remember only one diagram from this part, remember this one:

```text
                 Source Code
                     |
                     v
                Dockerfile
                     |
                     | docker build
                     v
               Docker Image
                     |
          +----------+----------+
          |                     |
          | docker tag          | docker run
          v                     v
      Tagged Image          Container
          |
          | docker push
          v
   Container Registry
          |
          | docker pull
          v
   Deployment Server
```

This is the basic journey of a Docker image.

---

# 62. Final Takeaway

At this point, we have moved from simply **running Docker containers** to actually **building and distributing Docker images**.

The key concepts are:

```text
Dockerfile
    |
    v
docker build
    |
    v
Docker Image
    |
    +-- Layers
    +-- Tag
    +-- Application
    +-- Dependencies
    |
    v
docker push
    |
    v
Container Registry
    |
    v
docker pull
    |
    v
docker run
    |
    v
Container
```

And the most important Dockerfile instructions to remember are:

```text
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

For production-quality Docker images, remember:

```text
Trusted Base Image
        +
Specific Versions
        +
Small Image
        +
.dockerignore
        +
Good Layer Caching
        +
No Secrets
        +
Non-Root User
        +
Vulnerability Scanning
        +
Multi-Stage Build
        |
        v
Better Docker Image
```

Docker is no longer just:

```bash
docker run
```

For a DevOps or Kubernetes engineer, the bigger picture is:

```text
Source Code
     |
     v
Build
     |
     v
Dockerfile
     |
     v
Docker Image
     |
     v
Container Registry
     |
     v
Deployment Platform
     |
     v
Container
```

That image becomes the **artifact that moves through the CI/CD pipeline**.

---

# Coming Next: Part 4 — Docker Compose, Swarm, Kubernetes and Production

In Part 4, we will move from **one container** to **multiple containers**.

We will discuss:

```text
Docker Compose
     |
     v
Multi-Container Applications
     |
     v
Container Networking
     |
     v
Service Management
     |
     v
Docker Swarm
     |
     v
Kubernetes
     |
     v
Pods
     |
     v
Replicas
     |
     v
Load Balancing
     |
     v
Self-Healing
     |
     v
Auto Scaling
```

We will also connect Docker with Kubernetes and understand an important question:

> **If Docker can run containers, why do we need Kubernetes?**

That is where we move from learning Docker commands to understanding **container orchestration and Kubernetes architecture**.
