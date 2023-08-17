clio createw creatio-git-project

create github repo by admin (use UI)

git init
git add .
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/Advance-Technologies-Foundation/creatio-git-project.git
git push -u origin master

---
new branch
update workspaceSettings.json (mention packages)
update workspaceEnvironmentSettings.json (mention environment)
clio restorew -e Postman

Create new branch
git checkout -b Postman
clio restorew
