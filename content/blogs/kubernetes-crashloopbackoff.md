---
title: Troubleshooting CrashLoopBackOff
description: A practical production troubleshooting workflow for Kubernetes pods restarting repeatedly.
date: 2026-07-28
tags:
- Kubernetes
- DevOps
- Troubleshooting
cover: /images/architecture-placeholder.svg
author: Praveen Kumar
readingTime: 7 min
---

# Troubleshooting CrashLoopBackOff

`CrashLoopBackOff` means Kubernetes is repeatedly starting a container and backing off between restarts.

## Start with the pod

```bash
kubectl get pod -n <namespace>
kubectl describe pod <pod> -n <namespace>
kubectl logs <pod> -n <namespace>
kubectl logs <pod> -n <namespace> --previous
```

Check events, exit codes, probe failures, configuration, mounted storage and resource pressure.

## Common causes

1. OOMKilled containers
2. Application startup failures
3. Failed liveness/readiness probes
4. Missing ConfigMaps or Secrets
5. Volume mount issues
6. Bad image or entrypoint
7. Node-level resource pressure

The goal is not merely to restart the pod, but to identify the root cause and document the remediation.
