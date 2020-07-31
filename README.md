# Visualscore

Prototyp

## Install

Get node and npm running, either by downloading it from <https://nodejs.org> or by installing with [homebrew](https://brew.sh).

```bash
brew install node
```

Clone the repository and change directories.

```bash
git clone https://github.com/laurens-in/CedricLuziusLaurens.git
```

Install the dependencies plus a local webserver for testing:

```bash
npm install
npm install -g http-server
```

Run the local test server and open <http://127.0.0.1:8080> in the browser.

```bash
http-server .
```

## git manual

```bash
bash username$ git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
bash username$ git add README.md
bash username$ git commit -m 'Updated installation instructions'
bash username$ git push
```
