# How to publish an article

Drop a `.md` file into the right folder here. That is the whole process — nothing is
rebuilt, no code changes, no redeploy.

```
blog/
├── aws/          → /blog/aws
│   └── aws-s3-complete-guide.md   → /blog/aws/aws-s3-complete-guide
├── docker/
├── kubernetes/
└── terraform/
```

**The folder name is the category, and the file name is the URL.** Create a folder that
does not exist yet and the category page appears with it.

Name files in lowercase with hyphens — `aws-s3-complete-guide.md`, not
`AWS S3 Guide.md`. The file name becomes the URL exactly as written.

## Front matter

Every article starts with a front-matter block between `---` lines:

```markdown
---
title: "AWS EC2 Complete Beginner Guide"
description: "Learn AWS EC2 from basics to advanced concepts."
category: "AWS"
tags:
  - AWS
  - EC2
  - Cloud
author: "Praveen"
date: "2026-09-28"
image: "/images/aws-ec2.jpg"
---

# AWS EC2 Complete Beginner Guide

Article content starts here.
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Recommended | Falls back to the file name. Used as the page `<title>`. |
| `description` | Recommended | Used as the meta description and the card summary. Write a real one per article — it is what shows in Google results. |
| `category` | No | Only overrides the **display label**; the folder decides the category and the URL. |
| `tags` | No | A list, used for filtering, search and related articles. |
| `author` | No | Defaults to Praveen Kumar. |
| `date` | No | `YYYY-MM-DD`. Sorts the blog. Defaults to the file's upload time. |
| `image` | No | Featured image, e.g. `/images/aws-ec2.jpg`. Upload the image to `images/`. |
| `readingTime` | No | Calculated from the word count if omitted. |

`cover:` still works as an alias for `image:`, so older articles do not need editing.

## Drafts

A file or folder starting with `_` or `.` is **not** published. Park a work in progress
as `_my-draft.md` and rename it when it is ready. That is why this README is
`_README.md` — it never shows up as an article.

## After uploading

The article is live immediately at `/blog/<folder>/<filename>`, and appears on `/blog`,
on its category page, in search, in related articles and in `sitemap.xml`.

To get it indexed faster, paste the URL into Google Search Console → URL Inspection →
Request Indexing.
