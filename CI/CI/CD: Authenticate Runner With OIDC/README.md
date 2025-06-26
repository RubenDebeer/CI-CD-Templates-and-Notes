# 🔐 GitHub Actions Authentication with AWS using OIDC

This guide explains how to securely authenticate GitHub Actions workflows to AWS **without using long-term credentials**, using **OpenID Connect (OIDC)**.

---

## 🚀 Why Use OIDC?

- ✅ **No AWS secrets stored in GitHub**
- ✅ **Short-lived credentials issued by AWS**
- ✅ **Secure, auditable, and compliant**
- ✅ **Recommended by AWS and GitHub**

---

## 🧾 Prerequisites

- AWS IAM Role with trust relationship for GitHub OIDC
- GitHub Actions workflow in your repo
- Basic understanding of IAM roles and GitHub Actions

---

## 🛠️ Step-by-Step Setup

### 🧩 Step 1: Create an IAM Role for OIDC Access

1. Go to AWS IAM Console → **Roles** → **Create Role**
2. Select **Web Identity** as trusted entity
3. Set:
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
4. Attach desired permissions (e.g., `AmazonS3FullAccess`, or custom)
5. Edit the trust relationship to allow only your repo/branch:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:sub": "repo:<owner>/<repo>:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### 🤖 Step 2: Set Up GitHub Actions Workflow
Add the following to your `.github/workflows/your-workflow.yml` I called mine 'deploy.yml'
```
name: Deploy to AWS using OIDC

on:
  push:
    branches:
      - main

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v3
        with:
          role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/<YourOIDCRole>
          aws-region: us-east-1

      - name: Verify AWS Identity
        run: aws sts get-caller-identity
```
### ✅ Step 3: Run and Verify
Push to the main branch. Your workflow should:
	•	Fetch a signed OIDC token from GitHub
	•	Assume the AWS IAM role via sts:AssumeRoleWithWebIdentity
	•	Execute AWS CLI calls using temporary credentials

The step aws sts get-caller-identity should output your AWS account and role info.

### 🔗 Reference Links
📘 GitHub Docs – OIDC with AWS
https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

📘 AWS Docs – IAM OIDC Identity Providers
https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html